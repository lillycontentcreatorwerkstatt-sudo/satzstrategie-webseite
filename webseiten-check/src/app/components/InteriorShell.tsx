import type { ReactNode } from "react";
import StudioShell from "./StudioShell";
export default function InteriorShell({ title, intro, children }: { eyebrow?: string; title: string; intro: string; children: ReactNode }) {
  return <StudioShell active=""><div className="legal-wrap"><section className="legal-intro"><h1>{title}</h1><p>{intro}</p></section>{children}</div></StudioShell>;
}
