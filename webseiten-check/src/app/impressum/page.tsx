import type { Metadata } from "next";
import InteriorShell from "@/app/components/InteriorShell";
import { readLegacyLegalContent } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Impressum — Satzstrategie", description: "Anbieterkennzeichnung und Kontaktdaten von Satzstrategie." };

export default function ImpressumPage() {
  const content = readLegacyLegalContent("impressum.html", ".legal-content");
  return (
    <InteriorShell eyebrow="Rechtliches" title="Impressum." intro="Anbieterkennzeichnung und Kontaktdaten von Satzstrategie.">
      <article className="legal-document legal-document-short" dangerouslySetInnerHTML={{ __html: content }} />
    </InteriorShell>
  );
}
