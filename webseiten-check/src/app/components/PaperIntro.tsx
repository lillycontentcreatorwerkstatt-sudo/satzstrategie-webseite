"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

// Erster Besuch auf Handy und Computer: Erst wird der Name aufgestempelt und wandert in die Kopfzeile, dann steht die ganze Papierskulptur da
// und ihre roten Klammern werden zu [Text] [Design] [Technik].
// Ob das Intro läuft, entscheidet das Skript vor dem ersten Bild (Klasse paper-intro-on am <html>); die Zeiten stehen in rotstift.css.
const INTRO_CHECK = `try{if(matchMedia("(max-width:760px) and (orientation:portrait) and (prefers-reduced-motion:no-preference), (min-width:761px) and (min-height:561px) and (prefers-reduced-motion:no-preference)").matches&&!sessionStorage.getItem("paper-intro")){sessionStorage.setItem("paper-intro","1");document.documentElement.classList.add("paper-intro-on")}}catch(e){}`;

// Mitte der beiden roten Klammern im Foto als Anteil der Bildbreite und -höhe, dazu ihre Höhe und Neigung.
const PHOTO_BRACKETS = [{ x: .3127, y: .5087 }, { x: .5824, y: .4267 }];
const PHOTO_BRACKET_HEIGHT = .12;
const PHOTO_ANGLE = -17;
// Stempel: Neigung wie in rotstift.css, Mitte bei 42 % der Bildschirmhöhe. Die Größe steht in rotstift.css.
const STAMP_ANGLE = -6;
const STAMP_TOP = .42;

export default function PaperIntro() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains("paper-intro-on") || html.classList.contains("paper-intro-done")) return;
    const skip = () => html.classList.add("paper-intro-done");
    el.addEventListener("pointerdown", skip);
    const elapsed = Number(el.getAnimations()[0]?.currentTime ?? 0);
    const stamp = el.querySelector<HTMLElement>(".paper-intro-stamp");
    const brand = document.querySelector<HTMLElement>(".studio-header .studio-brand");
    if (stamp && brand && elapsed < 600) {
      const target = brand.getBoundingClientRect();
      const scale = target.width / (stamp.firstElementChild as HTMLElement).offsetWidth;
      const dx = target.left + target.width / 2 - el.clientWidth / 2, dy = target.top + target.height / 2 - el.clientHeight * STAMP_TOP;
      stamp.animate([
        { transform: `translate(-50%, -50%) rotate(${STAMP_ANGLE}deg)` },
        { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})` },
      ], { duration: 350, delay: 600 - elapsed, easing: "cubic-bezier(.6, 0, .2, 1)", fill: "both" });
    }
    const photoEl = el.querySelector<HTMLElement>(".paper-intro-photo");
    // Das Foto füllt nur den Bereich zwischen Kopfzeile und Band.
    const hero = document.querySelector<HTMLElement>(".paper-hero")?.getBoundingClientRect();
    if (photoEl && hero) Object.assign(photoEl.style, { top: `${hero.top}px`, bottom: "auto", height: `${hero.height}px` });
    const photo = photoEl?.getBoundingClientRect();
    // Computer: Das Foto schrumpft an seinen Platz im Hero, während die Klammern ins Band fliegen.
    const art = document.querySelector<HTMLElement>(".hero-art")?.getBoundingClientRect();
    if (photoEl && photo && art && matchMedia("(min-width: 761px)").matches && elapsed < 2200) {
      const box = (r: DOMRect) => ({ top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
      photoEl.animate([box(photo), box(art)], { duration: 650, delay: 2200 - elapsed, easing: "cubic-bezier(.6, 0, .2, 1)", fill: "both" });
    }
    const links = [...document.querySelectorAll<HTMLElement>(".discipline-band a")];
    const marks = [...el.querySelectorAll<HTMLElement>(".paper-intro-mark")];
    if (photo && elapsed < 1700 && links.length * 2 === marks.length) {
      const size = Math.max(photo.width, photo.height), offsetX = photo.left + (photo.width - size) / 2, offsetY = photo.top + (photo.height - size) / 2;
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
          mark.animate([{ opacity: 0, transform: start }, { opacity: 1, transform: start }], { duration: 200, delay: 1700 - elapsed, fill: "both" });
          mark.animate([{ transform: start }, { transform: "none" }], { duration: 650, delay: 2200 - elapsed + i * 50, easing: "cubic-bezier(.6, 0, .2, 1)", fill: "both" });
        });
      });
    }
    return () => { el.removeEventListener("pointerdown", skip); skip(); };
  }, []);
  return <>
    <script type={typeof window === "undefined" ? "text/javascript" : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: INTRO_CHECK }} />
    <div ref={root} className="paper-intro" aria-hidden="true">
      <div className="paper-intro-stamp"><span className="studio-brand">satzstrategie<span className="brand-mark">]</span></span></div>
      <div className="paper-intro-photo"><Image src="/images/papierarchitektur.webp" alt="" fill loading="eager" sizes="(max-width: 760px) 100vh, 100vw" /></div>
      {["[", "]", "[", "]", "[", "]"].map((mark, i) => <span key={i} className="paper-intro-mark">{mark}</span>)}
    </div>
  </>;
}
