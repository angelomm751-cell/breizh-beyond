import { ArrowUpRight, Plus, X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { useCart } from "./cart";
import { formatPrice, type Product } from "@/lib/menu";

const pancakeSauces = [
  "Nutella®", "Chocolate negro", "Chocolate branco",
  "Caramelo salgado", "Pistache", "Coulis de frutos vermelhos",
];
const pancakeToppings = [
  "Morangos", "Bananas", "Framboesas", "Lotus triturado", "Oreo",
  "Avelãs picadas", "Smarties", "Pepitas de chocolate", "Coco ralado",
];
const pancakeExtras = ["Chantilly", "Bola de gelado (baunilha)"];

const burgerSauces = ["Molho Burger", "Ketchup", "Maionese", "Mostarda"];
const galetteSauces = ["Ketchup", "Maionese", "Mostarda"];

type Choice = {
  product: Product;
  toppings: string[];
  sauces: string[];
  extras: string[];
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
      sauces: isPancake ? ["Nutella®"] : [],
      extras: [],
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
            sauces: isPancake ? ["Nutella®"] : [],
            extras: [],
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
    if (needsToppings && (choice.toppings.length !== 2 || choice.sauces.length !== 1)) return;

    const toppingLabel = choice.toppings.join(", ");
    const sauceLabel = choice.sauces.join(", ");
    const extraLabel = choice.extras.join(", ");
    const extraCost = choice.extras.length;
    const customization = [
      sauceLabel ? `Molho: ${sauceLabel}.` : "",
      toppingLabel ? `Coberturas: ${toppingLabel}.` : "",
      extraLabel ? `Extras: ${extraLabel} (+${formatPrice(extraCost)}).` : "",
    ]
      .filter(Boolean)
      .join(" ");

    add({
      ...choice.product,
      id: `${choice.product.id}__${choice.sauces.join("|")}__${choice.toppings.join("|")}__${choice.extras.join("|")}`,
      price: choice.product.price + extraCost,
      name: customization
        ? `${choice.product.name} · ${choice.sauces.join(" + ")}${toppingLabel ? ` · ${toppingLabel}` : ""}${extraLabel ? ` · ${extraLabel}` : ""}`
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

          <div className="product-title-row product-title-row--price">
            <strong>{formatPrice(product.price)}</strong>
          </div>

          <p>{product.description.replace(/ Menu com.*$/i, "")}</p>

          <Button
            tone="ghost"
            className="product-add-button"
            onClick={openChooser}
            aria-label={`Adicionar ${product.name.replace(/ · Só$/i, "")}`}
          >
            <Plus size={18} />
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
                    <p>Escolhe 1 molho + exatamente 2 toppings. Extras opcionais têm +1 € cada.</p>
                    <div className="selection-section">
                      <strong>Molho · escolhe 1</strong>
                      <div className="topping-options">
                        {pancakeSauces.map((sauce) => {
                          const selected = choice.sauces.includes(sauce);
                          return (
                            <button
                              type="button"
                              className={selected ? "topping-option is-selected" : "topping-option"}
                              key={sauce}
                              onClick={() => setChoice({ ...choice, sauces: [sauce] })}
                            >
                              {sauce}
                            </button>
                          );
                        })}
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

                    <div className="selection-section">
                      <strong>Extras · +1 € cada</strong>
                      <div className="topping-options">
                        {pancakeExtras.map((extra) => {
                          const selected = choice.extras.includes(extra);
                          return (
                            <button
                              type="button"
                              className={selected ? "topping-option is-selected" : "topping-option"}
                              key={extra}
                              onClick={() =>
                                setChoice({
                                  ...choice,
                                  extras: selected
                                    ? choice.extras.filter((item) => item !== extra)
                                    : [...choice.extras, extra],
                                })
                              }
                            >
                              {extra}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Escolhe todos os molhos que quiseres — podes selecionar vários.</p>
                    <div className="selection-section">
                      <strong>Molho</strong>
                      <div className="topping-options">
                        {sauces.map((sauce) => (
                          <button
                            type="button"
                            key={sauce}
                            className={choice.sauces.includes(sauce) ? "topping-option is-selected" : "topping-option"}
                            onClick={() =>
                              setChoice({
                                ...choice,
                                sauces: choice.sauces.includes(sauce)
                                  ? choice.sauces.filter((item) => item !== sauce)
                                  : [...choice.sauces, sauce],
                              })
                            }
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
                  disabled={isPancake ? (choice.toppings.length !== 2 || choice.sauces.length !== 1) : choice.sauces.length === 0}
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
