import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart";
import { Button } from "@/components/button";
import { formatPrice } from "@/lib/menu";

export const Route = createFileRoute("/checkout")({ head: () => ({ meta: [
  { title: "Finalizar encomenda — BREIZH FOOD" }, { name: "description", content: "Finalize a sua encomenda BREIZH FOOD." },
  { property: "og:title", content: "Finalizar encomenda — BREIZH FOOD" }, { property: "og:description", content: "Uma encomenda simples, pensada para o seu telemóvel." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Checkout });
function Checkout() {
  const { lines, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitting(true); window.setTimeout(() => { clear(); void navigate({ to: "/merci" }); }, 650); };
  if (!lines.length) return <section className="empty-page"><span className="eyebrow">A sua encomenda</span><h1>O carrinho está vazio.</h1><p>Escolha primeiro alguns sabores da casa.</p><Link to="/commander" className="brand-link brand-link--navy">Ver a seleção <ArrowRight size={16} /></Link></section>;
  return <section className="checkout-page"><div className="checkout-form"><Link to="/commander" className="back-link"><ArrowLeft size={15} /> Voltar à ementa</Link><span className="eyebrow">Último passo</span><h1>Os seus dados</h1><form onSubmit={submit}><div className="form-grid"><label>Nome completo<input required name="name" autoComplete="name" /></label><label>Telefone<input required name="phone" type="tel" autoComplete="tel" /></label><label className="form-wide">Email<input required name="email" type="email" autoComplete="email" /></label><label className="form-wide">Morada<input required name="address" autoComplete="street-address" /></label><label>Código postal<input required name="postal" autoComplete="postal-code" /></label><label>Localidade<input required name="city" autoComplete="address-level2" /></label><label className="form-wide">Observações<textarea name="notes" rows={3} /></label></div><fieldset><legend>Método de entrega</legend><label className="delivery-option"><input type="radio" name="delivery" value="home" defaultChecked /><span><strong>Entrega ao domicílio</strong><small>Disponibilidade a confirmar</small></span></label><label className="delivery-option is-disabled"><input type="radio" name="delivery" value="pickup" disabled /><span><strong>Levantamento no local</strong><small>Em breve disponível</small></span></label></fieldset><Button type="submit" tone="gold" arrow disabled={submitting}>{submitting ? "A confirmar…" : "Confirmar encomenda"}</Button><p className="demo-note">Apenas demonstração. Não será solicitado qualquer pagamento nem será enviada uma encomenda real.</p></form></div><aside className="checkout-summary"><span className="eyebrow">Resumo</span>{lines.map(({ product, quantity }) => <div className="summary-line" key={product.id}><span>{quantity} × {product.name}</span><strong>{formatPrice(product.price * quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div></aside></section>;
}