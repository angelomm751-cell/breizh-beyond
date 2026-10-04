import { ArrowUpRight, Plus, X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { useCart } from "./cart";
import { formatPrice, type Product } from "@/lib/menu";

const pancakeToppings = [
  "Chantilly", "Morangos", "Bananas", "Framboesas", "Chocolate negro",
  "Chocolate branco", "Lotus", "Oreo", "Caramelo salgado triturado",
  "Pistache", "Coulis de frutos vermelhos", "Smarties",
  "Pepitas de chocolate", "Coco ralado", "Avelãs picadas",
  "Bola de gelado (baunilha)"
];

const burgerSauces = ["Molho Burger", "Ketchup", "Maionese", "Mostarda"];
const galetteSauces = ["Ketchup", "Maionese", "Mostarda"];

type Choice = {
  product: Product;
  toppings: string[];
  sauce: string;
};

export function ProductCard({
  product,
  index,
  menuProduct,
}: {
  product: Product;
  index: number;
  menuProduct?: Product;
}) {
  const { add } = useCart();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const isPancake = product.category === "Mini Pancakes";
  const needsToppings = isPancake;

  const openChooser = () => {
    setChoice({
      product,
      toppings: [],
      sauce: isPancake ? "Nutella®" : "",
    });
    setStep(menuProduct ? 1 : 2);
  };

  const selectFormat = (selected: Product) => {
    setChoice((current) =>
      current
        ? {
            ...current,
            product: selected,
            toppings: [],
            sauce: isPancake ? "Nutella®" : "",
          }
        : current
    );
    setStep(2);
  };

  const sauces =
    product.category === "Burger"
      ? burgerSauces
      : product.category === "Galettes"
        ? galetteSauces
        : [];

  const confirmChoice = () => {
    if (!choice) return;
    if (needsToppings && choice.toppings.length !== 2) return;

    const toppingLabel = choice.toppings.join(", ");
    const sauce = choice.sauce;
    const customization = [
      sauce ? `Molho: ${sauce}.` : "",
      toppingLabel ? `Coberturas: ${toppingLabel}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    add({
      ...choice.product,
      id: `${choice.product.id}__${sauce}__${choice.toppings.join("|")}`,
      name: customization
        ? `${choice.product.name} · ${sauce || ""}${toppingLabel ? ` · ${toppingLabel}` : ""}`
        : choice.product.name,
      description: `${choice.product.description}${customization ? ` ${customization}` : ""}`,
    });

    setChoice(null);
    setStep(1);
  };

  return (
    <>
      <article className="product-card reveal" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
        <div className="product-image-wrap">
          <img
            src={product.image}
            alt={product.name.replace(/ · (Só|Menu)$/i, "")}
            width={720}
            height={600}
            loading="lazy"
            style={{ objectPosition: product.position }}
          />
          <span className="product-index">{String(index + 1).padStart(2, "0")}</span>
          <ArrowUpRight className="product-arrow" aria-hidden="true" />
        </div>

        <div className="product-copy">
          <span className="eyebrow">{product.category}</span>
          <div className="product-title-row">
            <h3>{product.name.replace(/ · Só$/i, "")}</h3>
          </div>

          {menuProduct ? (
            <div className="product-prices">
              <div><span>Só</span><strong>{formatPrice(product.price)}</strong></div>
              <div><span>Menu</span><strong>{formatPrice(menuProduct.price)}</strong></div>
            </div>
          ) : (
            <div className="product-title-row">
              <strong>{formatPrice(product.price)}</strong>
            </div>
          )}

          <p>{product.description.replace(/ Menu com.*$/i, "")}</p>

          <Button
            tone="ghost"
            className="product-add-button"
            onClick={openChooser}
            aria-label={`Escolher ${product.name.replace(/ · Só$/i, "")}`}
          >
            <Plus size={18} /> Escolher
          </Button>
        </div>
      </article>

      {choice && (
        <div className="topping-modal" role="dialog" aria-modal="true" aria-label="Personalizar pedido">
          <div className="topping-modal__panel">
            <button className="icon-button" onClick={() => setChoice(null)} aria-label="Fechar">
              <X />
            </button>

            <span className="eyebrow">Personalizar pedido</span>
            <h2>{choice.product.name.replace(/ · (Só|Menu)$/i, "")}</h2>

            {step === 1 && menuProduct ? (
              <>
                <p>Primeiro, escolhe como queres o teu pedido.</p>
                <div className="selection-step">
                  <button
                    type="button"
                    className="selection-choice"
                    onClick={() => selectFormat(product)}
                  >
                    <span>
                      <strong>Só</strong>
                      <small>Sem menu</small>
                    </span>
                    <b>{formatPrice(product.price)}</b>
                  </button>

                  <button
                    type="button"
                    className="selection-choice"
                    onClick={() => selectFormat(menuProduct)}
                  >
                    <span>
                      <strong>Menu</strong>
                      <small>Batatas + bebida + extras incluídos</small>
                    </span>
                    <b>{formatPrice(menuProduct.price)}</b>
                  </button>
                </div>
              </>
            ) : (
              <>
                {menuProduct && (
                  <button
                    type="button"
                    className="selection-back"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft size={15} /> Voltar a Só / Menu
                  </button>
                )}

                {isPancake ? (
                  <>
                    <p>Nutella® incluída + escolhe exatamente 2 coberturas.</p>
                    <div className="selection-section">
                      <strong>Molho</strong>
                      <div className="topping-options">
                        <span className="topping-option is-selected">Nutella®</span>
                      </div>
                    </div>

                    <div className="selection-section">
                      <strong>Coberturas · escolhe 2</strong>
                      <div className="topping-options">
                        {pancakeToppings.map((topping) => {
                          const selected = choice.toppings.includes(topping);
                          return (
                            <button
                              type="button"
                              className={selected ? "topping-option is-selected" : "topping-option"}
                              key={topping}
                              onClick={() =>
                                setChoice({
                                  ...choice,
                                  toppings: selected
                                    ? choice.toppings.filter((item) => item !== topping)
                                    : choice.toppings.length < 2
                                      ? [...choice.toppings, topping]
                                      : choice.toppings,
                                })
                              }
                            >
                              {topping}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Agora escolhe o molho para acompanhar.</p>
                    <div className="selection-section">
                      <strong>Molho</strong>
                      <div className="topping-options">
                        {sauces.map((sauce) => (
                          <button
                            type="button"
                            key={sauce}
                            className={choice.sauce === sauce ? "topping-option is-selected" : "topping-option"}
                            onClick={() => setChoice({ ...choice, sauce })}
                          >
                            {sauce}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Button
                  tone="gold"
                  disabled={isPancake ? choice.toppings.length !== 2 : !choice.sauce}
                  onClick={confirmChoice}
                >
                  <Plus size={16} /> Adicionar ao carrinho
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
