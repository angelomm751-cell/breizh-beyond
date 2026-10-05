import heroImage from "@/assets/breizh-hero.jpg";
import craftImage from "@/assets/breizh-craft.jpg";
import menuImage from "@/assets/breizh-menu.jpg";
import maisonImage from "@/assets/breizh-maison.jpg";

export type Category = "Galettes" | "Crêpes" | "Burger" | "Mini Pancakes" | "Boissons";
export type Product = { id: string; name: string; category: Category; description: string; price: number; image: string; position: string };

// Ementa pública BREIZH FOOD — fluxo de seleção Só/Menu e personalização no carrinho.
export const products: Product[] = [
  { id: "galette-complete-solo", name: "Galette Complète · Só", category: "Galettes", description: "Fiambre, Gruyère ralado e ovo.", price: 6, image: heroImage, position: "center" },
  { id: "galette-complete-menu", name: "Galette Complète · Menu", category: "Galettes", description: "Fiambre, Gruyère ralado e ovo. Menu com batatas fritas caseiras, pequena salada, bebida 33cl e molhos: Molho Burger, Ketchup, Maionese ou Mostarda.", price: 9, image: heroImage, position: "center" },
  { id: "galette-chevre-solo", name: "Galette Cabra e Mel · Só", category: "Galettes", description: "Queijo de cabra, mel, fiambre, nozes e Gruyère ralado.", price: 6.5, image: menuImage, position: "center" },
  { id: "galette-chevre-menu", name: "Galette Cabra e Mel · Menu", category: "Galettes", description: "Queijo de cabra, mel, fiambre, nozes e Gruyère ralado. Menu com batatas fritas caseiras, pequena salada, bebida 33cl e molhos: Molho Burger, Ketchup, Maionese ou Mostarda.", price: 9.5, image: menuImage, position: "center" },
  { id: "galette-raclette-solo", name: "Galette Raclette · Só", category: "Galettes", description: "Queijo raclette, fiambre, batata e Gruyère ralado.", price: 7.5, image: craftImage, position: "center" },
  { id: "galette-raclette-menu", name: "Galette Raclette · Menu", category: "Galettes", description: "Queijo raclette, fiambre, batata e Gruyère ralado. Menu com batatas fritas caseiras, pequena salada, bebida 33cl e molhos: Molho Burger, Ketchup, Maionese ou Mostarda.", price: 10, image: craftImage, position: "center" },

  { id: "burger-classico-solo", name: "Burger Clássico · Só", category: "Burger", description: "Bife, cheddar, alface e cebola frita.", price: 6, image: heroImage, position: "center" },
  { id: "burger-classico-menu", name: "Burger Clássico · Menu", category: "Burger", description: "Bife, cheddar, alface e cebola frita. Menu com batatas fritas caseiras, bebida 33cl e molhos: Molho Burger, Ketchup, Maionese ou Mostarda.", price: 9, image: heroImage, position: "center" },
  { id: "burger-frango-solo", name: "Burger Frango Frito · Só", category: "Burger", description: "Frango panado, cheddar, alface e cebola frita.", price: 6, image: craftImage, position: "center" },
  { id: "burger-frango-menu", name: "Burger Frango Frito · Menu", category: "Burger", description: "Frango panado, cheddar, alface e cebola frita. Menu com batatas fritas caseiras, bebida 33cl e molhos: Molho Burger, Ketchup, Maionese ou Mostarda.", price: 9, image: craftImage, position: "center" },
  { id: "burger-raclette-solo", name: "Burger Raclette · Só", category: "Burger", description: "Bife, queijo raclette, bacon, alface e cebola frita.", price: 7.5, image: menuImage, position: "center" },
  { id: "burger-raclette-menu", name: "Burger Raclette · Menu", category: "Burger", description: "Bife, queijo raclette, bacon, alface e cebola frita. Menu com batatas fritas caseiras, bebida 33cl e molhos: Molho Burger, Ketchup, Maionese ou Mostarda.", price: 10, image: menuImage, position: "center" },
  { id: "king-burger-solo", name: "King Burger · Só", category: "Burger", description: "2 bifes, 2 cheddars, 2 bacons, ovo, galeta de batata, alface e cebola frita.", price: 9.5, image: maisonImage, position: "center" },
  { id: "king-burger-menu", name: "King Burger · Menu", category: "Burger", description: "2 bifes, 2 cheddars, 2 bacons, ovo, galeta de batata, alface e cebola frita. Menu com batatas fritas caseiras, bebida 33cl e molhos: Molho Burger, Ketchup, Maionese ou Mostarda.", price: 13, image: maisonImage, position: "center" },

  { id: "mini-pancakes-small", name: "Mini Pancakes · Pequeno", category: "Mini Pancakes", description: "10 mini pancakes · 1 molho + 2 toppings incluídos. Extras: Chantilly +1€ ou Bola de gelado (baunilha) +1€.", price: 5, image: menuImage, position: "center" },
  { id: "mini-pancakes-medium", name: "Mini Pancakes · Médio", category: "Mini Pancakes", description: "15 mini pancakes · 1 molho + exatamente 2 toppings incluídos. Extras: Chantilly +1€ ou Bola de gelado (baunilha) +1€.", price: 7, image: menuImage, position: "center" },
  { id: "mini-pancakes-large", name: "Mini Pancakes · Grande", category: "Mini Pancakes", description: "20 mini pancakes · 1 molho + exatamente 2 toppings incluídos. Extras: Chantilly +1€ ou Bola de gelado (baunilha) +1€.", price: 9, image: menuImage, position: "center" },
];

const localImages: Record<string, string> = { hero: heroImage, craft: craftImage, menu: menuImage, maison: maisonImage };
export const localImageKeys = Object.keys(localImages);
export const resolveImage = (value: string) => (value.startsWith("local:") ? localImages[value.slice(6)] ?? heroImage : value);
export const categories: Category[] = ["Mini Pancakes", "Galettes", "Burger"];
export const DELIVERY_FEE = 4.0;
export const FREE_DELIVERY_FROM = 35;
export const deliveryFeeFor = (subtotal: number, mode: "home" | "pickup") => (mode === "pickup" || subtotal >= FREE_DELIVERY_FROM || subtotal === 0 ? 0 : DELIVERY_FEE);
export const formatPrice = (value: number) => value.toFixed(2).replace(".", ",") + " €";
export const galleryImages = [
  { src: heroImage, alt: "Galette bretonne servida numa mesa", shape: "wide" },
  { src: craftImage, alt: "Preparação artesanal", shape: "tall" },
  { src: menuImage, alt: "Seleção BREIZH FOOD", shape: "square" },
  { src: maisonImage, alt: "Ambiente BREIZH FOOD", shape: "wide" },
];
