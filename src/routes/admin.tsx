import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PinGate } from "@/components/pin-gate";
import { Button } from "@/components/button";
import { adminDeleteItem, adminListMenu, adminSaveItem, adminUploadImage } from "@/lib/shop.functions";
import { categories, formatPrice, resolveImage, type Category } from "@/lib/menu";
import { menuQueryKey } from "@/hooks/use-menu";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Gestão da ementa — BREIZH FOOD" }, { name: "description", content: "Área reservada de gestão da ementa." },
    { property: "og:title", content: "Gestão — BREIZH FOOD" }, { property: "og:description", content: "Área reservada." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: () => <PinGate title="Gestão da ementa">{(pin, logout) => <Admin pin={pin} logout={logout} />}</PinGate>,
});

type Item = { id: string; name: string; category: Category; description: string; price: number; image: string; position: string; available: boolean; sort_order: number };

function Admin({ pin, logout }: { pin: string; logout: () => void }) {
  const list = useServerFn(adminListMenu);
  const { data = [], refetch } = useQuery({ queryKey: ["admin-menu"], queryFn: () => list({ data: { pin } }) });
  const [editing, setEditing] = useState<Item | null>(null);
  const blank = (): Item => ({ id: "", name: "", category: "Galettes", description: "", price: 0, image: "local:hero", position: "center", available: true, sort_order: (data.at(-1)?.sort_order ?? 0) + 1 });
  return (
    <section className="staff-page">
      <div className="staff-head"><div><span className="eyebrow">Área reservada</span><h1>A ementa</h1></div><div className="staff-head-actions"><Button tone="gold" onClick={() => setEditing(blank())}><Plus size={15} /> Novo prato</Button><button className="text-link" onClick={logout}>Sair</button></div></div>
      {editing && <Editor pin={pin} item={editing} isNew={!data.some((d) => d.id === editing.id)} onDone={() => { setEditing(null); void refetch(); }} />}
      <div className="admin-list">
        {data.map((item) => (
          <button key={item.id} className={item.available ? "admin-row" : "admin-row is-off"} onClick={() => setEditing(item as Item)}>
            <img src={resolveImage(item.image)} alt="" width={64} height={64} style={{ objectPosition: item.position }} />
            <span><span className="eyebrow">{item.category}{item.available ? "" : " · escondido"}</span><strong>{item.name}</strong></span>
            <em>{formatPrice(item.price)}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || `prato-${Date.now()}`;

function Editor({ pin, item, isNew, onDone }: { pin: string; item: Item; isNew: boolean; onDone: () => void }) {
  const [form, setForm] = useState(item);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = useServerFn(adminSaveItem);
  const remove = useServerFn(adminDeleteItem);
  const upload = useServerFn(adminUploadImage);
  const qc = useQueryClient();
  const set = <K extends keyof Item>(k: K, v: Item[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError("Imagem demasiado grande (máx. 5 MB).");
    setBusy(true); setError("");
    const dataUrl = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(file); });
    try { const { url } = await upload({ data: { pin, dataUrl } }); set("image", url); } catch (e) { setError(e instanceof Error ? e.message : "Erro no envio."); }
    setBusy(false);
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      await save({ data: { pin, item: { ...form, id: isNew ? slug(form.name) : form.id } } });
      void qc.invalidateQueries({ queryKey: menuQueryKey }); onDone();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao guardar."); setBusy(false); }
  };
  const del = async () => {
    if (!confirm(`Apagar “${form.name}”?`)) return;
    setBusy(true); await remove({ data: { pin, id: form.id } });
    void qc.invalidateQueries({ queryKey: menuQueryKey }); onDone();
  };
  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="admin-photo"><img src={resolveImage(form.image)} alt="" style={{ objectPosition: form.position }} /><label className="brand-button brand-button--outline">{busy ? "A enviar…" : "Mudar foto"}<input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} /></label></div>
      <div className="form-grid">
        <label className="form-wide">Nome<input required maxLength={120} value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
        <label>Categoria<select value={form.category} onChange={(e) => set("category", e.target.value as Category)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Preço (€)<input required type="number" min={0} step="0.1" value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></label>
        <label className="form-wide">Descrição<textarea rows={3} maxLength={400} value={form.description} onChange={(e) => set("description", e.target.value)} /></label>
        <label>Ordem<input type="number" min={0} value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></label>
        <label className="admin-check"><input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} /> Visível no site</label>
      </div>
      {error && <p className="staff-error" role="alert">{error}</p>}
      <div className="admin-actions"><Button type="submit" tone="gold" disabled={busy}>Guardar</Button><button type="button" className="text-link" onClick={onDone}>Cancelar</button>{!isNew && <button type="button" className="text-link admin-delete" onClick={del}>Apagar</button>}</div>
    </form>
  );
}
