import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import craftImage from "@/assets/breizh-craft.jpg";
import maisonImage from "@/assets/breizh-maison.jpg";
import heroImage from "@/assets/breizh-hero.jpg";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/notre-histoire")({
  head: () => ({ meta: [
    { title: "A Nossa História — BREIZH FOOD" }, { name: "description", content: "Da Bretanha a Portugal, descubra a história e o saber-fazer da BREIZH FOOD." },
    { property: "og:title", content: "A Nossa História — BREIZH FOOD" }, { property: "og:description", content: "Uma história de trigo-sarraceno, viagem e partilha." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Histoire,
});

function Histoire() { return <>
  <section className="page-hero page-hero--story"><div><span className="eyebrow">Chapitre I · A nossa história</span><h1>Duas terras.<br /><em>Une même table.</em></h1></div><img src={craftImage} alt="O gesto artesanal bretão" width={1024} height={1280} /></section>
  <section className="manifesto"><Reveal><p className="manifesto-lead">BREIZH significa Bretanha. É de lá que vêm o trigo-sarraceno, o sabor da manteiga salgada e esta forma genuína de cozinhar.</p></Reveal><Reveal><p>Em Portugal, encontrámos outra cultura à mesa: generosa, solar e profundamente ligada ao produto. A BREIZH FOOD é o encontro natural destas duas sensibilidades.</p></Reveal></section>
  <section className="journey">
    {[{ n:"01", place:"Bretanha", coord:"48.2020° N", text:"A matéria-prima. O trigo-sarraceno, as costas selvagens e o respeito pelo saber-fazer.", image: heroImage }, { n:"02", place:"France", coord:"46.2276° N", text:"A elegância sem excessos. O detalhe certo e a técnica ao serviço do sabor.", image: craftImage }, { n:"03", place:"Portugal", coord:"38.7223° N", text:"O destino. A luz, o acolhimento e o prazer de partilhar uma mesa.", image: maisonImage }].map((item, index) => <Reveal className={`journey-row ${index % 2 ? "journey-row--reverse" : ""}`} key={item.place}><div className="journey-image"><img src={item.image} alt={item.place} width={900} height={1000} loading="lazy" /></div><div className="journey-copy"><span>{item.n}</span><span className="eyebrow">{item.coord}</span><h2>{item.place}</h2><p>{item.text}</p></div></Reveal>)}
  </section>
  <section className="quote-section"><span>“</span><blockquote>Faire simple exige<br />uma precisão infinita.</blockquote><p>Notre philosophie</p></section>
  <section className="slim-cta"><h2>Découvrez esta viagem no prato.</h2><Link to="/la-carte" className="brand-link brand-link--gold">Ver a ementa <ArrowRight size={16} /></Link></section>
  </>; }