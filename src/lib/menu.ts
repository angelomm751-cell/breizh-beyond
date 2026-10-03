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
  { id: "complete", name: "La Complète", category: "Galettes", description: "Presunto fumado, ovo caseiro, comté curado e manteiga salgada.", price: 14.5, image: heroImage, position: "center" },
  { id: "foret", name: "La Forêt", category: "Galettes", description: "Cogumelos assados, creme de comté, tomilho fresco e salada.", price: 15.5, image: menuImage, position: "73% center" },
  { id: "armor", name: "L’Armor", category: "Spécialités", description: "Salmão, alho-francês, creme de limão e endro.", price: 17.5, image: craftImage, position: "center" },
  { id: "caramel", name: "Caramelo com manteiga salgada", category: "Crêpes", description: "Caramelo caseiro com manteiga salgada, com um toque francês.", price: 9.5, image: menuImage, position: "17% center" },
  { id: "citron", name: "Limão & Açúcar", category: "Crêpes", description: "Limão fresco, açúcar e manteiga noisette.", price: 7.5, image: menuImage, position: "48% 76%" },
  { id: "far", name: "Far Breton", category: "Desserts", description: "Ameixas, baunilha e creme ligeiramente batido.", price: 8, image: maisonImage, position: "69% center" },
  { id: "mini-pancakes", name: "Mini pancakes", category: "Desserts", description: "Pequenos, fofos e perfeitos para partilhar — feitos na hora.", price: 5, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85", position: "center" },
  { id: "algodao-doce", name: "Algodão doce", category: "Desserts", description: "Leve, divertido e perfeito para festas e eventos.", price: 4, image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=900&q=85", position: "center" },
  { id: "cidre", name: "Cidre Brut", category: "Boissons", description: "Sidra artesanal bretã, fresca e delicadamente frutada.", price: 5.5, image: maisonImage, position: "center" },
  { id: "jus", name: "Sumo de maçã", category: "Boissons", description: "Sumo puro de maçã, de produção artesanal.", price: 4.5, image: heroImage, position: "18% center" },
];

export const formatPrice = (value: number) => `${value.toFixed(2).replace(".", ",")} €`;

export const galleryImages = [
  { src: heroImage, alt: "Galette bretonne servie sur une table en noyer", shape: "wide" },
  { src: craftImage, alt: "Artisan préparant une galette sur le billig", shape: "tall" },
  { src: menuImage, alt: "Sélection de crêpes et galettes artisanales", shape: "square" },
  { src: maisonImage, alt: "Table élégante dans une maison contemporaine", shape: "wide" },
];