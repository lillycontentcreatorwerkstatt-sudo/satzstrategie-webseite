"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Handy, erster Besuch: Erst steht die ganze Papierskulptur da, dann werden ihre roten Klammern zu [Text] [Design] [Technik].
// Ob das Intro läuft, entscheidet das Skript vor dem ersten Bild (Klasse paper-intro-on am <html>); die Zeiten stehen in rotstift.css.
const INTRO_CHECK = `try{if(matchMedia("(max-width:760px) and (orientation:portrait) and (prefers-reduced-motion:no-preference)").matches&&!sessionStorage.getItem("paper-intro")){sessionStorage.setItem("paper-intro","1");document.documentElement.classList.add("paper-intro-on")}}catch(e){}`;

// Mitte der beiden roten Klammern im Foto als Anteil der Bildbreite und -höhe, dazu ihre Höhe und Neigung.
const PHOTO_BRACKETS = [{ x: .3127, y: .5087 }, { x: .5824, y: .4267 }];
const PHOTO_BRACKET_HEIGHT = .12;
const PHOTO_ANGLE = -17;

export default function PaperIntro() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains("paper-intro-on") || html.classList.contains("paper-intro-done")) return;
    const skip = () => html.classList.add("paper-intro-done");
    el.addEventListener("pointerdown", skip);
    const elapsed = Number(el.getAnimations()[0]?.currentTime ?? 0);
    const links = [...document.querySelectorAll<HTMLElement>(".discipline-band a")];
    const marks = [...el.querySelectorAll<HTMLElement>(".paper-intro-mark")];
    if (elapsed < 1100 && links.length * 2 === marks.length) {
      const size = Math.max(innerWidth, innerHeight), offsetX = (innerWidth - size) / 2, offsetY = (innerHeight - size) / 2;
      links.forEach((link, i) => {
        const box = link.getBoundingClientRect(), css = getComputedStyle(link);
        [marks[2 * i], marks[2 * i + 1]].forEach((mark, side) => {
          mark.style.fontSize = css.fontSize;
          mark.style.lineHeight = css.lineHeight;
          const width = mark.offsetWidth, height = mark.offsetHeight;
          const left = side ? box.right - width : box.left, top = box.top + (box.height - height) / 2;
          mark.style.left = `${left}px`;
          mark.style.top = `${top}px`;
          const from = PHOTO_BRACKETS[side];
          const scale = PHOTO_BRACKET_HEIGHT * size / parseFloat(css.fontSize);
          const start = `translate(${offsetX + from.x * size - left - width / 2}px, ${offsetY + from.y * size - top - height / 2}px) rotate(${PHOTO_ANGLE}deg) scale(${scale})`;
          mark.animate([{ opacity: 0, transform: start }, { opacity: 1, transform: start }], { duration: 200, delay: 1100 - elapsed, fill: "both" });
          mark.animate([{ transform: start }, { transform: "none" }], { duration: 650, delay: 1650 - elapsed + i * 50, easing: "cubic-bezier(.6, 0, .2, 1)", fill: "both" });
        });
      });
    }
    return () => { el.removeEventListener("pointerdown", skip); skip(); };
  }, []);
  return <>
    <script type={typeof window === "undefined" ? "text/javascript" : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: INTRO_CHECK }} />
    <div ref={root} className="paper-intro" aria-hidden="true">
      <div className="paper-intro-photo"><Image src="/images/papierarchitektur.webp" alt="" fill loading="eager" sizes="(max-width: 760px) 100vh, 50vw" /></div>
      {["[", "]", "[", "]", "[", "]"].map((mark, i) => <span key={i} className="paper-intro-mark">{mark}</span>)}
    </div>
  </>;
}
