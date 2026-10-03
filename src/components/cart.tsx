import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "./button";
import { formatPrice, products, type Product } from "@/lib/menu";

type CartLine = { product: Product; quantity: number };
type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  add: (product: Product) => void;
  change: (id: string, delta: number) => void;
  open: () => void;
  close: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isOpen, setOpen] = useState(false);
  const lines = useMemo(() => products.filter((p) => quantities[p.id]).map((product) => ({ product, quantity: quantities[product.id] ?? 0 })), [quantities]);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const change = (id: string, delta: number) => setQuantities((current) => {
    const next = Math.max(0, (current[id] ?? 0) + delta);
    if (!next) {
      const { [id]: _removed, ...rest } = current;
      return rest;
    }
    return { ...current, [id]: next };
  });
  const add = (product: Product) => {
    change(product.id, 1);
    setOpen(true);
  };

  return <CartContext.Provider value={{ lines, count, total, isOpen, add, change, open: () => setOpen(true), close: () => setOpen(false), clear: () => setQuantities({}) }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

export function CartButton({ compact = false }: { compact?: boolean }) {
  const { count, open } = useCart();
  return (
    <button type="button" className="cart-trigger" onClick={open} aria-label={`Abrir o carrinho, ${count} artigos`}>
      <ShoppingBag size={18} aria-hidden="true" />
      {!compact && <span>Carrinho</span>}
      <span className="cart-count" key={count}>{count}</span>
    </button>
  );
}

export function CartDrawer() {
  const { lines, total, isOpen, close, change } = useCart();
  return (
    <div className={isOpen ? "cart-layer is-open" : "cart-layer"} aria-hidden={!isOpen}>
      <button className="cart-scrim" onClick={close} aria-label="Fechar o carrinho" tabIndex={isOpen ? 0 : -1} />
      <aside className="cart-drawer" aria-label="O seu carrinho" aria-modal="true" role="dialog">
        <div className="cart-head">
          <div><span className="eyebrow">A sua seleção</span><h2>O carrinho</h2></div>
          <button className="icon-button" onClick={close} aria-label="Fechar"><X /></button>
        </div>
        <div className="cart-lines">
          {lines.length === 0 && <div className="cart-empty"><ShoppingBag /><p>O seu carrinho espera por um sabor da Bretanha.</p></div>}
          {lines.map(({ product, quantity }) => (
            <article className="cart-line" key={product.id}>
              <img src={product.image} alt="" width={120} height={120} />
              <div className="cart-line-copy">
                <span className="eyebrow">{product.category}</span><h3>{product.name}</h3>
                <div className="quantity" aria-label={`Quantidade de ${product.name}`}>
                  <button onClick={() => change(product.id, -1)} aria-label="Diminuir"><Minus size={14} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => change(product.id, 1)} aria-label="Aumentar"><Plus size={14} /></button>
                </div>
              </div>
              <strong>{formatPrice(product.price * quantity)}</strong>
            </article>
          ))}
        </div>
        <div className="cart-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
        {lines.length > 0 && <Link to="/checkout" onClick={close} className="brand-link brand-link--gold">Finalizar encomenda <ArrowRight size={16} /></Link>}
        <p className="demo-note">Encomenda de demonstração · pagamento não ativado</p>
      </aside>
    </div>
  );
}