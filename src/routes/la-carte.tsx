import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products, type Category } from "@/lib/menu";

const categories = ["Tout", "Galettes", "Crêpes", "Spécialités", "Desserts", "Boissons"] as const;
export const Route = createFileRoute("/la-carte")({ head: () => ({ meta: [
  { title: "La Carte — BREIZH FOOD" }, { name: "description", content: "Galettes de sarrasin, crêpes et spécialités bretonnes artisanales." },
  { property: "og:title", content: "La Carte — BREIZH FOOD" }, { property: "og:description", content: "Découvrez la carte artisanale BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Carte });
function Carte() {
  const [active, setActive] = useState<(typeof categories)[number]>("Tout");
  const shown = active === "Tout" ? products : products.filter((p) => p.category === active as Category);
  return <><section className="page-title"><span className="eyebrow">La maison · Sélection 2026</span><h1>La carte</h1><p>Des recettes franches et généreuses, préparées minute avec des produits choisis.</p></section><section className="menu-page"><div className="category-tabs" role="tablist" aria-label="Catégories">{categories.map((category) => <button key={category} role="tab" aria-selected={active === category} onClick={() => setActive(category)}>{category}</button>)}</div><div className="product-grid product-grid--menu">{shown.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div><p className="menu-disclaimer">Carte et tarifs de démonstration, à confirmer avant ouverture des commandes.</p></section></>;
}