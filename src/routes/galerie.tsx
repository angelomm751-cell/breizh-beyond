import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { galleryImages } from "@/lib/menu";

export const Route = createFileRoute("/galerie")({ head: () => ({ meta: [
  { title: "Galerie — BREIZH FOOD" }, { name: "description", content: "Gestes, matières et assiettes de la maison BREIZH FOOD." },
  { property: "og:title", content: "Galerie — BREIZH FOOD" }, { property: "og:description", content: "Entrez dans l’univers visuel de BREIZH FOOD." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Galerie });
function Galerie() {
  const [selected, setSelected] = useState<number | null>(null);
  return <><section className="page-title page-title--compact"><span className="eyebrow">Le regard de la maison</span><h1>Galerie</h1></section><section className="gallery-grid">{[...galleryImages, ...galleryImages.slice().reverse()].map((image, index) => <button key={index} className={`gallery-item gallery-item--${image.shape}`} onClick={() => setSelected(index)} aria-label={`Agrandir : ${image.alt}`}><img src={image.src} alt={image.alt} width={1000} height={800} loading={index > 1 ? "lazy" : undefined} /><span>0{index + 1}</span></button>)}</section>{selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photographie agrandie"><button onClick={() => setSelected(null)} aria-label="Fermer"><X /></button><img src={[...galleryImages, ...galleryImages.slice().reverse()][selected]?.src} alt={[...galleryImages, ...galleryImages.slice().reverse()][selected]?.alt ?? ""} /></div>}</>;
}