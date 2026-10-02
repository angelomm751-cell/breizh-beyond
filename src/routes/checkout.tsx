import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart";
import { Button } from "@/components/button";
import { formatPrice } from "@/lib/menu";

export const Route = createFileRoute("/checkout")({ head: () => ({ meta: [
  { title: "Finaliser la commande — BREIZH FOOD" }, { name: "description", content: "Finalisez votre commande BREIZH FOOD." },
  { property: "og:title", content: "Finaliser la commande — BREIZH FOOD" }, { property: "og:description", content: "Une commande simple, pensée pour votre mobile." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Checkout });
function Checkout() {
  const { lines, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitting(true); window.setTimeout(() => { clear(); void navigate({ to: "/merci" }); }, 650); };
  if (!lines.length) return <section className="empty-page"><span className="eyebrow">Votre commande</span><h1>Le panier est vide.</h1><p>Choisissez d’abord quelques saveurs de la maison.</p><Link to="/commander" className="brand-link brand-link--navy">Voir la sélection <ArrowRight size={16} /></Link></section>;
  return <section className="checkout-page"><div className="checkout-form"><Link to="/commander" className="back-link"><ArrowLeft size={15} /> Retour à la carte</Link><span className="eyebrow">Dernière étape</span><h1>Votre adresse</h1><form onSubmit={submit}><div className="form-grid"><label>Nom complet<input required name="name" autoComplete="name" /></label><label>Téléphone<input required name="phone" type="tel" autoComplete="tel" /></label><label className="form-wide">Email<input required name="email" type="email" autoComplete="email" /></label><label className="form-wide">Morada<input required name="address" autoComplete="street-address" /></label><label>Código postal<input required name="postal" autoComplete="postal-code" /></label><label>Localidade<input required name="city" autoComplete="address-level2" /></label><label className="form-wide">Observações<textarea name="notes" rows={3} /></label></div><fieldset><legend>Método de entrega</legend><label className="delivery-option"><input type="radio" name="delivery" value="home" defaultChecked /><span><strong>Livraison à domicile</strong><small>Disponibilité à confirmer</small></span></label><label className="delivery-option is-disabled"><input type="radio" name="delivery" value="pickup" disabled /><span><strong>Retrait sur place</strong><small>Bientôt disponible</small></span></label></fieldset><Button type="submit" tone="gold" arrow disabled={submitting}>{submitting ? "Confirmation…" : "Confirmer la commande"}</Button><p className="demo-note">Démonstration uniquement. Aucun paiement ne sera demandé et aucune commande réelle ne sera transmise.</p></form></div><aside className="checkout-summary"><span className="eyebrow">Récapitulatif</span>{lines.map(({ product, quantity }) => <div className="summary-line" key={product.id}><span>{quantity} × {product.name}</span><strong>{formatPrice(product.price * quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div></aside></section>;
}