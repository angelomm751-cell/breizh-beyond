import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PinGate } from "@/components/pin-gate";
import { Button } from "@/components/button";
import { adminListMenu, adminSaveItem, kitchenListOrders, kitchenSetPaid, kitchenSetStatus } from "@/lib/shop.functions";
import { formatPrice } from "@/lib/menu";

export const Route = createFileRoute("/gestao")({
  head: () => ({ meta: [
    { title: "Gestão — BREIZH FOOD" },
    { name: "description", content: "Área privada de gestão da BREIZH FOOD." },
    { name: "robots", content: "noindex, nofollow, noarchive" },
  ] }),
  component: () => <PinGate title="Gestão Breizh Food">{(pin, logout) => <Dashboard pin={pin} logout={logout} />}</PinGate>,
});

const statusLabels: Record<string, string> = {
  pending: "Nova",
  preparing: "Em preparação",
  ready: "Pronta",
  on_the_way: "A caminho",
  delivered: "Concluída",
  cancelled: "Cancelada",
};

function Dashboard({ pin, logout }: { pin: string; logout: () => void }) {
  const listOrders = useServerFn(kitchenListOrders);
  const listMenu = useServerFn(adminListMenu);
  const setStatus = useServerFn(kitchenSetStatus);
  const setPaid = useServerFn(kitchenSetPaid);
  const saveItem = useServerFn(adminSaveItem);
  const qc = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["gestao-orders"],
    queryFn: () => listOrders({ data: { pin } }),
    refetchInterval: 8000,
  });
  const { data: menu = [] } = useQuery({
    queryKey: ["gestao-menu"],
    queryFn: () => listMenu({ data: { pin } }),
  });

  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const pending = active.filter((o) => o.status === "pending").length;
  const preparing = active.filter((o) => o.status === "preparing").length;
  const unavailable = menu.filter((o) => !o.available).length;

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["gestao-orders"] });
    void qc.invalidateQueries({ queryKey: ["gestao-menu"] });
  };

  const move = async (id: string, status: "preparing" | "ready" | "on_the_way" | "delivered" | "cancelled") => {
    await setStatus({ data: { pin, id, status } });
    refresh();
  };

  const markPaid = async (id: string) => {
    await setPaid({ data: { pin, id } });
    refresh();
  };

  const toggleAvailability = async (item: typeof menu[number]) => {
    await saveItem({ data: { pin, item: { ...item, available: !item.available, price: Number(item.price), sort_order: Number(item.sort_order) } } });
    refresh();
  };

  return (
    <main className="management-page">
      <header className="management-head">
        <div>
          <span className="eyebrow">Área privada · tablet</span>
          <h1>Gestão <em>Breizh Food</em></h1>
          <p>Painel central de pedidos, cozinha e ementa.</p>
        </div>
        <button className="text-link" onClick={logout}>Sair</button>
      </header>

      <section className="management-stats" aria-label="Resumo">
        <article><span>Novos pedidos</span><strong>{pending}</strong></article>
        <article><span>Em preparação</span><strong>{preparing}</strong></article>
        <article><span>Pratos indisponíveis</span><strong>{unavailable}</strong></article>
      </section>

      <section className="management-actions">
        <Link to="/cuisine" className="management-action"><span>👨‍🍳</span><strong>Cozinha</strong><small>Pedidos em tempo real</small></Link>
        <Link to="/admin" className="management-action"><span>🍽️</span><strong>Editar ementa</strong><small>Pratos, preços e fotografias</small></Link>
      </section>

      <section className="management-section">
        <div className="management-section-head"><div><span className="eyebrow">Pedidos</span><h2>Pedidos ativos</h2></div></div>
        {!active.length && <p className="staff-empty">Não existem pedidos ativos.</p>}
        <div className="management-orders">
          {active.map((o) => (
            <article className="management-order" key={o.id}>
              <div className="management-order-top">
                <strong>n.º {o.number}</strong>
                <span>{statusLabels[o.status] ?? o.status}</span>
              </div>
              <p>{o.customer_name} · {o.delivery === "home" ? "Entrega" : "Levantamento"}</p>
              <ul>{o.items.map((i) => <li key={i.name}><b>{i.quantity}×</b> {i.name}</li>)}</ul>
              <div className="management-order-bottom">
                <strong>{formatPrice(o.total)}</strong>
                <span>{o.payment_status === "paid" ? "✓ Pago" : "Pagamento pendente"}</span>
              </div>
              <div className="management-order-buttons">
                {o.status === "pending" && <Button tone="gold" onClick={() => move(o.id, "preparing")}>Aceitar</Button>}
                {o.payment_status !== "paid" && <button onClick={() => markPaid(o.id)}>Marcar pago</button>}
                {o.status === "preparing" && <button onClick={() => move(o.id, o.delivery === "home" ? "on_the_way" : "ready")}>{o.delivery === "home" ? "Enviar" : "Pronta"}</button>}
                {(o.status === "ready" || o.status === "on_the_way") && <button onClick={() => move(o.id, "delivered")}>Concluir</button>}
                <button className="is-quiet" onClick={() => move(o.id, "cancelled")}>Cancelar</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="management-section">
        <div className="management-section-head"><div><span className="eyebrow">Ementa</span><h2>Disponibilidade rápida</h2></div><Link to="/admin" className="text-link">Editar tudo</Link></div>
        <div className="management-menu">
          {menu.map((item) => (
            <button key={item.id} className={item.available ? "management-menu-row" : "management-menu-row is-off"} onClick={() => void toggleAvailability(item)}>
              <span><strong>{item.name}</strong><small>{formatPrice(Number(item.price))}</small></span>
              <em>{item.available ? "Disponível" : "Indisponível"}</em>
            </button>
          ))}
        </div>
      </section>

      <footer className="management-footer">
        <span>BREIZH FOOD · Área privada</span>
        <span>Atualização automática ativa</span>
      </footer>
    </main>
  );
}
