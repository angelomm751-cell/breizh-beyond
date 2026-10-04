import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "./button";
import { useCart } from "./cart";
import { formatPrice, type Product } from "@/lib/menu";

export function ProductCard({ product, index, menuProduct }: { product: Product; index: number; menuProduct?: Product }) {
  const { add } = useCart();
  return (
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
            <Button tone="ghost" onClick={() => add(product)}><Plus size={15} /> Só</Button>
            <Button tone="ghost" onClick={() => add(menuProduct)}><Plus size={15} /> Menu</Button>
          </div>
        ) : (
          <Button tone="ghost" onClick={() => add(product)}><Plus size={15} /> Adicionar</Button>
        )}
      </div>
    </article>
  );
}
