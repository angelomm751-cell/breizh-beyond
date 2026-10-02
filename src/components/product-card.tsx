import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "./button";
import { useCart } from "./cart";
import { formatPrice, type Product } from "@/lib/menu";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { add } = useCart();
  return (
    <article className="product-card reveal" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} width={720} height={600} loading="lazy" style={{ objectPosition: product.position }} />
        <span className="product-index">{String(index + 1).padStart(2, "0")}</span>
        <ArrowUpRight className="product-arrow" aria-hidden="true" />
      </div>
      <div className="product-copy">
        <span className="eyebrow">{product.category}</span>
        <div className="product-title-row"><h3>{product.name}</h3><strong>{formatPrice(product.price)}</strong></div>
        <p>{product.description}</p>
        <Button tone="ghost" onClick={() => add(product)}><Plus size={15} /> Ajouter</Button>
      </div>
    </article>
  );
}