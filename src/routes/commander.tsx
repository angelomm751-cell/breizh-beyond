import { useMenu } from "@/hooks/use-menu";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart";
import { formatPrice, type Category } from "@/lib/menu";

const categoryOrder: Category[] = ["Burger", "Galettes", "Mini Pancakes"];
const categoryLabel: Record<Category, string> = {
  Burger: "Hambúrgueres",
  Galettes: "Galettes",
  "Mini Pancakes": "Mini pancakes",
};

export const Route = createFileRoute("/commander")({ head: () => ({ meta: [
  { title: "Encomendar para Casa — BREIZH FOOD" }, { name: "description", content: "Encomende os sabores da Bretanha diretamente para a sua casa." },
  { property: "og:title", content: "BREIZH FOOD em sua Casa" }, { property: "og:description", content: "Escolha as suas galettes, crepes e outras especialidades artesanais." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Commander });

function Commander() {
  const products = useMenu();
  const { count, total, open } = useCart();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const categories = categoryOrder.filter((category) => products.some((product) => product.category === category));
  const categoryProducts = activeCategory ? products.filter((product) => product.category === activeCategory) : [];
  const pairedProducts = categoryProducts
    .filter((product) => !product.name.endsWith(" · Menu"))
    .map((product) => ({
      product,
      menuProduct: categoryProducts.find((candidate) =>
        candidate.name === product.name.replace(/ · Só$/i, " · Menu")
      ),
    }));

  return <>
    <section className="order-hero">
      <span className="eyebrow">Breizh Food · chez vous</span>
      <h1>{activeCategory ? <>{categoryLabel[activeCategory]}<br /><em>à votre manière.</em></> : <>Encomendar<br /><em>pour la maison.</em></>}</h1>
      <p>{activeCategory ? "Escolhe o teu favorito e personaliza o pedido." : "Primeiro, escolhe o que te apetece. Depois, personaliza o teu pedido."}</p>
      <div className="order-status"><span>Entrega</span><i /><span>Preparado na hora</span><i /><span>Pagamento disponível em breve</span></div>
    </section>
    <section className="order-menu">
      <div className="order-menu-head">
        <div>
          <span className="eyebrow">Votre sélection</span>
          <h2>{activeCategory ? "Escolhe o teu " + categoryLabel[activeCategory].toLowerCase() : <>O que te apetece <em>hoje?</em></>}</h2>
        </div>
        <button className="order-cart-summary" onClick={open}><ShoppingBag /><span>{count} artigo{count === 1 ? "" : "s"}</span><strong>{formatPrice(total)}</strong></button>
      </div>
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
          <div className="product-grid product-grid--menu">{pairedProducts.map(({ product, menuProduct }, index) => <ProductCard key={product.id} product={product} menuProduct={menuProduct} index={index} />)}</div>
        </>
      )}
      {count > 0 && <div className="order-checkout-bar"><span>Total provisório <strong>{formatPrice(total)}</strong></span><Link to="/checkout" className="brand-link brand-link--gold">Continuar <ArrowRight size={16} /></Link></div>}
    </section>
  </>;
}
