import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart";
import { Button } from "@/components/button";
import { deliveryFeeFor, formatPrice, FREE_DELIVERY_FROM } from "@/lib/menu";
import { createOrder } from "@/lib/shop.functions";

export const Route = createFileRoute("/checkout")({ head: () => ({ meta: [
  { title: "Finalizar encomenda — BREIZH FOOD" }, { name: "description", content: "Finalize a sua encomenda BREIZH FOOD." },
  { property: "og:title", content: "Finalizar encomenda — BREIZH FOOD" }, { property: "og:description", content: "Uma encomenda simples, pensada para o seu telemóvel." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Checkout });

type Delivery = "home" | "pickup";
type Payment = "mbway" | "card" | "on_delivery";

function Checkout() {
  const { lines, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("home");
  const [payment, setPayment] = useState<Payment>("mbway");
  const navigate = useNavigate();
  const send = useServerFn(createOrder);
  const fee = deliveryFeeFor(total, delivery);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSubmitting(true);
    const f = new FormData(event.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "");
    try {
      const { id } = await send({ data: { name: v("name"), phone: v("phone"), email: v("email"), address: v("address"), postal: v("postal"), city: v("city"), notes: v("notes"), delivery, payment, items: lines.map((l) => ({ id: l.product.id, quantity: l.quantity })) } });
      clear();
      void navigate({ to: "/suivi/$id", params: { id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar a encomenda.");
      setSubmitting(false);
    }
  };

  if (!lines.length) return <section className="empty-page"><span className="eyebrow">A sua encomenda</span><h1>O carrinho está vazio.</h1><p>Escolha primeiro alguns sabores da casa.</p><Link to="/commander" className="brand-link brand-link--navy">Ver a seleção <ArrowRight size={16} /></Link></section>;
  return <section className="checkout-page"><div className="checkout-form"><Link to="/commander" className="back-link"><ArrowLeft size={15} /> Voltar à ementa</Link><span className="eyebrow">Último passo</span><h1>Os seus dados</h1><form onSubmit={submit}>
    <fieldset><legend>Método de entrega</legend>
      <label className="delivery-option"><input type="radio" name="delivery" checked={delivery === "home"} onChange={() => setDelivery("home")} /><span><strong>Livraison à domicile</strong><small>Entrega por estafeta · {formatPrice(4.5)} · grátis acima de {formatPrice(FREE_DELIVERY_FROM)}</small></span></label>
      <label className="delivery-option"><input type="radio" name="delivery" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} /><span><strong>Retrait sur place</strong><small>Levantamento no balcão · sem custos</small></span></label>
    </fieldset>
    <div className="form-grid"><label>Nome completo<input required name="name" autoComplete="name" maxLength={100} /></label><label>Telefone<input required name="phone" type="tel" autoComplete="tel" maxLength={30} /></label><label className="form-wide">Email<input required name="email" type="email" autoComplete="email" maxLength={255} /></label>
      {delivery === "home" && <><label className="form-wide">Morada<input required name="address" autoComplete="street-address" maxLength={200} /></label><label>Código postal<input required name="postal" autoComplete="postal-code" maxLength={20} /></label><label>Localidade<input required name="city" autoComplete="address-level2" maxLength={100} /></label></>}
      <label className="form-wide">Observações<textarea name="notes" rows={3} maxLength={500} /></label></div>
    <fieldset><legend>Pagamento</legend>
      <label className="delivery-option"><input type="radio" name="payment" checked={payment === "mbway"} onChange={() => setPayment("mbway")} /><span><strong>MB WAY</strong><small>Receberá o pedido de pagamento no telemóvel</small></span></label>
      <label className="delivery-option"><input type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} /><span><strong>Cartão · Apple Pay</strong><small>Pagamento seguro online</small></span></label>
      <label className="delivery-option"><input type="radio" name="payment" checked={payment === "on_delivery"} onChange={() => setPayment("on_delivery")} /><span><strong>{delivery === "home" ? "Pagar na entrega" : "Pagar no balcão"}</strong><small>Dinheiro ou multibanco</small></span></label>
    </fieldset>
    {error && <p className="staff-error" role="alert">{error}</p>}
    <Button type="submit" tone="gold" arrow disabled={submitting}>{submitting ? "A confirmar…" : "Passer la commande"}</Button><p className="demo-note">Modo demonstração: nenhum pagamento real é cobrado.</p></form></div>
    <aside className="checkout-summary"><span className="eyebrow">Resumo</span>{lines.map(({ product, quantity }) => <div className="summary-line" key={product.id}><span>{quantity} × {product.name}</span><strong>{formatPrice(product.price * quantity)}</strong></div>)}<div className="summary-line"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><div className="summary-line"><span>{delivery === "home" ? "Entrega" : "Levantamento"}</span><strong>{fee ? formatPrice(fee) : "Grátis"}</strong></div><div className="summary-total"><span>Total</span><strong>{formatPrice(total + fee)}</strong></div></aside></section>;
}
