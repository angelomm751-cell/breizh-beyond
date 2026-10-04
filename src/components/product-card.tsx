import { ArrowUpRight, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { useCart } from "./cart";
import { formatPrice, type Product } from "@/lib/menu";

const pancakeSauces = ["Nutella", "Chocolate preto", "Chocolate branco", "Lotus", "Caramelo salgado", "Coulis de frutos vermelhos"];
const pancakeToppings = ["Chantilly", "Morangos", "Banana", "Framboesas", "Lotus", "Oreo", "Pistácio", "Smarties", "Pepitas de chocolate", "Coco ralado", "Avelãs picadas", "Bola de gelado de baunilha"];

export function ProductCard({ product, index, menuProduct }: { product: Product; index: number; menuProduct?: Product }) {
  const { add } = useCart();
  const [choice, setChoice] = useState<{ product: Product; sauce: string; toppings: string[] } | null>(null);

  const needsToppings = product.category === "Desserts" && product.name.startsWith("Mini Pancakes");

  const choose = (selected: Product) => {
    if (needsToppings) setChoice({ product: selected, sauce: pancakeSauces[0], toppings: [] });
    else add(selected);
  };

  const confirmChoice = () => {
    if (!choice || choice.toppings.length !== 2) return;
    const toppingLabel = choice.toppings.join(", ");
    const customized = {
      ...choice.product,
      id: `${choice.product.id}__toppings__${choice.sauce}__${choice.toppings.join("|")}`,
      name: `${choice.product.name} · ${choice.sauce} · ${toppingLabel}`,
      description: `${choice.product.description} Molho: ${choice.sauce}. Toppings: ${toppingLabel}.`,
    };
    add(customized);
    setChoice(null);
  };

  return (
    <>
      <article className="product-card reveal" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name.replace(/ · (Só|Menu)$/i, "")} width={720} height={600} loading="lazy" style={{ objectPosition: product.position }} />
          <span className="product-index">{String(index + 1).padStart(2, "0")}</span>
          <ArrowUpRight className="product-arrow" aria-hidden="true" />
        </div>
        <div className="product-copy">
          <span className="eyebrow">{product.category}</span>
          <div className="product-title-row"><h3>{product.name.replace(/ · Só$/i, "")}</h3></div>
          {menuProduct ? (
            <div className="product-prices">
              <div><span>Só</span><strong>{formatPrice(product.price)}</strong></div>
              <div><span>Menu</span><strong>{formatPrice(menuProduct.price)}</strong></div>
            </div>
          ) : (
            <div className="product-title-row"><strong>{formatPrice(product.price)}</strong></div>
          )}
          <p>{product.description.replace(/ Menu com.*$/i, "")}</p>
          {menuProduct ? (
            <div className="product-actions">
              <Button tone="ghost" onClick={() => choose(product)}><Plus size={15} /> Só</Button>
              <Button tone="ghost" onClick={() => choose(menuProduct)}><Plus size={15} /> Menu</Button>
            </div>
          ) : (
            <Button tone="ghost" onClick={() => choose(product)}><Plus size={15} /> Adicionar</Button>
          )}
        </div>
      </article>

      {choice && (
        <div className="topping-modal" role="dialog" aria-modal="true" aria-label="Escolher toppings">
          <div className="topping-modal__panel">
            <button className="icon-button" onClick={() => setChoice(null)} aria-label="Fechar"><X /></button>
            <span className="eyebrow">Personalizar</span>
            <h2>{choice.product.name}</h2>
            <p>Escolha 1 molho e 2 toppings incluídos.</p>
            <label><strong>Molho</strong><select value={choice.sauce} onChange={(e) => setChoice({ ...choice, sauce: e.target.value })}>{pancakeSauces.map((s) => <option key={s}>{s}</option>)}</select></label>
            <div><strong>Toppings · escolha 2</strong><div className="topping-options">{pancakeToppings.map((t) => {
              const selected = choice.toppings.includes(t);
              return <button type="button" className={selected ? "topping-option is-selected" : "topping-option"} key={t} onClick={() => setChoice({ ...choice, toppings: selected ? choice.toppings.filter((x) => x !== t) : choice.toppings.length < 2 ? [...choice.toppings, t] : choice.toppings })}>{t}</button>;
            })}</div></div>
            <Button tone="gold" disabled={choice.toppings.length !== 2} onClick={confirmChoice}>Adicionar ao carrinho</Button>
          </div>
        </div>
      )}
    </>
  );
}
