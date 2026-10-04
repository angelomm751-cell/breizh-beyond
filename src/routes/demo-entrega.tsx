import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, MapPin, Truck } from "lucide-react";

export const Route = createFileRoute("/demo-entrega")({
  head: () => ({ meta: [
    { title: "Demonstração de entrega — BREIZH FOOD" },
    { name: "description", content: "Demonstração visual do acompanhamento de uma entrega." },
    { name: "robots", content: "noindex, nofollow, noarchive" },
  ] }),
  component: DemoEntrega,
});

function DemoEntrega() {
  return (
    <main className="delivery-demo">
      <div className="delivery-demo-head">
        <div>
          <span className="eyebrow">Modo demonstração · sem pagamento</span>
          <h1>Acompanhamento <em>da entrega</em></h1>
          <p>Exemplo visual de como o cliente verá o acompanhamento depois de fazer uma encomenda.</p>
        </div>
        <Link to="/gestao" className="text-link"><ArrowLeft size={14} /> Gestão</Link>
      </div>

      <section className="delivery-demo-card">
        <div className="delivery-demo-map" aria-label="Mapa de demonstração">
          <div className="demo-road demo-road-a" />
          <div className="demo-road demo-road-b" />
          <div className="demo-road demo-road-c" />
          <div className="demo-route-line" />
          <div className="demo-place demo-place-start"><span><MapPin size={18} /></span><b>Breizh Food</b><small>Centro Comercial Duas Rosas</small></div>
          <div className="demo-place demo-place-end"><span><MapPin size={18} /></span><b>Destino</b><small>Morada do cliente</small></div>
          <div className="demo-truck"><Truck size={25} /><span>A caminho</span></div>
          <div className="demo-eta">≈ 12 min</div>
        </div>

        <div className="delivery-demo-status">
          <div><span className="eyebrow">Pedido de demonstração</span><strong>n.º BF-DEMO-001</strong></div>
          <div className="demo-status-pill"><Check size={14} /> Estafeta a caminho</div>
        </div>

        <ol className="demo-timeline">
          <li className="is-done"><i><Check size={12} /></i><span>Pedido recebido<small>Concluído</small></span></li>
          <li className="is-done"><i><Check size={12} /></i><span>Em preparação<small>Concluído</small></span></li>
          <li className="is-active"><i><Truck size={12} /></i><span>A caminho<small>Estafeta em trânsito</small></span></li>
          <li><i /><span>Entregue<small>A aguardar</small></span></li>
        </ol>
      </section>

      <p className="demo-note">Isto é apenas uma demonstração. Não cria encomendas, não cobra dinheiro e não envia nenhum estafeta.</p>
    </main>
  );
}
