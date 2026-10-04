import { useMenu } from "@/hooks/use-menu";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/menu";

export const Route = createFileRoute("/commander")({ head: () => ({ meta: [
  { title: "Encomendar para Casa — BREIZH FOOD" }, { name: "description", content: "Encomende os sabores da Bretanha diretamente para a sua casa." },
  { property: "og:title", content: "BREIZH FOOD em sua Casa" }, { property: "og:description", content: "Escolha as suas galettes, crepes e outras especialidades artesanais." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Commander });

function Commander() {
  const products = useMenu();
  const { count, total, open } = useCart();
  return <><section className="order-hero"><span className="eyebrow">Breizh Food · chez vous</span><h1>Encomendar<br /><em>pour la maison.</em></h1><p>Os sabores da Bretanha, diretamente em sua casa.</p><div className="order-status"><span>Entrega</span><i /><span>Preparado na hora</span><i /><span>Pagamento disponível em breve</span></div></section><section className="order-menu"><div className="order-menu-head"><div><span className="eyebrow">Votre sélection</span><h2>Escolha os seus <em>favoris</em></h2></div><button className="order-cart-summary" onClick={open}><ShoppingBag /><span>{count} artigo{count === 1 ? "" : "s"}</span><strong>{formatPrice(total)}</strong></button></div><div className="product-grid product-grid--menu">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>{count > 0 && <div className="order-checkout-bar"><span>Total provisório <strong>{formatPrice(total)}</strong></span><Link to="/demo-encomenda" className="brand-link brand-link--gold">Continuar <ArrowRight size={16} /></Link></div>}<div className="demo-order-entry"><Link to="/demo-encomenda" className="text-link">🧪 Experimentar encomenda sem pagar <ArrowRight size={14} /></Link><small>Demonstração · não cria nem cobra uma encomenda real</small></div></section></>;
}