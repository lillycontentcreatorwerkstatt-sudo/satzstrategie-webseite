import Link from "next/link";
import type { ReactNode } from "react";
import BackToTop from "./BackToTop";
import MobileMenu from "./MobileMenu";
import { siteNavigation } from "./siteNavigation";

export default function StudioShell({ active, children, flowFooter = false }: { active: string; children: ReactNode; flowFooter?: boolean }) {
  return <div className={flowFooter ? "studio-page studio-page--flow-footer" : "studio-page"}>
    <a className="studio-skip" href="#studio-content">Zum Inhalt springen</a>
    <header className="studio-header no-print">
      <Link className="studio-brand" href="/" aria-label="Satzstrategie, Startseite">satzstrategie<span className="brand-mark" aria-hidden="true">]</span></Link>
      <nav className="studio-desktop-nav" aria-label="Hauptnavigation">{siteNavigation.map(item => <Link key={item.href} href={item.href} className={item.href === "/kontakt" ? "nav-contact" : undefined} aria-current={active === item.href ? "page" : undefined}>{item.label}</Link>)}</nav>
      <MobileMenu active={active} key={active} />
    </header>
    <main id="studio-content" tabIndex={-1}>{children}</main>
    <BackToTop />
    <footer className="studio-footer no-print">
      <span className="footer-credit">© {new Date().getFullYear()} Satzstrategie</span>
      <nav aria-label="Kontakt und rechtliche Informationen"><Link className="footer-contact" href="/kontakt">Kontakt</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></nav>
    </footer>
  </div>;
}
export function StudioEyebrow({ children }: { number?: string; children: ReactNode }) { return <p className="report-stage">{children}</p>; }
export function StudioNext({ href, label, actionLabel, children }: { href: string; label: string; actionLabel: string; children: ReactNode }) {
  return <section className="studio-next no-print"><div><h2>{children}</h2><p>{label}</p></div><Link className="studio-button" href={href}>{actionLabel}</Link></section>;
}
