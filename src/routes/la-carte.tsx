import { useMenu } from "@/hooks/use-menu";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { type Category } from "@/lib/menu";

const categories = ["Tudo", "Mini Pancakes", "Galettes", "Burger"] as const;
export const Route = createFileRoute("/la-carte")({ head: () => ({ meta: [
  { title: "A Ementa — BREIZH FOOD" }, { name: "description", content: "Mini pancakes, galettes de sarrasin e burgers artesanais." },
  { property: "og:title", content: "A Ementa — BREIZH FOOD" }, { property: "og:description", content: "Descubra a ementa artesanal da BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Carte });

function Carte() {
  const products = useMenu();
  const [active, setActive] = useState<(typeof categories)[number]>("Tudo");
  const shown = active === "Tudo" ? products : products.filter((p) => p.category === ({ Galettes: "Galettes", Burger: "Burger", "Mini Pancakes": "Mini Pancakes" } as Record<string, Category>)[active]);

  const pairs = shown.filter((product) => !product.name.endsWith(" · Menu")).map((product) => ({
    product,
    menuProduct: shown.find((candidate) => candidate.name === product.name.replace(/ · Só$/i, " · Menu")),
  }));

  return <><section className="page-title"><span className="eyebrow">La maison · Sélection 2026</span><h1>A ementa <em>· La carte</em></h1><p>Mini pancakes doces e especialidades salgadas, preparadas na hora.</p></section><section className="menu-page"><div className="category-tabs" role="tablist" aria-label="Categorias">{categories.map((category) => <button key={category} role="tab" aria-selected={active === category} onClick={() => setActive(category)}>{category}</button>)}</div><div className="product-grid product-grid--menu">{pairs.map(({ product, menuProduct }, index) => <ProductCard key={product.id} product={product} menuProduct={menuProduct} index={index} />)}</div></section></>;
}
