"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { siteNavigation } from "./siteNavigation";
import Arrow from "./Arrow";
export default function MobileMenu({ active = "", className = "" }: { active?: string; className?: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false; };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return <details ref={menu} className={`mobile-menu ${className}`} onKeyDown={event => {
    if (event.key === "Escape" && menu.current?.open) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); }
  }}><summary>Menü <span className="menu-cross" aria-hidden="true" /></summary><nav aria-label="Mobile Hauptnavigation">{siteNavigation.map(item => <Link key={item.href} href={item.href} aria-current={active === item.href ? "page" : undefined} onClick={() => { if (menu.current) menu.current.open = false; }}>{item.label}<Arrow /></Link>)}</nav></details>;
}
