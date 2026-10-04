import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { PinGate } from "@/components/pin-gate";
import { kitchenListOrders, kitchenSetPaid, kitchenSetStatus } from "@/lib/shop.functions";
import { formatPrice } from "@/lib/menu";

export const Route = createFileRoute("/cuisine")({
  head: () => ({ meta: [
    { title: "Cuisine — BREIZH FOOD" }, { name: "description", content: "Ecrã de pedidos da cozinha." },
    { property: "og:title", content: "Cuisine — BREIZH FOOD" }, { property: "og:description", content: "Ecrã de pedidos da cozinha." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: () => <PinGate title="Cuisine">{(pin, logout) => <Kitchen pin={pin} logout={logout} />}</PinGate>,
});

const labels: Record<string, string> = { pending: "Nova", preparing: "Em preparação", ready: "Pronta", on_the_way: "A caminho", delivered: "Concluída", cancelled: "Cancelada" };
const payLabels: Record<string, string> = { mbway: "MB WAY", card: "Cartão", on_delivery: "Pagar na entrega/balcão" };

function Kitchen({ pin, logout }: { pin: string; logout: () => void }) {
  const list = useServerFn(kitchenListOrders);
  const setStatus = useServerFn(kitchenSetStatus);
  const setPaid = useServerFn(kitchenSetPaid);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["kitchen"], queryFn: () => list({ data: { pin } }), refetchInterval: 8_000 });
  const seen = useRef<number | null>(null);
  const pending = data.filter((o) => o.status === "pending").length;
  useEffect(() => {
    if (seen.current !== null && pending > seen.current) {
      try { const ctx = new AudioContext(); const o = ctx.createOscillator(); o.frequency.value = 880; o.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.25); } catch { /* sound optional */ }
    }
    seen.current = pending;
  }, [pending]);
  const markPaid = async (id: string) => {
    await setPaid({ data: { pin, id } });
    void qc.invalidateQueries({ queryKey: ["kitchen"] });
  };
  const move = async (id: string, status: (typeof labels extends Record<infer K, string> ? K : never) & string) => {
    await setStatus({ data: { pin, id, status: status as "pending" } });
    void qc.invalidateQueries({ queryKey: ["kitchen"] });
  };
  const active = data.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const done = data.filter((o) => ["delivered", "cancelled"].includes(o.status));
  return (
    <section className="staff-page">
      <div className="staff-head"><div><span className="eyebrow">Ecrã da cozinha · atualiza sozinho</span><h1>Commandes</h1></div><button className="text-link" onClick={logout}>Sair</button></div>
      {!active.length && <p className="staff-empty">Sem encomendas ativas.</p>}
      <div className="kitchen-grid">
        {[...active, ...done.slice(0, 6)].map((o) => (
          <article key={o.id} className={`kitchen-card is-${o.status}`}>
            <header><strong>n° {o.number}</strong><span>{labels[o.status]}</span></header>
            <p className="kitchen-meta">{new Date(o.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })} · {o.delivery === "home" ? "Entrega" : "Levantamento"} · {payLabels[o.payment]}</p>
            <ul>{o.items.map((i) => <li key={i.name}><b>{i.quantity}×</b> {i.name}</li>)}</ul>
            {o.notes && <p className="kitchen-notes">“{o.notes}”</p>}
            <p className="kitchen-meta">{o.customer_name} · <a href={`tel:${o.phone}`}>{o.phone}</a></p>
            {o.delivery === "home" && <p className="kitchen-meta"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.address}, ${o.postal} ${o.city}`)}`} target="_blank" rel="noreferrer">{o.address}, {o.city}</a></p>}
            <p className="kitchen-total">{formatPrice(o.total)}</p>
            <p className="kitchen-meta">{o.payment_status === "paid" ? "✓ Pago" : "Pagamento pendente"}</p>
            <div className="kitchen-actions">
              {o.status === "pending" && <button onClick={() => move(o.id, "preparing")}>Aceitar e preparar</button>}
              {o.payment_status !== "paid" && <button className="is-quiet" onClick={() => markPaid(o.id)}>Marcar como pago</button>}
              {o.status === "preparing" && (o.delivery === "home"
                ? <button onClick={() => move(o.id, "on_the_way")}>Chamar estafeta</button>
                : <button onClick={() => move(o.id, "ready")}>Pronta a levantar</button>)}
              {(o.status === "ready" || o.status === "on_the_way") && <button onClick={() => move(o.id, "delivered")}>Concluir</button>}
              {!["delivered", "cancelled"].includes(o.status) && <button className="is-quiet" onClick={() => move(o.id, "cancelled")}>Cancelar</button>}
            </div>
          </article>
        ))}
      </div>
      <p className="demo-note">“Chamar estafeta” fica ligado à Uber Direct quando a conta do restaurante for configurada.</p>
    </section>
  );
}
