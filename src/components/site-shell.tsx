import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, Menu, X } from "lucide-react";
import { CartButton, CartDrawer, CartProvider } from "./cart";

const links = [
  { to: "/", label: "Início" },
  { to: "/notre-histoire", label: "A nossa história" },
  { to: "/la-carte", label: "A ementa" },
  { to: "/galerie", label: "Galeria" },
  { to: "/contact", label: "Contacto" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <CartProvider>
      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <Link to="/" className="wordmark" aria-label="BREIZH FOOD — Início"><span>BREIZH</span><small>Food</small></Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => <Link key={link.to} to={link.to} activeProps={{ className: "is-active" }}>{link.label}</Link>)}
        </nav>
        <div className="header-actions">
          <CartButton compact />
          <Link to="/commander" className="header-order">Encomendar</Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
        </div>
      </header>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!menuOpen}>
        <div className="mobile-menu-head"><span className="wordmark"><span>BREIZH</span><small>Food</small></span><button className="icon-button icon-button--light" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button></div>
        <div className="mobile-menu-rule" />
        <nav aria-label="Navegação móvel">
          {[...links.slice(0, 4), { to: "/commander" as const, label: "Encomendar" }, links[4]].map((link, index) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{ "--i": index } as React.CSSProperties}><span>0{index + 1}</span>{link.label}</Link>
          ))}
        </nav>
        <div className="mobile-menu-foot"><span>Bretanha · França · Portugal</span><span>48.2020° N — 38.7223° N</span></div>
      </div>

      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-mark"><span>BREIZH</span><em>FOOD</em><p>Da Bretanha a Portugal</p></div>
        <div className="footer-grid">
          <div><span className="eyebrow">A casa</span><Link to="/notre-histoire">A nossa história</Link><Link to="/la-carte">A ementa</Link><Link to="/galerie">Galeria</Link></div>
          <div><span className="eyebrow">Onde estamos</span><p>Adresse à confirmer<br />Portugal</p><Link to="/contact">Contacto & horários</Link></div>
          <div><span className="eyebrow">À sua mesa</span><Link to="/commander">Encomendar para casa</Link><a href="mailto:bonjour@breizhfood.pt">bonjour@breizhfood.pt</a></div>
          <a href="https://instagram.com" aria-label="Instagram" className="footer-social"><Instagram /><span>Instagram</span></a>
        </div>
        <div className="footer-bottom"><span>© 2026 BREIZH FOOD</span><span>Informações de demonstração a substituir antes da publicação</span></div>
      </footer>
      <Link to="/commander" className="mobile-order">Encomendar <ArrowRight size={16} /></Link>
      <CartDrawer />
    </CartProvider>
  );
}