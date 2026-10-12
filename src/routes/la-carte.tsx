import { useMenu } from "@/hooks/use-menu";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { type Category } from "@/lib/menu";

const categoryOrder: Category[] = ["Burger", "Galettes", "Mini Pancakes"];
const categoryLabel: Record<Category, string> = {
  Burger: "Hambúrgueres",
  Galettes: "Galettes",
  "Mini Pancakes": "Mini pancakes",
};

export const Route = createFileRoute("/la-carte")({ head: () => ({ meta: [
  { title: "A Ementa — BREIZH FOOD" }, { name: "description", content: "Mini pancakes, galettes de sarrasin e burgers artesanais." },
  { property: "og:title", content: "A Ementa — BREIZH FOOD" }, { property: "og:description", content: "Descubra a ementa artesanal da BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Carte });

function Carte() {
  const products = useMenu();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const categories = categoryOrder.filter((category) => products.some((product) => product.category === category));
  const categoryProducts = activeCategory ? products.filter((product) => product.category === activeCategory) : [];
  const pairs = categoryProducts.filter((product) => !product.name.endsWith(" · Menu")).map((product) => ({
    product,
    menuProduct: categoryProducts.find((candidate) => candidate.name === product.name.replace(/ · Só$/i, " · Menu")),
  }));

  return <>
    <section className="page-title">
      <span className="eyebrow">La maison · Sélection 2026</span>
      <h1>A ementa <em>· La carte</em></h1>
      <p>{activeCategory ? "Escolhe o teu favorito e personaliza o pedido." : "Escolhe uma categoria para descobrir os produtos disponíveis."}</p>
    </section>
    <section className="menu-page">
      {!activeCategory ? (
        <div className="category-grid">
          {categories.map((category, index) => {
            const representative = products.find((product) => product.category === category)!;
            return <button type="button" className="category-card" key={category} onClick={() => setActiveCategory(category)} style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}>
              <span className="category-card__image"><img src={representative.image} alt="" loading="lazy" /><span className="category-card__number">{String(index + 1).padStart(2, "0")}</span></span>
              <span className="category-card__copy"><strong>{categoryLabel[category]}</strong><span>Ver opções <ArrowRight size={15} /></span></span>
            </button>;
          })}
        </div>
      ) : (
        <>
          <button type="button" className="category-back" onClick={() => setActiveCategory(null)}><ArrowLeft size={15} /> Voltar às categorias</button>
          <div className="product-grid product-grid--menu">{pairs.map(({ product, menuProduct }, index) => <ProductCard key={product.id} product={product} menuProduct={menuProduct} index={index} />)}</div>
        </>
      )}
    </section>
  </>;
}
