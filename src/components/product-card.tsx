import { ArrowUpRight, Plus, X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { useCart } from "./cart";
import { formatPrice, type Product } from "@/lib/menu";

const pancakeSauces = [
  "Nutella®", "Chocolate negro", "Chocolate branco", "Caramelo salgado",
  "Pistache", "Coulis de frutos vermelhos",
];
const pancakeToppings = [
  "Morangos", "Bananas", "Framboesas", "Lotus triturado", "Oreo",
  "Avelãs picadas", "Smarties", "Pepitas de chocolate", "Coco ralado",
];
const pancakeExtras = ["Chantilly", "Bola de gelado (baunilha)"];
const pancakeSizes = [
  { name: "Pequeno", price: 5, count: 10 },
  { name: "Médio", price: 7, count: 15 },
  { name: "Grande", price: 9, count: 20 },
];

const burgerSauces = ["Molho Burger", "Ketchup", "Maionese", "Mostarda"];
const galetteSauces = ["Molho Burger", "Ketchup", "Maionese", "Mostarda"];
const drinkOptions = ["Coca-Cola", "Coca-Cola Zero", "Ice Tea Limão", "Ice Tea Pêssego", "Fanta Laranja", "Sprite", "Água"];

type Choice = {
  product: Product;
  toppings: string[];
  sauces: string[];
  extras: string[];
  drink: string;
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [animationItem, setAnimationItem] = useState("");
  const [animationKey, setAnimationKey] = useState(0);

  const animateIngredient = (item: string, removing = false) => {
    // Removing a sauce should simply remove the visual; never replay a falling animation.
    setAnimationItem(removing ? "" : item);
    setAnimationKey((key) => key + 1);
  };

  // Burger choices in this step are exclusively sauces: never show a falling text label over a burger.
  const isSauceAnimation = product.category === "Burger"
    ? Boolean(animationItem)
    : [...pancakeSauces, ...burgerSauces, ...galetteSauces, ...pancakeExtras].includes(animationItem) ||
      /nutella|chocolate|caramelo|coulis|pistache|chantilly/i.test(animationItem);
  const sauceColor = /ketchup|coulis|frutos vermelhos/i.test(animationItem) ? "#c92532"
    : /maionese|chocolate branco|chantilly/i.test(animationItem) ? "#f5e7c5"
    : /mostarda/i.test(animationItem) ? "#e7b51c"
    : /molho burger/i.test(animationItem) ? "#e58a45"
    : /pistache/i.test(animationItem) ? "#8eaa55"
    : /caramelo/i.test(animationItem) ? "#bd762e"
    : /nutella|chocolate negro|pepitas de chocolate|lotus/i.test(animationItem) ? "#4b241c"
    : "#b84c32";

  const isPancake = product.category === "Mini Pancakes";
  const needsToppings = isPancake;

  const openChooser = () => {
    setChoice({
      product,
      toppings: [],
      sauces: [],
      extras: [],
      drink: "",
    });
    setStep(isPancake || menuProduct ? 1 : 2);
  };

  const selectFormat = (selected: Product) => {
    setChoice((current) =>
      current
        ? {
            ...current,
            product: selected,
            toppings: [],
            sauces: [],
            extras: [],
            drink: "",
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
    if (choice.product.name.endsWith(" · Menu") && !choice.drink) { setStep(3); return; }
    if (needsToppings && (choice.toppings.length !== 2 || choice.sauces.length !== 1)) return;

    const toppingLabel = choice.toppings.join(", ");
    const sauceLabel = choice.sauces.join(", ");
    const extraLabel = choice.extras.join(", ");
    const drinkLabel = choice.drink;
    const extraCost = choice.extras.length;
    const customization = [
      sauceLabel ? `Molho: ${sauceLabel}.` : "",
      toppingLabel ? `Coberturas: ${toppingLabel}.` : "",
      extraLabel ? `Extras: ${extraLabel} (+${formatPrice(extraCost)}).` : "",
      drinkLabel ? `Bebida: ${drinkLabel}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    add({
      ...choice.product,
      id: `${choice.product.id}__${choice.sauces.join("|")}__${choice.toppings.join("|")}__${choice.extras.join("|")}`,
      price: choice.product.price + extraCost,
      name: customization
        ? `${choice.product.name} · ${choice.sauces.join(" + ")}${toppingLabel ? ` · ${toppingLabel}` : ""}${extraLabel ? ` · ${extraLabel}` : ""}${drinkLabel ? ` · ${drinkLabel}` : ""}`
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
            {step !== 1 && <div className="product-title-row product-title-row--price"><strong>{formatPrice(choice.product.price)}</strong></div>}
            {step === 2 && (
              <div className={`food-animation food-animation--${product.category === "Mini Pancakes" ? "pancakes" : product.category === "Galettes" ? "galette" : "burger"}`} aria-live="polite" aria-label={animationItem ? `Animação: ${animationItem}` : "Pré-visualização do produto"}>
                {product.category === "Burger" ? (
                  <div className={`burger-art ${/frango/i.test(choice.product.name) ? "burger-art--chicken" : "burger-art--beef"} ${/raclette/i.test(choice.product.name) ? "burger-art--raclette" : ""} ${/king burger/i.test(choice.product.name) ? "burger-art--king" : ""}`} aria-hidden="true">
                    <span className="burger-art__bottom" />
                    <span className="burger-art__lettuce" />
                    {/king burger/i.test(choice.product.name) && <span className="burger-art__patty burger-art__patty--lower" />}
                    {/king burger/i.test(choice.product.name) && <span className="burger-art__cheese burger-art__cheese--lower" />}
                    {/king burger/i.test(choice.product.name) && <span className="burger-art__potato" />}
                    <span className="burger-art__patty" />
                    <span className="burger-art__cheese" />
                    {/raclette|king burger/i.test(choice.product.name) && <span className="burger-art__bacon" />}
                    {/king burger/i.test(choice.product.name) && <span className="burger-art__egg" />}
                    <span className="burger-art__onion" />
                    <span className="burger-art__top" />
                    {animationItem && isSauceAnimation && <span className="burger-art__sauce-mark" style={{ "--sauce-color": sauceColor } as React.CSSProperties} aria-hidden="true" />}
                  </div>
                ) : (
                  <>
                    <div className="food-animation__base" />
                    <div className="food-animation__filling" />
                    <div className="food-animation__top" />
                  </>
                )}
                {animationItem && product.category !== "Burger" && <span key={animationKey} aria-label={animationItem} className={`food-animation__ingredient ${isSauceAnimation ? "is-sauce" : "is-solid"}`} style={isSauceAnimation ? ({ "--sauce-color": sauceColor } as React.CSSProperties) : undefined}>{isSauceAnimation ? <><i className="food-animation__sauce-stream" /><i className="food-animation__sauce-drop" /><i className="food-animation__sauce-splash" /></> : <span className="food-animation__ingredient-label">{animationItem}</span>}</span>}
              </div>
            )}

            {step === 1 && menuProduct && !isPancake ? (
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
                    
                  </button>

                  <button
                    type="button"
                    className="selection-choice"
                    onClick={() => selectFormat(menuProduct)}
                  >
                    <span>
                      <strong>Menu</strong>
                      <small>{product.category === "Galettes" ? "Batatas fritas caseiras + pequena salada + bebida 33cl" : "Batatas fritas caseiras + bebida 33cl"}</small>
                    </span>
                    
                  </button>
                </div>
              </>
            ) : (
              <>
                {menuProduct && step === 2 && (
                  <button
                    type="button"
                    className="selection-back"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft size={15} /> Voltar a Só / Menu
                  </button>
                )}

                {step === 3 ? (
                  <div className="choice-section">
                    <h4>Escolhe a bebida</h4>
                    <p>Seleciona a bebida de 33 cl incluída no menu.</p>
                    <div className="topping-options">
                      {drinkOptions.map((drink) => (
                        <button type="button" key={drink} className={choice.drink === drink ? "topping-option is-selected" : "topping-option"} onClick={() => setChoice({ ...choice, drink })}>{drink}</button>
                      ))}
                    </div>
                    <button type="button" className="selection-back" onClick={() => setStep(2)}><ChevronLeft size={15} /> Voltar aos molhos</button>
                  </div>
                ) : isPancake && step === 1 ? (
                  <div className="choice-section">
                    <h4>Escolhe o tamanho</h4>
                    <div className="choice-grid">
                      {pancakeSizes.map((size) => (
                        <button
                          key={size.name}
                          type="button"
                          className="choice-option"
                          onClick={() => {
                            setChoice((current) =>
                              current
                                ? {
                                    ...current,
                                    product: {
                                      ...current.product,
                                      id: `mini-pancakes-${size.name.toLowerCase()}`,
                                      name: `Mini Pancakes · ${size.name}`,
                                      description: `${size.count} mini pancakes · 1 molho + 2 toppings incluídos.`,
                                      price: size.price,
                                    },
                                  }
                                : current
                            );
                            setStep(2);
                          }}
                        >
                          <span>{size.name}</span>
                          <small>{size.count} mini pancakes</small>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : isPancake ? (
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
                              onClick={() => { setChoice({ ...choice, sauces: [sauce] }); animateIngredient(sauce); }}
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
                              onClick={() => {
                                setChoice({
                                  ...choice,
                                  toppings: selected
                                    ? choice.toppings.filter((item) => item !== topping)
                                    : choice.toppings.length < 2
                                      ? [...choice.toppings, topping]
                                      : choice.toppings,
                                });
                                animateIngredient(topping, selected);
                              }}
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
                              onClick={() => {
                                setChoice({
                                  ...choice,
                                  extras: selected
                                    ? choice.extras.filter((item) => item !== extra)
                                    : [...choice.extras, extra],
                                });
                                animateIngredient(extra, selected);
                              }}
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
                    <p>{product.category === "Galettes" ? "Escolhe os molhos que quiseres — Ketchup, Maionese, Mostarda e Molho Burger. Podes selecionar vários." : "Escolhe os molhos que quiseres — Molho Burger, Ketchup, Maionese e Mostarda. Podes selecionar vários."}</p>
                    <div className="selection-section">
                      <strong>Molho</strong>
                      <div className="topping-options">
                        {sauces.map((sauce) => (
                          <button
                            type="button"
                            key={sauce}
                            className={choice.sauces.includes(sauce) ? "topping-option is-selected" : "topping-option"}
                            onClick={() => {
                              setChoice({
                                ...choice,
                                sauces: choice.sauces.includes(sauce)
                                  ? choice.sauces.filter((item) => item !== sauce)
                                  : [...choice.sauces, sauce],
                              });
                              animateIngredient(sauce, choice.sauces.includes(sauce));
                            }}
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
                  disabled={isPancake ? (choice.toppings.length !== 2 || choice.sauces.length !== 1) : step === 3 ? !choice.drink : choice.sauces.length === 0}
                  onClick={confirmChoice}
                >
                  <Plus size={16} /> {step === 2 && choice.product.name.endsWith(" · Menu") ? "Continuar para bebidas" : "Adicionar ao carrinho"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
