import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
export const Route = createFileRoute("/merci")({ head: () => ({ meta: [
  { title: "Merci — BREIZH FOOD" }, { name: "description", content: "Confirmation de votre demande de commande BREIZH FOOD." },
  { property: "og:title", content: "Merci — BREIZH FOOD" }, { property: "og:description", content: "Votre demande a bien été reçue." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Merci });
function Merci() { return <section className="success-page"><div className="success-mark"><Check /></div><div className="success-line" /><span className="eyebrow">Commande de démonstration</span><h1>Merci&nbsp;!</h1><p>Votre parcours de commande est terminé. Lors de l’intégration réelle, la confirmation et les détails seront affichés ici.</p><Link to="/" className="brand-link brand-link--gold">Retour à la maison <ArrowRight size={16} /></Link></section>; }