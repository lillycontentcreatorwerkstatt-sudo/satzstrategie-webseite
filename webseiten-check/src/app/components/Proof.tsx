// Korrekturzeichen der Rotstift-Variante. Rein dekorativ; der Text daneben trägt die Bedeutung.

export function ProofCaret({ className = "proof-caret" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 28 34" aria-hidden="true" focusable="false"><path d="M2 32 L14 3 L26 32" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function ProofStrike() {
  return <svg className="hero-strike" viewBox="0 0 700 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength={1} d="M4 26 C 110 17, 240 31, 360 21 S 570 13, 696 23" /></svg>;
}
