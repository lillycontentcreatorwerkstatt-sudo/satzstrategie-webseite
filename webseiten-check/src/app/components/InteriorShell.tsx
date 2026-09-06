import type { ReactNode } from "react";
import StudioShell from "./StudioShell";

export default function InteriorShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <StudioShell active="">
        <section className="studio-hero studio-legal-intro">
          <p className="studio-label">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="studio-lead">{intro}</p>
        </section>
        {children}
    </StudioShell>
  );
}
