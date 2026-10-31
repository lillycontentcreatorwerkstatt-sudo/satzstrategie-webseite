"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

// Erster Besuch auf Handy und Computer: Erst wird der Name aufgestempelt und wandert in die Kopfzeile. Dann steht die Weiche da:
// „Wir setzen es um“ lässt die Papierskulptur erscheinen, ihre roten Klammern werden zu [Text] [Design] [Technik];
// „Sie machen es selbst“ führt auf die eigene Seite.
// Ob das Intro läuft, entscheidet das Skript vor dem ersten Bild (Klasse paper-intro-on am <html>); die Zeiten stehen in rotstift.css.
// Die Zeiten nach der Weiche zählen ab dem Klick (Klasse paper-intro-go).
const INTRO_CHECK = `try{if(matchMedia("(max-width:760px) and (orientation:portrait) and (prefers-reduced-motion:no-preference), (min-width:761px) and (min-height:561px) and (prefers-reduced-motion:no-preference)").matches&&!sessionStorage.getItem("paper-intro")){sessionStorage.setItem("paper-intro","1");document.documentElement.classList.add("paper-intro-on")}}catch(e){}`;

// Mitte der beiden roten Klammern im Foto als Anteil der Bildbreite und -höhe, dazu ihre Höhe und Neigung (die Karte ist schräg fotografiert, die Klammern sind daher geschert, nicht gedreht).
const PHOTO_BRACKETS = [{ x: .3127, y: .5103, h: .1224 }, { x: .5831, y: .4242, h: .111 }];
// Die Klammer der Schrift ist kleiner als ihr Schriftgrad und sitzt tiefer als die Mitte ihrer Zeile; so deckt sie die Fotoklammer.
const MARK_FIT = 1.08;
const MARK_RAISE = .07;
// Die Fotoklammern sind kräftiger und haben längere Enden: zu Beginn etwas breiter und mit Schatten verdickt, im Flug wieder Schrift.
const MARK_WIDEN = 1.3;
const MARK_BOLD = [".01em 0", "-.01em 0", "0 .01em", "0 -.01em"].map(offset => `${offset} currentColor`).join(", ");
const MARK_THIN = "0 0 transparent, 0 0 transparent, 0 0 transparent, 0 0 transparent";
const PHOTO_ANGLE = -17;
// Stempel: Neigung wie in rotstift.css, Mitte bei 42 % der Bildschirmhöhe. Die Größe steht in rotstift.css.
const STAMP_ANGLE = -6;
const STAMP_TOP = .42;
// Nach dem Klick auf „Wir setzen es um“: Klammern erscheinen, dann fliegen sie, und das Foto schrumpft an seinen Platz.
const MARKS_SHOW = 750;
const MARKS_FLY = 1250;

export default function PaperIntro() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains("paper-intro-on") || html.classList.contains("paper-intro-done")) return;
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
    return () => html.classList.add("paper-intro-done");
  }, []);

  // Die Weiche: Ab hier läuft das bisherige Intro weiter, nur später.
  function startAgency() {
    const html = document.documentElement;
    const el = root.current;
    if (!el) return;
    window.scrollTo(0, 0);
    html.classList.add("paper-intro-go");
    document.getElementById("studio-content")?.focus({ preventScroll: true });
    const skip = () => html.classList.add("paper-intro-done");
    el.addEventListener("pointerdown", skip, { once: true });
    const photoEl = el.querySelector<HTMLElement>(".paper-intro-photo");
    // Das Foto füllt nur den Bereich zwischen Kopfzeile und Band.
    const hero = document.querySelector<HTMLElement>(".paper-hero")?.getBoundingClientRect();
    if (photoEl && hero) Object.assign(photoEl.style, { top: `${hero.top}px`, bottom: "auto", height: `${hero.height}px` });
    const photo = photoEl?.getBoundingClientRect();
    // Computer: Das Foto schrumpft an seinen Platz im Hero, während die Klammern ins Band fliegen.
    const art = document.querySelector<HTMLElement>(".hero-art")?.getBoundingClientRect();
    if (photoEl && photo && art && matchMedia("(min-width: 761px)").matches) {
      const box = (r: DOMRect) => ({ top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
      photoEl.animate([box(photo), box(art)], { duration: 650, delay: MARKS_FLY, easing: "cubic-bezier(.6, 0, .2, 1)", fill: "both" });
    }
    const links = [...document.querySelectorAll<HTMLElement>(".discipline-band a")];
    const marks = [...el.querySelectorAll<HTMLElement>(".paper-intro-mark")];
    if (photo && links.length * 2 === marks.length) {
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
          const scale = MARK_FIT * from.h * size / parseFloat(css.fontSize);
          const raise = MARK_RAISE * parseFloat(css.fontSize) * scale;
          const start = `translate(${offsetX + from.x * size - left - width / 2}px, ${offsetY + from.y * size - top - height / 2 - raise}px) skewY(${PHOTO_ANGLE}deg) scale(${scale * MARK_WIDEN}, ${scale})`;
          mark.animate([{ opacity: 0, transform: start, textShadow: MARK_BOLD }, { opacity: 1, transform: start, textShadow: MARK_BOLD }], { duration: 200, delay: MARKS_SHOW, fill: "both" });
          mark.animate([{ transform: start, textShadow: MARK_BOLD }, { transform: "none", textShadow: MARK_THIN }], { duration: 650, delay: MARKS_FLY + i * 50, easing: "cubic-bezier(.6, 0, .2, 1)", fill: "both" });
        });
      });
    }
  }

  return <>
    <script type={typeof window === "undefined" ? "text/javascript" : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: INTRO_CHECK }} />
    <div ref={root} className="paper-intro">
      <div className="paper-intro-stamp" aria-hidden="true"><span className="studio-brand">satzstrategie<span className="brand-mark">]</span></span></div>
      <div className="paper-intro-photo" aria-hidden="true"><Image src="/images/papierarchitektur.webp" alt="" fill loading="eager" sizes="(max-width: 760px) 100vh, 100vw" /></div>
      {["[", "]", "[", "]", "[", "]"].map((mark, i) => <span key={i} className="paper-intro-mark" aria-hidden="true">{mark}</span>)}
      <section className="paper-intro-choice" aria-label="Sie haben die Wahl">
        <p className="choice-claim"><span>Endlich gesehen werden.</span></p>
        <p className="choice-topics">Webseiten <span aria-hidden="true">·</span> Texte <span aria-hidden="true">·</span> Gestaltung</p>
        <p className="hand choice-hand">Sie haben die Wahl.</p>
        <div className="choice-actions">
          <div className="choice-path"><button type="button" className="studio-button choice-button" onClick={startAgency}>Wir setzen es um</button><p className="choice-note">Wir&nbsp;übernehmen die Arbeit an Ihrer&nbsp;Webseite.</p></div>
          <div className="choice-path"><Link className="studio-button choice-button" href="/selbst-machen">Sie machen es selbst</Link><p className="choice-note">Unser&nbsp;Paket dafür startet am 16.&nbsp;November.</p></div>
        </div>
        <nav className="choice-legal" aria-label="Kontakt und rechtliche Informationen"><Link href="/kontakt">Kontakt</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></nav>
      </section>
    </div>
  </>;
}
