import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { DELIVERY_FEE, FREE_DELIVERY_FROM } from "./menu";

export const ORDER_STATUSES = ["pending", "preparing", "ready", "on_the_way", "delivered", "cancelled"] as const;

function checkPin(pin: string) {
  const expected = process.env["ADMIN_PIN"];
  if (!expected || pin !== expected) throw new Error("PIN inválido");
}
async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

const pinSchema = z.object({ pin: z.string().min(1).max(64) });

/* ---------- Public: orders ---------- */
const orderSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(255),
  address: z.string().trim().max(200).optional().default(""),
  postal: z.string().trim().max(20).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  notes: z.string().trim().max(500).optional().default(""),
  delivery: z.enum(["home", "pickup"]),
  payment: z.enum(["mbway", "card", "on_delivery"]),
  items: z.array(z.object({ id: z.string().max(80), quantity: z.number().int().min(1).max(50) })).min(1).max(40),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => orderSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.delivery === "home" && (!data.address || !data.postal || !data.city)) throw new Error("Morada obrigatória para entrega.");
    const db = await admin();
    const { data: menu, error } = await db.from("menu_items").select("id,name,price").in("id", data.items.map((i) => i.id)).eq("available", true);
    if (error) throw new Error("Não foi possível validar a ementa.");
    const fallbackItems = (await import("./menu")).products;
    const items = data.items.flatMap((i) => {
      const m = menu?.find((x) => x.id === i.id);
      if (m) return [{ id: m.id, name: m.name, price: Number(m.price), quantity: i.quantity }];
      const f = fallbackItems.find((x) => x.id === i.id);
      return f ? [{ id: f.id, name: f.name, price: f.price, quantity: i.quantity }] : [];
    });
    if (!items.length) throw new Error("Produtos indisponíveis.");
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const fee = data.delivery === "pickup" || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
    const { data: row, error: insErr } = await db.from("orders").insert({
      customer_name: data.name, phone: data.phone, email: data.email,
      address: data.address, postal: data.postal, city: data.city, notes: data.notes,
      delivery: data.delivery, payment: data.payment, payment_status: "pending", items,
      subtotal, delivery_fee: fee, total: subtotal + fee,
    }).select("id").single();
    if (insErr || !row) throw new Error("Não foi possível registar a encomenda.");
    return { id: row.id };
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: o } = await db.from("orders").select("number,status,delivery,payment,payment_status,items,subtotal,delivery_fee,total,created_at,customer_name").eq("id", data.id).maybeSingle();
    if (!o) return null;
    return { ...o, customer_name: o.customer_name.split(" ")[0], items: o.items as { name: string; quantity: number; price: number }[], subtotal: Number(o.subtotal), delivery_fee: Number(o.delivery_fee), total: Number(o.total) };
  });

/* ---------- PIN-protected: admin & kitchen ---------- */
export const verifyPin = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.parse(d))
  .handler(async ({ data }) => { checkPin(data.pin); return { ok: true }; });

export const adminListMenu = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { data: rows } = await (await admin()).from("menu_items").select("*").order("sort_order");
    return (rows ?? []).map((r) => ({ ...r, price: Number(r.price) }));
  });

const itemSchema = z.object({
  id: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(120),
  category: z.enum(["Galettes", "Crêpes", "Spécialités", "Desserts", "Boissons"]),
  description: z.string().trim().max(400),
  price: z.number().min(0).max(1000),
  image: z.string().trim().min(1).max(2000),
  position: z.string().trim().max(40).default("center"),
  available: z.boolean(),
  sort_order: z.number().int().min(0).max(10000),
});

export const adminSaveItem = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.extend({ item: itemSchema }).parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { error } = await (await admin()).from("menu_items").upsert(data.item);
    if (error) throw new Error("Erro ao guardar.");
    return { ok: true };
  });

export const adminDeleteItem = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.extend({ id: z.string().max(80) }).parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    await (await admin()).from("menu_items").delete().eq("id", data.id);
    return { ok: true };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.extend({ dataUrl: z.string().max(7_500_000) }).parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const match = /^data:(image\/(jpeg|png|webp));base64,(.+)$/.exec(data.dataUrl);
    const mime = match?.[1], ext = match?.[2], b64 = match?.[3];
    if (!mime || !ext || !b64) throw new Error("Formato de imagem inválido (JPG, PNG ou WEBP).");
    const bytes = Buffer.from(b64, "base64");
    const path = `${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`;
    const db = await admin();
    const { error } = await db.storage.from("menu").upload(path, bytes, { contentType: mime });
    if (error) throw new Error("Erro no envio da imagem.");
    const { data: signed } = await db.storage.from("menu").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (!signed) throw new Error("Erro no envio da imagem.");
    return { url: signed.signedUrl };
  });

export const kitchenListOrders = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const since = new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString();
    const { data: rows } = await (await admin()).from("orders").select("*").gte("created_at", since).order("created_at", { ascending: false });
    return (rows ?? []).map((o) => ({ ...o, items: o.items as { name: string; quantity: number }[], total: Number(o.total) }));
  });

export const kitchenSetPaid = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { error } = await (await admin()).from("orders").update({ payment_status: "paid", updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) throw new Error("Não foi possível marcar o pagamento.");
    return { ok: true };
  });

export const kitchenSetStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => pinSchema.extend({ id: z.string().uuid(), status: z.enum(ORDER_STATUSES) }).parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    // Uber Direct hook: when status becomes "on_the_way" for a home delivery,
    // the real integration will create the courier delivery here.
    await (await admin()).from("orders").update({ status: data.status, updated_at: new Date().toISOString() }).eq("id", data.id);
    return { ok: true };
  });
