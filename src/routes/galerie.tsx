import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { galleryImages } from "@/lib/menu";

export const Route = createFileRoute("/galerie")({ head: () => ({ meta: [
  { title: "Galeria — BREIZH FOOD" }, { name: "description", content: "Gestos, matérias e pratos da casa BREIZH FOOD." },
  { property: "og:title", content: "Galeria — BREIZH FOOD" }, { property: "og:description", content: "Entre no universo visual da BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Galerie });
function Galerie() {
  const [selected, setSelected] = useState<number | null>(null);
  return <><section className="page-title page-title--compact"><span className="eyebrow">O olhar da casa</span><h1>Galerie</h1></section><section className="gallery-grid">{[...galleryImages, ...galleryImages.slice().reverse()].map((image, index) => <button key={index} className={`gallery-item gallery-item--${image.shape}`} onClick={() => setSelected(index)} aria-label={`Ampliar: ${image.alt}`}><img src={image.src} alt={image.alt} width={1000} height={800} loading={index > 1 ? "lazy" : undefined} /><span>0{index + 1}</span></button>)}</section>{selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Fotografia ampliada"><button onClick={() => setSelected(null)} aria-label="Fechar"><X /></button><img src={[...galleryImages, ...galleryImages.slice().reverse()][selected]?.src} alt={[...galleryImages, ...galleryImages.slice().reverse()][selected]?.alt ?? ""} /></div>}</>;
}