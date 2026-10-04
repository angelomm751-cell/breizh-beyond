import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Navigation, Bike } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/menu";

const START: [number, number] = [41.61318, -8.740647];
const DEST: [number, number] = [41.605277, -8.742535];

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

    const loadLeaflet = async () => {
      const css = document.querySelector('link[data-breizh-leaflet-css]') as HTMLLinkElement | null;
      if (!css) {
        await new Promise<void>((resolve, reject) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.dataset.breizhLeafletCss = "true";
          link.onload = () => resolve();
          link.onerror = () => reject(new Error("leaflet-css"));
          document.head.appendChild(link);
        });
      }

      if (!(window as any).L) {
        await new Promise<void>((resolve, reject) => {
          const old = document.querySelector('script[data-breizh-leaflet]') as HTMLScriptElement | null;
          if (old) {
            old.addEventListener("load", () => resolve(), { once: true });
            old.addEventListener("error", () => reject(new Error("leaflet-js")), { once: true });
            return;
          }
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.dataset.breizhLeaflet = "true";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("leaflet-js"));
          document.head.appendChild(script);
        });
      }
    };

    const run = async () => {
      try {
        await loadLeaflet();
        if (stopped || !ref.current) return;

        const L = (window as any).L;
        map = L.map(ref.current, {
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: false,
        }).setView(START, 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        const markerIcon = (html: string, size = 48) =>
          L.divIcon({
            className: "breizh-map-icon",
            html,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });

        const shop = L.marker(START, {
          icon: markerIcon('<div class="breizh-map-pin breizh-map-pin--shop"><span>BF</span></div>'),
          zIndexOffset: 1200,
        }).addTo(map);

        shop.bindTooltip("BREIZH FOOD", {
          permanent: true,
          direction: "top",
          offset: [0, -25],
          className: "breizh-map-label",
        });

        const home = L.marker(DEST, {
          icon: markerIcon('<div class="breizh-map-pin breizh-map-pin--home"><span>⌂</span></div>'),
          zIndexOffset: 1100,
        }).addTo(map);

        home.bindTooltip("DOMICÍLIO", {
          permanent: true,
          direction: "top",
          offset: [0, -25],
          className: "breizh-map-label",
        });

        const url = `https://router.project-osrm.org/route/v1/driving/${START[1]},${START[0]};${DEST[1]},${DEST[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("route");

        const json = await res.json();
        const points =
          json.routes?.[0]?.geometry?.coordinates?.map((p: [number, number]) => [p[1], p[0]]) ?? [];

        if (!points.length || stopped) throw new Error("route");

        const line = L.polyline(points, {
          color: "#b69a63",
          weight: 6,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        const bounds = line.getBounds().extend(START).extend(DEST);
        map.fitBounds(bounds, {
          paddingTopLeft: [55, 70],
          paddingBottomRight: [55, 70],
          maxZoom: 16,
          animate: false,
        });

        const carHtml = `
          <div class="breizh-delivery-bike" aria-label="Mota do estafeta">
            <div class="breizh-bike-body"></div>
            <div class="breizh-bike-wheel breizh-bike-wheel--front"></div>
            <div class="breizh-bike-wheel breizh-bike-wheel--back"></div>
            <div class="breizh-bike-light"></div>
          </div>`;

        vehicle = L.marker(points[0], {
          icon: markerIcon(carHtml, 62),
          zIndexOffset: 2500,
        }).addTo(map);

        const move = (now: number) => {
          if (stopped) return;
          const duration = 11000;
          const elapsed = now % duration;
          const progress = elapsed / duration;
          const index = Math.min(points.length - 1, Math.floor(progress * (points.length - 1)));
          vehicle.setLatLng(points[index]);
          frame = requestAnimationFrame(move);
        };

        frame = requestAnimationFrame(move);

        const refresh = () => {
          if (!stopped && map) {
            map.invalidateSize(true);
            map.fitBounds(bounds, {
              paddingTopLeft: [55, 70],
              paddingBottomRight: [55, 70],
              maxZoom: 16,
              animate: false,
            });
          }
        };

        window.setTimeout(refresh, 100);
        window.setTimeout(refresh, 500);
      } catch {
        if (!stopped) setError(true);
      }
    };

    run();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      if (map) map.remove();
    };
  }, []);

  return (
    <div className="demo-real-map-wrap">
      <div ref={ref} className="demo-real-map" />
      {error && (
        <div className="demo-map-fallback">
          <Navigation size={22} />
          <strong>Mapa temporariamente indisponível</strong>
          <span>O mapa real volta a carregar quando a ligação estiver disponível.</span>
        </div>
      )}
      <div className="demo-map-badge"><Bike size={14} /> Estafeta a caminho</div>
    </div>
  );
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
