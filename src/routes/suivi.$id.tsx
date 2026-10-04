import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { getOrder } from "@/lib/shop.functions";
import { formatPrice } from "@/lib/menu";

export const Route = createFileRoute("/suivi/$id")({
  head: () => ({ meta: [
    { title: "Suivi de commande — BREIZH FOOD" }, { name: "description", content: "Acompanhe a sua encomenda BREIZH FOOD em tempo real." },
    { property: "og:title", content: "Suivi de commande — BREIZH FOOD" }, { property: "og:description", content: "Acompanhe a sua encomenda em tempo real." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Suivi,
});

const homeSteps = [["pending", "Recebida"], ["preparing", "Em preparação"], ["on_the_way", "A caminho"], ["delivered", "Entregue"]] as const;
const pickupSteps = [["pending", "Recebida"], ["preparing", "Em preparação"], ["ready", "Pronta a levantar"], ["delivered", "Levantada"]] as const;
const rank: Record<string, number> = { pending: 0, preparing: 1, ready: 2, on_the_way: 2, delivered: 3 };

function Suivi() {
  const { id } = Route.useParams();
  const fetchOrder = useServerFn(getOrder);
  const { data: order, isLoading } = useQuery({ queryKey: ["order", id], queryFn: () => fetchOrder({ data: { id } }), refetchInterval: 10_000 });
  if (isLoading) return <section className="empty-page"><span className="eyebrow">Suivi</span><h1>A carregar…</h1></section>;
  if (!order) return <section className="empty-page"><span className="eyebrow">Suivi</span><h1>Encomenda não encontrada.</h1><Link to="/" className="brand-link brand-link--navy">Voltar ao início <ArrowRight size={16} /></Link></section>;
  const steps = order.delivery === "pickup" ? pickupSteps : homeSteps;
  const current = order.status === "ready" && order.delivery === "home" ? 1 : rank[order.status] ?? 0;
  return (
    <section className="track-page">
      <div className="success-mark"><Check /></div>
      <span className="eyebrow">Commande n° {order.number}</span>
      <h1>Merci, {order.customer_name}&nbsp;!</h1>
      <p>Votre commande est bien reçue. Esta página atualiza-se sozinha.</p>
      {order.status === "cancelled" ? <p className="staff-error">Esta encomenda foi cancelada. Contacte o restaurante.</p> :
      <ol className="track-steps">{steps.map(([key, label], i) => <li key={key} className={i <= current ? "is-done" : ""} aria-current={i === current ? "step" : undefined}><i /><span>{label}</span></li>)}</ol>}
      {order.delivery === "home" && <div className="track-map"><MapPin aria-hidden="true" /><p>{order.status === "on_the_way" ? "O estafeta está a caminho." : "O mapa do estafeta aparece aqui quando a entrega começar."}</p></div>}
      <div className="track-summary">{order.items.map((i) => <div className="summary-line" key={i.name}><span>{i.quantity} × {i.name}</span><strong>{formatPrice(i.price * i.quantity)}</strong></div>)}<div className="summary-line"><span>Entrega</span><strong>{order.delivery_fee ? formatPrice(order.delivery_fee) : "Grátis"}</strong></div><div className="summary-total"><span>Total</span><strong>{formatPrice(order.total)}</strong></div></div>
      <p className="demo-note">Guarde este link para voltar a acompanhar a encomenda.</p>
    </section>
  );
}
