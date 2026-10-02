import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import craftImage from "@/assets/breizh-craft.jpg";
import maisonImage from "@/assets/breizh-maison.jpg";
import heroImage from "@/assets/breizh-hero.jpg";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/notre-histoire")({
  head: () => ({ meta: [
    { title: "Notre Histoire — BREIZH FOOD" }, { name: "description", content: "De la Bretagne au Portugal, découvrez l’histoire et les gestes de BREIZH FOOD." },
    { property: "og:title", content: "Notre Histoire — BREIZH FOOD" }, { property: "og:description", content: "Une histoire de sarrasin, de voyage et de partage." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Histoire,
});

function Histoire() { return <>
  <section className="page-hero page-hero--story"><div><span className="eyebrow">Chapitre I · Notre histoire</span><h1>Deux terres.<br /><em>Une même table.</em></h1></div><img src={craftImage} alt="Le geste artisanal breton" width={1024} height={1280} /></section>
  <section className="manifesto"><Reveal><p className="manifesto-lead">BREIZH signifie Bretagne. C’est de là que viennent le sarrasin, le goût du beurre salé et cette manière franche de cuisiner.</p></Reveal><Reveal><p>Au Portugal, nous avons trouvé une autre culture de table : généreuse, solaire, profondément attachée au produit. BREIZH FOOD est la rencontre naturelle de ces deux sensibilités.</p></Reveal></section>
  <section className="journey">
    {[{ n:"01", place:"Bretagne", coord:"48.2020° N", text:"La matière première. Le sarrasin, les côtes sauvages et le respect du geste.", image: heroImage }, { n:"02", place:"France", coord:"46.2276° N", text:"L’élégance sans ostentation. Le détail juste, la technique au service du goût.", image: craftImage }, { n:"03", place:"Portugal", coord:"38.7223° N", text:"La destination. La lumière, l’accueil et le plaisir de partager une table.", image: maisonImage }].map((item, index) => <Reveal className={`journey-row ${index % 2 ? "journey-row--reverse" : ""}`} key={item.place}><div className="journey-image"><img src={item.image} alt={item.place} width={900} height={1000} loading="lazy" /></div><div className="journey-copy"><span>{item.n}</span><span className="eyebrow">{item.coord}</span><h2>{item.place}</h2><p>{item.text}</p></div></Reveal>)}
  </section>
  <section className="quote-section"><span>“</span><blockquote>Faire simple demande<br />une infinie précision.</blockquote><p>Notre philosophie</p></section>
  <section className="slim-cta"><h2>Découvrez ce voyage dans l’assiette.</h2><Link to="/la-carte" className="brand-link brand-link--gold">Voir la carte <ArrowRight size={16} /></Link></section>
  </>; }