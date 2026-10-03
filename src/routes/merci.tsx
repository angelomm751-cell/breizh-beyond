import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
export const Route = createFileRoute("/merci")({ head: () => ({ meta: [
  { title: "Obrigado — BREIZH FOOD" }, { name: "description", content: "Confirmação do seu pedido de encomenda BREIZH FOOD." },
  { property: "og:title", content: "Obrigado — BREIZH FOOD" }, { property: "og:description", content: "O seu pedido foi recebido." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Merci });
function Merci() { return <section className="success-page"><div className="success-mark"><Check /></div><div className="success-line" /><span className="eyebrow">Encomenda de demonstração</span><h1>Obrigado&nbsp;!</h1><p>O seu processo de encomenda terminou. Na integração real, a confirmação e os detalhes serão apresentados aqui.</p><Link to="/" className="brand-link brand-link--gold">Voltar ao início <ArrowRight size={16} /></Link></section>; }