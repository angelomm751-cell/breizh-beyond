import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import maisonImage from "@/assets/breizh-maison.jpg";
export const Route = createFileRoute("/contact")({ head: () => ({ meta: [
  { title: "Contacto — BREIZH FOOD" }, { name: "description", content: "Contacte a BREIZH FOOD em Portugal." },
  { property: "og:title", content: "Contacto — BREIZH FOOD" }, { property: "og:description", content: "Contacto, morada e horários da BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Contact });
function Contact() { return <section className="contact-page"><div className="contact-image"><img src={maisonImage} alt="A casa BREIZH FOOD" width={1536} height={1024} /></div><div className="contact-copy"><span className="eyebrow">Bem-vindo à nossa casa</span><h1>Ao seu<br /><em>encontro.</em></h1><div className="contact-list"><div><MapPin /><span><strong>Morada</strong>A confirmar · Portugal</span></div><div><Mail /><span><strong>Email</strong><a href="mailto:bonjour@breizhfood.pt">bonjour@breizhfood.pt</a></span></div><div><span className="contact-number">01</span><span><strong>Horários</strong>A confirmar antes da abertura</span></div></div><Link to="/commander" className="brand-link brand-link--navy">Encomendar para casa <ArrowRight size={16} /></Link><p className="demo-note">Os contactos e horários apresentados são provisórios.</p></div></section>; }