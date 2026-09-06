"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { siteNavigation } from "./siteNavigation";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ active = "", className = "" }: { active?: string; className?: string }) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) menuRef.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details ref={menuRef} className={`${styles.menu} ${className}`} onKeyDown={event => {
      if (event.key === "Escape" && menuRef.current?.open) {
        event.preventDefault();
        menuRef.current.open = false;
        menuRef.current.querySelector("summary")?.focus();
      }
    }}>
      <summary>Menü <span aria-hidden="true">+</span></summary>
      <nav aria-label="Mobile Hauptnavigation">
        {siteNavigation.map(item => (
          <Link key={item.href} href={item.href} aria-current={active === item.href ? "page" : undefined} onClick={() => { if (menuRef.current) menuRef.current.open = false; }}>
            <span aria-hidden="true">{item.number}</span>{item.label}<span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </details>
  );
}
