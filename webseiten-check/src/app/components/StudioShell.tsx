import Link from "next/link";
import type { ReactNode } from "react";
import MobileMenu from "./MobileMenu";
import { siteNavigation as navigation } from "./siteNavigation";
import "./studio.css";

export default function StudioShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="studio-page">
      <a className="studio-skip" href="#studio-content">Zum Inhalt</a>
      <header className="studio-header no-print">
        <div className="studio-header-inner">
          <Link className="studio-brand" href="/" aria-label="Satzstrategie – Startseite">satzstrategie.</Link>
          <nav className="studio-desktop-nav" aria-label="Hauptnavigation">
            {navigation.map(item => <Link key={item.href} href={item.href} aria-current={active === item.href ? "page" : undefined}><span>{item.number}</span>{item.label}{item.href === "/kontakt" && <span aria-hidden="true">↗</span>}</Link>)}
          </nav>
          <div className="studio-mobile-actions">
            <Link href="/kontakt" aria-label="Gespräch anfragen">Kontakt ↗</Link>
            <MobileMenu active={active} key={active} />
          </div>
        </div>
      </header>
      <main id="studio-content" className="studio-main">{children}</main>
      <footer className="studio-footer no-print">
        <Link href="/" className="studio-footer-brand">satzstrategie.</Link>
        <span>© {new Date().getFullYear()}</span>
        <nav aria-label="Rechtliche Informationen"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></nav>
      </footer>
    </div>
  );
}

export function StudioEyebrow({ number, children }: { number: string; children: ReactNode }) {
  return <p className="studio-eyebrow"><span>{number}</span>{children}</p>;
}

export function StudioNext({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return <section className="studio-next no-print"><p className="studio-label">{label}</p><Link href={href}>{children}<span aria-hidden="true">↗</span></Link></section>;
}
