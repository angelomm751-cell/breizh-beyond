import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, MapPin, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/menu";

export const Route = createFileRoute("/demo-encomenda")({
  head: () => ({ meta: [
    { title: "Demonstração de encomenda — BREIZH FOOD" },
    { name: "description", content: "Faça uma encomenda de demonstração sem pagamento." },
    { name: "robots", content: "noindex, nofollow, noarchive" },
  ] }),
  component: DemoEncomenda,
});

function DemoEncomenda() {
  const [started, setStarted] = useState(false);
  const { lines, total } = useCart();
  return (
    <main className="demo-order-page">
      <Link to="/commander" className="text-link"><ArrowLeft size={14} /> Voltar à encomenda</Link>
      {!started ? (
        <section className="demo-order-panel">
          <span className="eyebrow">Modo demonstração · sem pagamento</span>
          <h1>Experimentar uma <em>encomenda</em></h1>
          <p>Esta é uma simulação para veres como funciona o acompanhamento da entrega. Não é cobrado nada e não cria um pedido real.</p>
          <div className="demo-fake-cart">{lines.length > 0 ? <>{lines.map(({ product, quantity }) => <><span>{product.name} × {quantity}</span><strong>{formatPrice(product.price * quantity)}</strong></>)}<b>Total</b><strong>{formatPrice(total)}</strong></> : <><span>Exemplo de demonstração</span><strong>0,00 €</strong></>}</div>
          <button className="brand-link brand-link--gold demo-confirm" onClick={() => setStarted(true)}>Fingir encomenda — sem pagar <Truck size={17} /></button>
        </section>
      ) : (
        <section className="demo-order-panel">
          <span className="eyebrow">Pedido #BF-DEMO-001 · demonstração</span>
          <h1>Encomenda <em>a caminho</em></h1>
          <div className="demo-paid"><Check size={15} /> Pagamento simulado · 0 € cobrado</div>
          <div className="demo-live-map">
            <div className="demo-live-route" />
            <div className="demo-live-place demo-live-start"><MapPin size={16} /><b>Breizh Food</b><small>Centro Comercial Duas Rosas</small></div>
            <div className="demo-live-place demo-live-end"><MapPin size={16} /><b>Destino</b><small>Morada de demonstração</small></div>
            <div className="demo-live-truck"><Truck size={23} /><span>A caminho</span></div>
            <strong className="demo-live-eta">≈ 12 min</strong>
          </div>
          <ol className="demo-live-steps"><li>✓ Recebida</li><li>✓ Preparada</li><li className="active">🚚 A caminho</li><li>○ Entregue</li></ol>
          <p className="demo-warning">Demonstração apenas. Não existe cobrança, pedido real ou estafeta real.</p>
        </section>
      )}
    </main>
  );
}
