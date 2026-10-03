import heroImage from "@/assets/breizh-hero.jpg";
import craftImage from "@/assets/breizh-craft.jpg";
import menuImage from "@/assets/breizh-menu.jpg";
import maisonImage from "@/assets/breizh-maison.jpg";

export type Category = "Galettes" | "Crêpes" | "Spécialités" | "Desserts" | "Boissons";

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  position: string;
};

export const products: Product[] = [
  { id: "complete", name: "La Complète", category: "Galettes", description: "Jambon fumé, œuf fermier, comté affiné, beurre demi-sel.", price: 14.5, image: heroImage, position: "center" },
  { id: "foret", name: "La Forêt", category: "Galettes", description: "Champignons rôtis, crème de comté, thym frais, salade.", price: 15.5, image: menuImage, position: "73% center" },
  { id: "armor", name: "L’Armor", category: "Spécialités", description: "Saumon, poireaux fondants, crème citronnée et aneth.", price: 17.5, image: craftImage, position: "center" },
  { id: "caramel", name: "Caramelo com manteiga salgada", category: "Crêpes", description: "Caramelo au beurre salé maison, com um toque francês.", price: 9.5, image: menuImage, position: "17% center" },
  { id: "citron", name: "Limão & Açúcar", category: "Crêpes", description: "Citron frais, sucre blond et beurre noisette.", price: 7.5, image: menuImage, position: "48% 76%" },
  { id: "far", name: "Far Breton", category: "Desserts", description: "Pruneaux, vanille, crème légèrement fouettée.", price: 8, image: maisonImage, position: "69% center" },
  { id: "mini-pancakes", name: "Mini pancakes", category: "Desserts", description: "Pequenos, fofos e perfeitos para partilhar — faits minute.", price: 5, image: craftImage, position: "center" },
  { id: "algodao-doce", name: "Algodão doce", category: "Desserts", description: "Leve, divertido e perfeito para festas e eventos.", price: 4, image: maisonImage, position: "center" },
  { id: "cidre", name: "Cidre Brut", category: "Boissons", description: "Cidre artisanal breton, frais et délicatement fruité.", price: 5.5, image: maisonImage, position: "center" },
  { id: "jus", name: "Sumo de maçã", category: "Boissons", description: "Pur jus de pommes, production artisanale.", price: 4.5, image: heroImage, position: "18% center" },
];

export const formatPrice = (value: number) => `${value.toFixed(2).replace(".", ",")} €`;

export const galleryImages = [
  { src: heroImage, alt: "Galette bretonne servie sur une table en noyer", shape: "wide" },
  { src: craftImage, alt: "Artisan préparant une galette sur le billig", shape: "tall" },
  { src: menuImage, alt: "Sélection de crêpes et galettes artisanales", shape: "square" },
  { src: maisonImage, alt: "Table élégante dans une maison contemporaine", shape: "wide" },
];