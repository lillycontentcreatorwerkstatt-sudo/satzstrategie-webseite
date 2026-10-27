"use client";
import { useEffect, useState } from "react";
import { ProofCaret } from "./Proof";

// Erscheint nach etwa einer Bildschirmhöhe und bringt Leserinnen samt Tastaturfokus zurück an den Anfang.
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => { frame = 0; setVisible(window.scrollY > window.innerHeight * 0.8); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("studio-content")?.focus({ preventScroll: true });
  }
  return <button type="button" className="back-to-top no-print" data-visible={visible} aria-label="Nach oben" title="Nach oben" onClick={toTop}><ProofCaret className="back-to-top-caret" /></button>;
}
