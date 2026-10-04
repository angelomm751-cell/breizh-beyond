import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Navigation, Bike } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/menu";

const START: [number, number] = [41.5957, -8.7383];
const DEST: [number, number] = [41.6050, -8.7386];

export const Route = createFileRoute("/demo-encomenda")({
  head: () => ({ meta: [
    { title: "Demonstração de encomenda — BREIZH FOOD" },
    { name: "description", content: "Faça uma encomenda de demonstração sem pagamento." },
    { name: "robots", content: "noindex, nofollow, noarchive" },
  ] }),
  component: DemoEncomenda,
});

function DemoMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let map: any, vehicle: any, frame = 0, stopped = false;
    const run = async () => {
      try {
        if (!(window as any).L) {
          await new Promise<void>((resolve, reject) => {
            const css = document.querySelector('link[data-breizh-leaflet-css]'); if (!css) { const link = document.createElement("link"); link.rel = "stylesheet"; link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; link.dataset.breizhLeafletCss = "true"; document.head.appendChild(link); }\n            const old = document.querySelector('script[data-breizh-leaflet]');
            if (old) { old.addEventListener("load", () => resolve(), { once: true }); old.addEventListener("error", () => reject(), { once: true }); return; }
            const s = document.createElement("script");
            s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            s.dataset.breizhLeaflet = "true"; s.onload = () => resolve(); s.onerror = () => reject(); document.head.appendChild(s);
          });
        }
        if (stopped || !ref.current) return;
        const L = (window as any).L;
        map = L.map(ref.current, { zoomControl: true }).setView(START, 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
        const icon = (html: string) => L.divIcon({ className: "breizh-map-icon", html, iconSize: [42, 42], iconAnchor: [21, 21] });
        L.marker(START, { icon: icon('<div class="breizh-map-pin breizh-map-pin--shop">BF</div>') }).addTo(map).bindPopup("<b>BREIZH FOOD</b><br>Centro Comercial Duas Rosas");
        L.marker(DEST, { icon: icon('<div class="breizh-map-pin breizh-map-pin--home">⌂</div>') }).addTo(map).bindPopup("<b>Destino</b><br>Morada de demonstração");
        const url = `https://router.project-osrm.org/route/v1/driving/${START[1]},${START[0]};${DEST[1]},${DEST[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("route");
        const json = await res.json();
        const points = json.routes?.[0]?.geometry?.coordinates?.map((p: [number, number]) => [p[1], p[0]]) ?? [];
        if (!points.length || stopped) throw new Error("route");
        const line = L.polyline(points, { color: "#b69a63", weight: 6, opacity: .9 }).addTo(map);
        map.fitBounds(line.getBounds(), { padding: [35, 35] });
        vehicle = L.marker(points[0], { icon: icon('<div class="breizh-map-bike">🏍️</div>'), zIndexOffset: 1000 }).addTo(map);
        let start = performance.now();
        const duration = 12000;
        const animate = (now: number) => {
          if (stopped) return;
          let p = (now - start) / duration;
          if (p >= 1) { start = now; p = 0; }
          vehicle.setLatLng(points[Math.min(points.length - 1, Math.floor(p * (points.length - 1)))]);
          frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      } catch { if (!stopped) setError(true); }
    };
    run();
    return () => { stopped = true; cancelAnimationFrame(frame); if (map) map.remove(); };
  }, []);

  return <div className="demo-real-map-wrap">
    <div ref={ref} className="demo-real-map" />
    {error && <div className="demo-map-fallback"><Navigation size={22} /><strong>Mapa temporariamente indisponível</strong><span>O mapa real volta a carregar quando a ligação estiver disponível.</span></div>}
    <div className="demo-map-badge"><Bike size={14} /> Estafeta a caminho</div>
  </div>;
}

function DemoEncomenda() {
  const [started, setStarted] = useState(false);
  const { lines, total } = useCart();
  return <main className="demo-order-page">
    <Link to="/commander" className="text-link"><ArrowLeft size={14} /> Voltar à encomenda</Link>
    {!started ? <section className="demo-order-panel">
      <span className="eyebrow">Modo demonstração · sem pagamento</span>
      <h1>Experimentar uma <em>encomenda</em></h1>
      <p>Esta é uma simulação para veres como funciona o acompanhamento da entrega. Não é cobrado nada e não cria um pedido real.</p>
      <div className="demo-fake-cart">{lines.length > 0 ? <>{lines.map(({ product, quantity }) => <><span key={product.id}>{product.name} × {quantity}</span><strong>{formatPrice(product.price * quantity)}</strong></>)}<b>Total</b><strong>{formatPrice(total)}</strong></> : <><span>Exemplo de demonstração</span><strong>0,00 €</strong></>}</div>
      <button className="brand-link brand-link--gold demo-confirm" onClick={() => setStarted(true)}>Fingir encomenda — sem pagar <Navigation size={17} /></button>
    </section> : <section className="demo-order-panel">
      <span className="eyebrow">Pedido #BF-DEMO-001 · demonstração</span>
      <h1>Encomenda <em>a caminho</em></h1>
      <div className="demo-paid"><Check size={15} /> Pagamento simulado · 0 € cobrado</div>
      <DemoMap />
      <ol className="demo-live-steps"><li>✓ Recebida</li><li>✓ Preparada</li><li className="active">🏍️ A caminho</li><li>○ Entregue</li></ol>
      <p className="demo-warning">Demonstração apenas. Não existe cobrança, pedido real ou estafeta real.</p>
    </section>}
  </main>;
}
