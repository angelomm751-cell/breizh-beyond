import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart";
import { formatPrice, products } from "@/lib/menu";

export const Route = createFileRoute("/commander")({ head: () => ({ meta: [
  { title: "Commander à Domicile — BREIZH FOOD" }, { name: "description", content: "Commandez les saveurs de Bretagne directement chez vous." },
  { property: "og:title", content: "BREIZH FOOD Chez Vous" }, { property: "og:description", content: "Choisissez vos galettes et crêpes artisanales." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Commander });

function Commander() {
  const { count, total, open } = useCart();
  return <><section className="order-hero"><span className="eyebrow">Breizh Food chez vous</span><h1>Commander<br /><em>à domicile.</em></h1><p>Les saveurs de Bretagne, directement chez vous.</p><div className="order-status"><span>Livraison</span><i /><span>Préparé minute</span><i /><span>Paiement à venir</span></div></section><section className="order-menu"><div className="order-menu-head"><div><span className="eyebrow">Votre sélection</span><h2>Choisissez vos envies</h2></div><button className="order-cart-summary" onClick={open}><ShoppingBag /><span>{count} article{count === 1 ? "" : "s"}</span><strong>{formatPrice(total)}</strong></button></div><div className="product-grid product-grid--menu">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>{count > 0 && <div className="order-checkout-bar"><span>Total provisoire <strong>{formatPrice(total)}</strong></span><Link to="/checkout" className="brand-link brand-link--gold">Continuer <ArrowRight size={16} /></Link></div>}</section></>;
}