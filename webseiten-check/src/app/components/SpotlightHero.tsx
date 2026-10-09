"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MobileMenu from "./MobileMenu";

const HERO_SEEN_KEY = "satzstrategie-hero-seen";

export default function SpotlightHero() {
  const router = useRouter();
  const stageRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const builderRef = useRef<HTMLParagraphElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hintRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const arrivalRef = useRef<HTMLParagraphElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const targetRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const timersRef = useRef<number[]>([]);
  const animationsRef = useRef<Animation[]>([]);
  const replayRef = useRef<() => void>(() => undefined);
  const finishRef = useRef<() => void>(() => undefined);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const builder = builderRef.current;
    const row = rowRef.current;
    const arrival = arrivalRef.current;
    const period = periodRef.current;
    const prefix = prefixRef.current;
    const words = wordRefs.current;
    const hints = hintRefs.current;
    const targets = targetRefs.current;

    if (!stage || !scene || !builder || !row || !arrival || !period || !prefix) return;
    if (words.some((word) => !word) || hints.some((hint) => !hint) || targets.some((target) => !target)) return;

    const later = (delay: number, action: () => void) => {
      timersRef.current.push(window.setTimeout(action, delay));
    };

    const clearMotion = () => {
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
    };

    const resetPieces = () => {
      words.forEach((word) => word?.classList.remove("is-revealed"));
      hints.forEach((hint) => hint?.classList.remove("is-visible", "is-amber"));
      arrival.classList.remove("is-revealed");
      period.classList.remove("is-flashing");
    };

    const placeSpotlight = (element: HTMLElement) => {
      const sceneBox = scene.getBoundingClientRect();
      const wordBox = element.getBoundingClientRect();
      const builderBox = builder.getBoundingClientRect();
      const x = wordBox.left - sceneBox.left + wordBox.width / 2;
      const sourceY = builderBox.bottom - sceneBox.top + 34;
      const targetY = wordBox.top - sceneBox.top + wordBox.height / 2;
      stage.style.setProperty("--spot-x", `${x}px`);
      stage.style.setProperty("--source-y", `${sourceY}px`);
      stage.style.setProperty("--target-y", `${targetY}px`);
      stage.style.setProperty("--beam-width", "20rem");
      stage.style.setProperty("--beam-half", "10rem");
      stage.style.setProperty("--beam-height", `${Math.max(80, targetY - sourceY + 66)}px`);
    };

    const spreadSpotlight = () => {
      const sceneBox = scene.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      const builderBox = builder.getBoundingClientRect();
      const x = rowBox.left - sceneBox.left + rowBox.width / 2;
      const sourceY = builderBox.bottom - sceneBox.top + 34;
      const targetY = rowBox.top - sceneBox.top + rowBox.height / 2;
      const width = Math.max(sceneBox.width * 1.45, rowBox.width + 360);
      stage.style.setProperty("--spot-x", `${x}px`);
      stage.style.setProperty("--source-y", `${sourceY}px`);
      stage.style.setProperty("--target-y", `${targetY}px`);
      stage.style.setProperty("--beam-width", `${width}px`);
      stage.style.setProperty("--beam-half", `${width / 2}px`);
      stage.style.setProperty("--beam-height", `${Math.max(120, targetY - sourceY + 96)}px`);
      stage.classList.add("is-wide-spotlight");
    };

    const showFinal = () => {
      clearMotion();
      resetPieces();
      stage.className = "spotlight-page is-final is-complete";
      ["--spot-x", "--source-y", "--target-y", "--beam-height", "--beam-width", "--beam-half"].forEach((property) => stage.style.removeProperty(property));
    };
    finishRef.current = showFinal;

    const morphSentence = () => {
      const pairs: Array<[HTMLElement, HTMLElement]> = [
        [prefix, targets[0]!],
        [words[0]!, targets[1]!],
        [words[1]!, targets[2]!],
        [words[2]!, targets[3]!],
        [arrival, targets[4]!],
      ];

      stage.classList.add("is-morphing");
      pairs.forEach(([source, target]) => {
        const sourceBox = source.getBoundingClientRect();
        const targetBox = target.getBoundingClientRect();
        const dx = targetBox.left + targetBox.width / 2 - sourceBox.left - sourceBox.width / 2;
        const dy = targetBox.top + targetBox.height / 2 - sourceBox.top - sourceBox.height / 2;
        const scale = Math.min(1, targetBox.height / Math.max(1, sourceBox.height));
        animationsRef.current.push(source.animate([
          { translate: "0 0", scale: "1", opacity: 1 },
          { offset: 0.52, opacity: 0.9 },
          { offset: 0.76, opacity: 0.08 },
          { translate: `${dx}px ${dy}px`, scale: `${scale}`, opacity: 0 },
        ], { duration: 1250, easing: "cubic-bezier(.2,.76,.18,1)", fill: "forwards" }));
      });

      const finalSentence = stage.querySelector<HTMLElement>(".spotlight-final-sentence");
      if (finalSentence) {
        animationsRef.current.push(finalSentence.animate([
          { opacity: 0, transform: "translateY(.45rem)" },
          { offset: 0.7, opacity: 0, transform: "translateY(.18rem)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 1250, easing: "cubic-bezier(.2,.72,.2,1)", fill: "forwards" }));
      }
      later(1230, () => stage.classList.add("is-morphed"));
    };

    const play = () => {
      clearMotion();
      resetPieces();
      stage.className = "spotlight-page is-sequence";
      placeSpotlight(words[0]!);
      void stage.offsetWidth;
      stage.classList.add("is-fixed-visible");

      later(400, () => stage.classList.add("is-spotlight-visible"));
      later(600, () => { words[0]!.classList.add("is-revealed"); hints[0]!.classList.add("is-visible", "is-amber"); });
      later(1050, () => hints[0]!.classList.remove("is-amber"));
      later(1400, () => placeSpotlight(words[1]!));
      later(1600, () => { words[1]!.classList.add("is-revealed"); hints[1]!.classList.add("is-visible", "is-amber"); });
      later(2050, () => hints[1]!.classList.remove("is-amber"));
      later(2400, () => placeSpotlight(words[2]!));
      later(2600, () => { words[2]!.classList.add("is-revealed"); hints[2]!.classList.add("is-visible", "is-amber"); });
      later(3050, () => hints[2]!.classList.remove("is-amber"));
      later(3400, spreadSpotlight);
      later(3650, () => stage.classList.add("is-group-lit"));
      later(4000, () => { arrival.classList.add("is-revealed"); period.classList.add("is-flashing"); });
      later(4600, () => { hints.forEach((hint) => hint?.classList.remove("is-visible", "is-amber")); stage.classList.add("hints-gone"); });
      later(5000, () => stage.classList.remove("is-spotlight-visible", "is-wide-spotlight", "is-group-lit"));
      later(5500, morphSentence);
      later(6000, () => stage.classList.add("is-payoff"));
      later(7100, () => stage.classList.add("is-cta-visible"));
      later(8100, () => { stage.classList.add("is-complete"); try { window.sessionStorage.setItem(HERO_SEEN_KEY, "1"); } catch { /* Storage is optional. */ } });
    };

    replayRef.current = play;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alreadySeen = false;
    try { alreadySeen = window.sessionStorage.getItem(HERO_SEEN_KEY) === "1"; } catch { /* Storage is optional. */ }
    if (reducedMotion || alreadySeen) showFinal(); else play();
    return () => {
      replayRef.current = () => undefined;
      finishRef.current = () => undefined;
      clearMotion();
    };
  }, []);

  const replayAnimation = () => {
    try { window.sessionStorage.removeItem(HERO_SEEN_KEY); } catch { /* Storage is optional. */ }
    window.scrollTo({ top: 0, behavior: "instant" });
    replayRef.current();
  };

  const skipAnimation = () => {
    finishRef.current();
    try { window.sessionStorage.setItem(HERO_SEEN_KEY, "1"); } catch { /* Storage is optional. */ }
    document.getElementById("spotlight-url")?.focus();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = url.trim();
    if (!value) { setStatus("Bitte geben Sie eine Website-Adresse ein."); return; }
    router.push(`/analyse?url=${encodeURIComponent(value)}`);
  };

  return (
    <div className="spotlight-shell">
      {process.env.NODE_ENV === "development" && (
        <button className="spotlight-replay" type="button" onClick={replayAnimation}>
          ↻ Animation
        </button>
      )}
      <main className="spotlight-page" ref={stageRef}>
        <a className="skip-link" href="#website-pruefen" onClick={skipAnimation}>Direkt zum Textcheck</a>
        <div className="spotlight-inner">
        <nav className="spotlight-nav" aria-label="Hauptnavigation">
          <Link className="spotlight-brand" href="/">satzstrategie.</Link>
          <div className="spotlight-links">
            <Link href="/analyse">Analyse</Link><Link href="/beratung">Leistungen</Link><Link href="/wer-wir-sind">Wer wir sind</Link>
          </div>
          <Link className="spotlight-nav-action" href="/kontakt" aria-label="Gespräch anfragen"><span className="spotlight-contact-full">Gespräch anfragen ↗</span><span className="spotlight-contact-short">Kontakt ↗</span></Link>
          <MobileMenu className="spotlight-mobile-menu" />
          <div className="spotlight-intro-tools"><span>Text, Design & Code</span><button type="button" onClick={skipAnimation}>Zum Textcheck ↓</button></div>
        </nav>

        <section className="spotlight-scene" ref={sceneRef} aria-label="Webseiten werden gefunden, verstanden und gewählt">
          <div className="spotlight-build-group" aria-hidden="true">
            <p className="spotlight-builder" ref={builderRef}><span ref={prefixRef}>Unser Ziel: eine Webseite, die</span></p>
            <div className="spotlight-perception-row" ref={rowRef} aria-label="gefunden, verstanden und gewählt">
              {[["gefunden,", "Google"], ["verstanden,", "Menschen"], ["und gewählt", "KI"]].map(([word, hint], index) => (
                <span className="spotlight-perception-item" key={word}>
                  <span className="spotlight-perception" ref={(node) => { wordRefs.current[index] = node; }}>{word}</span>
                  <span className="spotlight-sub-hint" ref={(node) => { hintRefs.current[index] = node; }}>{hint}</span>
                </span>
              ))}
            </div>
            <p className="spotlight-arrival" ref={arrivalRef}>wird<span className="spotlight-end-period" ref={periodRef}>.</span></p>
          </div>
          <span className="spotlight-spark" aria-hidden="true" /><span className="spotlight-beam" aria-hidden="true" /><span className="spotlight-haze" aria-hidden="true" />
          <div className="spotlight-final-stack">
            <p className="spotlight-final-sentence">
              <span ref={(node) => { targetRefs.current[0] = node; }}><strong className="spotlight-copywriter">Copywriting, Design und Entwicklung.</strong><br />Für eine Webseite, die</span>{" "}
              <span ref={(node) => { targetRefs.current[1] = node; }}>gefunden,</span>{" "}<span ref={(node) => { targetRefs.current[2] = node; }}>verstanden</span>{" "}
              <span ref={(node) => { targetRefs.current[3] = node; }}>und gewählt</span>{" "}<span ref={(node) => { targetRefs.current[4] = node; }}>wird.</span>
            </p>
            <h1 className="spotlight-hook">Wir sehen, was andere übersehen<span>.</span></h1>
            <section className="spotlight-form-area" id="website-pruefen" aria-label="Website prüfen oder ein Gespräch anfragen" onFocusCapture={() => { if (!stageRef.current?.classList.contains("is-complete")) skipAnimation(); }}>
              <div className="spotlight-decision-grid">
                <div className="spotlight-check">
                  <form className="spotlight-form" action="/analyse" onSubmit={submit}>
                    <label className="sr-only" htmlFor="spotlight-url">Adresse Ihrer Website</label>
                    <input className="spotlight-url" id="spotlight-url" name="url" type="text" inputMode="url" autoComplete="url" placeholder="https://ihre-website.de" value={url} onChange={(event) => { setUrl(event.target.value); setStatus(""); }} />
                    <button className="spotlight-submit" type="submit">Textcheck starten →</button>
                  </form>
                  <p className="spotlight-microcopy"><span>KI-Textcheck für diese Seite.<br />Ergebnis nach E-Mail-Eingabe.</span><span aria-live="polite">{status}</span></p>
                </div>
                <Link className="spotlight-conversation" href="/kontakt"><span>Ihr Projekt besprechen</span><span aria-hidden="true">↗</span></Link>
              </div>
            </section>
          </div>
        </section>
        </div>
      </main>
      <noscript><style>{`.spotlight-builder,.spotlight-build-group,.spotlight-intro-tools button{display:none!important}.spotlight-final-sentence,.spotlight-hook,.spotlight-form-area,.spotlight-footer{opacity:1!important;transform:none!important}`}</style></noscript>
      <footer className="spotlight-footer">
        <div className="spotlight-footer-inner">
          <div className="spotlight-footer-identity">
            <span className="spotlight-footer-brand">satzstrategie.</span>
          </div>
          <div className="spotlight-footer-meta">
            <nav aria-label="Rechtliche Informationen">
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
            </nav>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
