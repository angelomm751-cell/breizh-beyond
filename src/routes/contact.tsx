import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import maisonImage from "@/assets/breizh-maison.jpg";
export const Route = createFileRoute("/contact")({ head: () => ({ meta: [
  { title: "Contact — BREIZH FOOD" }, { name: "description", content: "Contactez la maison BREIZH FOOD au Portugal." },
  { property: "og:title", content: "Contact — BREIZH FOOD" }, { property: "og:description", content: "Contacts, adresse et horaires de BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Contact });
function Contact() { return <section className="contact-page"><div className="contact-image"><img src={maisonImage} alt="La maison BREIZH FOOD" width={1536} height={1024} /></div><div className="contact-copy"><span className="eyebrow">Bienvenue chez nous</span><h1>À votre<br /><em>rencontre.</em></h1><div className="contact-list"><div><MapPin /><span><strong>Adresse</strong>À confirmer · Portugal</span></div><div><Mail /><span><strong>Email</strong><a href="mailto:bonjour@breizhfood.pt">bonjour@breizhfood.pt</a></span></div><div><span className="contact-number">01</span><span><strong>Horaires</strong>À confirmer avant ouverture</span></div></div><Link to="/commander" className="brand-link brand-link--navy">Commander à domicile <ArrowRight size={16} /></Link><p className="demo-note">Les coordonnées et horaires présentés sont provisoires.</p></div></section>; }