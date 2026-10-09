import Link from "next/link";
import type { ReactNode } from "react";
import MobileMenu from "./MobileMenu";
import Arrow from "./Arrow";
import { siteNavigation } from "./siteNavigation";

export default function StudioShell({ active, children }: { active: string; children: ReactNode }) {
  return <div className="studio-page">
    <a className="studio-skip" href="#studio-content">Zum Inhalt springen</a>
    <header className="studio-header no-print">
      <Link className="studio-brand" href="/" aria-label="Satzstrategie, Startseite">satzstrategie<span className="brand-mark" aria-hidden="true">]</span></Link>
      <nav className="studio-desktop-nav" aria-label="Hauptnavigation">{siteNavigation.map(item => <Link key={item.href} href={item.href} aria-current={active === item.href ? "page" : undefined}>{item.label}{item.href === "/kontakt" && <Arrow />}</Link>)}</nav>
      <MobileMenu active={active} key={active} />
    </header>
    <main id="studio-content" tabIndex={-1}>{children}</main>
    <footer className="studio-footer no-print">
      <span className="footer-credit">© {new Date().getFullYear()} Satzstrategie</span>
      <nav aria-label="Kontakt und rechtliche Informationen"><Link href="/kontakt">Kontakt <Arrow /></Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></nav>
    </footer>
  </div>;
}
export function StudioEyebrow({ children }: { number?: string; children: ReactNode }) { return <p className="report-stage">{children}</p>; }
export function StudioNext({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return <section className="studio-next no-print"><Link href={href}>{children}<Arrow /></Link><p>{label}</p></section>;
}
