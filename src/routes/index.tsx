import { useMenu } from "@/hooks/use-menu";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import heroImage from "@/assets/breizh-hero.jpg";
import craftImage from "@/assets/breizh-craft.jpg";
import menuImage from "@/assets/breizh-menu.jpg";
import maisonImage from "@/assets/breizh-maison.jpg";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "BREIZH FOOD — Da Bretanha a Portugal" },
    { name: "description", content: "Galettes, crepes e sabores artesanais da Bretanha, em Portugal." },
    { property: "og:title", content: "BREIZH FOOD — Da Bretanha a Portugal" },
    { property: "og:description", content: "Uma casa gastronómica de inspiração bretã contemporânea em Portugal." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  const products = useMenu();
  const pairedProducts = products
    .filter((product) => !product.name.endsWith(" · Menu"))
    .map((product) => ({
      product,
      menuProduct: products.find((candidate) =>
        candidate.name === product.name.replace(/ · Só$/i, " · Menu")
      ),
    }));

  return (
    <>
      <section className="hero">
        <div className="hero-intro" aria-hidden="true"><i /><span>BREIZH FOOD</span><i /></div>
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">Bretagne · France · Portugal</span>
          <h1><span>Breizh</span><span>Food</span></h1>
          <p>Uma cozinha com carácter, inspirada na Bretanha e servida com o coração em Portugal.</p>
          <Link to="/la-carte" className="text-link">Descobrir a ementa <ArrowRight size={16} /></Link>
        </div>
        <div className="hero-image"><img src={heroImage} alt="Galette artesanal BREIZH FOOD" width={1536} height={1024} fetchPriority="high" /></div>
        <div className="hero-side"><span>Da Bretanha</span><i /><span>A Portugal</span></div>
        <a href="#maison" className="hero-scroll" aria-label="Descobrir a seguir"><ArrowDown size={17} /> Descer</a>
      </section>

      <section className="intro-section" id="maison">
        <Reveal className="section-kicker"><span>01</span><span className="eyebrow">La maison</span><i /></Reveal>
        <div className="intro-grid">
          <Reveal><h2>O sabor do <em>savoir-faire</em>,<br /><em>a elegância para partilhar.</em></h2></Reveal>
          <Reveal className="intro-copy"><p>Reunimos o trigo-sarraceno bretão, a manteiga salgada e o espírito acolhedor das mesas portuguesas. Uma cozinha cuidada, generosa e sem artifícios.</p><Link to="/notre-histoire" className="text-link">Découvrir a nossa história <ArrowRight size={16} /></Link></Reveal>
        </div>
        <div className="story-composition">
          <Reveal className="story-image-main"><img src={craftImage} alt="Preparação artesanal de uma galette" width={1024} height={1280} loading="lazy" /></Reveal>
          <Reveal className="story-image-small"><img src={maisonImage} alt="A mesa da casa" width={1536} height={1024} loading="lazy" /></Reveal>
          <div className="story-caption"><span>48.2020° N</span><p>O saber-fazer<br />em cada gesto</p></div>
        </div>
      </section>

      <section className="route-section">
        <Reveal className="route-origin"><span className="eyebrow">Origem</span><h2>Bretagne</h2><p>48.2020° N</p></Reveal>
        <div className="route-line"><i /><span>2 137 KM</span><i /></div>
        <Reveal className="route-origin route-origin--end"><span className="eyebrow">Destino</span><h2>Portugal</h2><p>38.7223° N</p></Reveal>
      </section>

      <section className="menu-preview">
        <Reveal className="section-heading"><span className="eyebrow">02 · La carte</span><h2>A ementa completa,<br /><em>à votre manière.</em></h2><p>Escolhe o produto e usa o <strong>+</strong> para escolher Só ou Menu e personalizar o teu pedido.</p></Reveal>
        <div className="product-grid">{pairedProducts.map(({ product, menuProduct }, index) => <ProductCard product={product} menuProduct={menuProduct} index={index} key={product.id} />)}</div>
        <Reveal className="section-heading"><Link to="/commander" className="text-link">Encomendar e ver o carrinho <ArrowRight size={16} /></Link></Reveal>
      </section>

      <section className="wood-section">
        <img src={maisonImage} alt="Ambiente acolhedor da BREIZH FOOD" width={1536} height={1024} loading="lazy" />
        <div className="wood-shade" />
        <Reveal className="wood-copy"><span className="eyebrow">Une maison vivante</span><h2>À francesa.<br /><em>À votre table.</em></h2><p>Ingredientes genuínos, luz suave e o prazer simples de um prato feito na hora.</p></Reveal>
      </section>

      <section className="editorial-gallery">
        <Reveal className="gallery-copy"><span className="eyebrow">04 · Galerie</span><h2>Nos bastidores<br /><em>de la Breizh.</em></h2><Link to="/galerie" className="text-link">Ver a galeria <ArrowRight size={16} /></Link></Reveal>
        <Reveal className="gallery-tile gallery-tile--a"><img src={menuImage} alt="A ementa BREIZH FOOD" width={1536} height={1024} loading="lazy" /></Reveal>
        <Reveal className="gallery-tile gallery-tile--b"><img src={craftImage} alt="Preparação artesanal" width={1024} height={1280} loading="lazy" /></Reveal>
      </section>

      <section className="final-cta">
        <div className="final-cta-image"><img src={heroImage} alt="Galette prête à déguster" width={1536} height={1024} loading="lazy" /></div>
        <Reveal className="final-cta-copy"><span className="eyebrow">Breizh Food · chez vous</span><h2>Um pequeno sabor<br />de <em>Bretagne</em>&nbsp;?</h2><p>Os sabores da Bretanha, diretamente em sua casa.</p><Link to="/commander" className="brand-link brand-link--gold">Encomendar para casa <ArrowRight size={16} /></Link></Reveal>
      </section>
    </>
  );
}
