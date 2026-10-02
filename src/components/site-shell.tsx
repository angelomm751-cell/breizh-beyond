import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, Menu, X } from "lucide-react";
import { CartButton, CartDrawer, CartProvider } from "./cart";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/notre-histoire", label: "Notre histoire" },
  { to: "/la-carte", label: "La carte" },
  { to: "/galerie", label: "Galerie" },
  { to: "/contact", label: "Contact" },
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
        <Link to="/" className="wordmark" aria-label="BREIZH FOOD — Accueil"><span>BREIZH</span><small>Food</small></Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {links.map((link) => <Link key={link.to} to={link.to} activeProps={{ className: "is-active" }}>{link.label}</Link>)}
        </nav>
        <div className="header-actions">
          <CartButton compact />
          <Link to="/commander" className="header-order">Commander</Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu"><Menu /></button>
        </div>
      </header>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!menuOpen}>
        <div className="mobile-menu-head"><span className="wordmark"><span>BREIZH</span><small>Food</small></span><button className="icon-button icon-button--light" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu"><X /></button></div>
        <div className="mobile-menu-rule" />
        <nav aria-label="Navigation mobile">
          {[...links.slice(0, 4), { to: "/commander" as const, label: "Commander" }, links[4]].map((link, index) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{ "--i": index } as React.CSSProperties}><span>0{index + 1}</span>{link.label}</Link>
          ))}
        </nav>
        <div className="mobile-menu-foot"><span>Bretagne · France · Portugal</span><span>48.2020° N — 38.7223° N</span></div>
      </div>

      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-mark"><span>BREIZH</span><em>FOOD</em><p>De Bretagne à Portugal</p></div>
        <div className="footer-grid">
          <div><span className="eyebrow">La maison</span><Link to="/notre-histoire">Notre histoire</Link><Link to="/la-carte">La carte</Link><Link to="/galerie">Galerie</Link></div>
          <div><span className="eyebrow">Nous trouver</span><p>Adresse à confirmer<br />Portugal</p><Link to="/contact">Contacts & horaires</Link></div>
          <div><span className="eyebrow">À votre table</span><Link to="/commander">Commander à domicile</Link><a href="mailto:bonjour@breizhfood.pt">bonjour@breizhfood.pt</a></div>
          <a href="https://instagram.com" aria-label="Instagram" className="footer-social"><Instagram /><span>Instagram</span></a>
        </div>
        <div className="footer-bottom"><span>© 2026 BREIZH FOOD</span><span>Informations de démonstration à remplacer avant publication</span></div>
      </footer>
      <Link to="/commander" className="mobile-order">Commander <ArrowRight size={16} /></Link>
      <CartDrawer />
    </CartProvider>
  );
}