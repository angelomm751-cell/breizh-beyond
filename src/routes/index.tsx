import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import heroImage from "@/assets/breizh-hero.jpg";
import craftImage from "@/assets/breizh-craft.jpg";
import menuImage from "@/assets/breizh-menu.jpg";
import maisonImage from "@/assets/breizh-maison.jpg";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/menu";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "BREIZH FOOD — De Bretagne à Portugal" },
    { name: "description", content: "Galettes, crêpes et saveurs artisanales de Bretagne, au Portugal." },
    { property: "og:title", content: "BREIZH FOOD — De Bretagne à Portugal" },
    { property: "og:description", content: "Une maison gastronomique bretonne contemporaine au Portugal." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <>
      <section className="hero">
        <div className="hero-intro" aria-hidden="true"><i /><span>BREIZH FOOD</span><i /></div>
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">Bretagne · France · Portugal</span>
          <h1><span>Breizh</span><span>Food</span></h1>
          <p>Une cuisine de caractère, façonnée par la Bretagne et servie avec le cœur au Portugal.</p>
          <Link to="/la-carte" className="text-link">Découvrir la carte <ArrowRight size={16} /></Link>
        </div>
        <div className="hero-image"><img src={heroImage} alt="Galette artisanale BREIZH FOOD" width={1536} height={1024} fetchPriority="high" /></div>
        <div className="hero-side"><span>De Bretagne</span><i /><span>À Portugal</span></div>
        <a href="#maison" className="hero-scroll" aria-label="Découvrir la suite"><ArrowDown size={17} /> Défiler</a>
      </section>

      <section className="intro-section" id="maison">
        <Reveal className="section-kicker"><span>01</span><span className="eyebrow">La maison</span><i /></Reveal>
        <div className="intro-grid">
          <Reveal><h2>Le goût du geste,<br /><em>l’élégance en partage.</em></h2></Reveal>
          <Reveal className="intro-copy"><p>Nous réunissons le sarrasin breton, le beurre demi-sel et l’esprit chaleureux des tables portugaises. Une cuisine précise, généreuse, sans artifice.</p><Link to="/notre-histoire" className="text-link">Lire notre histoire <ArrowRight size={16} /></Link></Reveal>
        </div>
        <div className="story-composition">
          <Reveal className="story-image-main"><img src={craftImage} alt="Préparation artisanale d’une galette" width={1024} height={1280} loading="lazy" /></Reveal>
          <Reveal className="story-image-small"><img src={maisonImage} alt="La table de la maison" width={1536} height={1024} loading="lazy" /></Reveal>
          <div className="story-caption"><span>48.2020° N</span><p>Le savoir-faire<br />dans chaque geste</p></div>
        </div>
      </section>

      <section className="route-section">
        <Reveal className="route-origin"><span className="eyebrow">Origine</span><h2>Bretagne</h2><p>48.2020° N</p></Reveal>
        <div className="route-line"><i /><span>2 137 KM</span><i /></div>
        <Reveal className="route-origin route-origin--end"><span className="eyebrow">Destination</span><h2>Portugal</h2><p>38.7223° N</p></Reveal>
      </section>

      <section className="menu-preview">
        <Reveal className="section-heading"><span className="eyebrow">02 · La carte</span><h2>Des classiques,<br /><em>à notre manière.</em></h2><Link to="/la-carte" className="text-link">Voir toute la carte <ArrowRight size={16} /></Link></Reveal>
        <div className="product-grid">{products.slice(0, 3).map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}</div>
      </section>

      <section className="menu-preview boutique-preview">
        <Reveal className="section-heading"><span className="eyebrow">03 · Boutique</span><h2>Nos coups de cœur,<br /><em>à déguster au Portugal.</em></h2><p>Crêpes, mini pancakes e algodão doce — une petite touche de Bretagne, feita na hora.</p><Link to="/commander" className="text-link">Ver produtos e encomendar <ArrowRight size={16} /></Link></Reveal>
        <div className="product-grid">{products.slice(6, 8).map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}</div>
      </section>

      <section className="wood-section">
        <img src={maisonImage} alt="Intérieur chaleureux de la maison BREIZH FOOD" width={1536} height={1024} loading="lazy" />
        <div className="wood-shade" />
        <Reveal className="wood-copy"><span className="eyebrow">Une maison vivante</span><h2>À la française.<br /><em>À votre table.</em></h2><p>Des matières vraies, une lumière douce, le plaisir simple d’un plat fait minute.</p></Reveal>
      </section>

      <section className="editorial-gallery">
        <Reveal className="gallery-copy"><span className="eyebrow">03 · Galerie</span><h2>Dans les coulisses<br /><em>de Breizh.</em></h2><Link to="/galerie" className="text-link">Voir la galerie <ArrowRight size={16} /></Link></Reveal>
        <Reveal className="gallery-tile gallery-tile--a"><img src={menuImage} alt="La carte BREIZH FOOD" width={1536} height={1024} loading="lazy" /></Reveal>
        <Reveal className="gallery-tile gallery-tile--b"><img src={craftImage} alt="Préparation artisanale" width={1024} height={1280} loading="lazy" /></Reveal>
      </section>

      <section className="final-cta">
        <div className="final-cta-image"><img src={heroImage} alt="Galette prête à déguster" width={1536} height={1024} loading="lazy" /></div>
        <Reveal className="final-cta-copy"><span className="eyebrow">Breizh Food chez vous</span><h2>Un petit goût<br />de Bretagne&nbsp;?</h2><p>Les saveurs de Bretagne, directement chez vous.</p><Link to="/commander" className="brand-link brand-link--gold">Commander à domicile <ArrowRight size={16} /></Link></Reveal>
      </section>
    </>
  );
}
