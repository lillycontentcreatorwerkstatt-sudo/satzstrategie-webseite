"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { INQUIRY_EMAIL } from "@/lib/inquiry";
import { ProofCaret } from "./Proof";
import { siteNavigation } from "./siteNavigation";
export default function MobileMenu({ active = "", className = "" }: { active?: string; className?: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    // Ein Tipp auf die unscharfe Fläche trifft das details-Element selbst und schließt ebenfalls.
    const close = (event: PointerEvent) => { if (menu.current && (event.target === menu.current || !menu.current.contains(event.target as Node))) menu.current.open = false; };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const closeMenu = () => { if (menu.current) menu.current.open = false; };
  return <details ref={menu} className={`mobile-menu ${className}`} onKeyDown={event => {
    if (event.key === "Escape" && menu.current?.open) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); }
  }}><summary><span className="visually-hidden">Menü</span><span className="menu-icon" aria-hidden="true"><span /><span /><span /></span></summary><nav aria-label="Mobile Hauptnavigation">
    {siteNavigation.filter(item => item.href !== "/kontakt").map(item => <Link key={item.href} className="menu-item" href={item.href} aria-current={active === item.href ? "page" : undefined} onClick={closeMenu}><span className="menu-number" aria-hidden="true">{item.number}</span>{item.label}{active === item.href && <ProofCaret className="menu-current" />}</Link>)}
    <Link className="studio-button menu-contact" href="/kontakt" aria-current={active === "/kontakt" ? "page" : undefined} onClick={closeMenu}>Kontakt</Link>
    <a className="menu-mail" href={`mailto:${INQUIRY_EMAIL}`}>{INQUIRY_EMAIL}</a>
  </nav></details>;
}
