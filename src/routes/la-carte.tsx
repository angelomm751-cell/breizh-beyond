import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products, type Category } from "@/lib/menu";

const categories = ["Tudo", "Galettes", "Crepes", "Especialidades", "Sobremesas", "Bebidas"] as const;
export const Route = createFileRoute("/la-carte")({ head: () => ({ meta: [
  { title: "A Ementa — BREIZH FOOD" }, { name: "description", content: "Galettes de trigo-sarraceno, crepes e especialidades bretonas artesanais." },
  { property: "og:title", content: "A Ementa — BREIZH FOOD" }, { property: "og:description", content: "Descubra a ementa artesanal da BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Carte });
function Carte() {
  const [active, setActive] = useState<(typeof categories)[number]>("Tudo");
  const shown = active === "Tudo" ? products : products.filter((p) => p.category === ({ Galettes: "Galettes", Crepes: "Crêpes", Especialidades: "Spécialités", Sobremesas: "Desserts", Bebidas: "Boissons" } as Record<string, Category>)[active]);
  return <><section className="page-title"><span className="eyebrow">La maison · Sélection 2026</span><h1>A ementa <em>· La carte</em></h1><p>Receitas generosas, preparadas na hora com produtos escolhidos — avec savoir-faire.</p></section><section className="menu-page"><div className="category-tabs" role="tablist" aria-label="Categorias">{categories.map((category) => <button key={category} role="tab" aria-selected={active === category} onClick={() => setActive(category)}>{category}</button>)}</div><div className="product-grid product-grid--menu">{shown.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div><p className="menu-disclaimer">Ementa e preços de demonstração, a confirmar antes da abertura das encomendas.</p></section></>;
}