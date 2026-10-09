import { pageMetadata } from "@/lib/site-metadata";
import InteriorShell from "@/app/components/InteriorShell";
import { readLegacyLegalContent } from "@/lib/legal-content";

export const metadata = pageMetadata("/impressum", "Impressum — Satzstrategie", "Anbieterkennzeichnung und Kontaktdaten von Satzstrategie.");

export default function ImpressumPage() {
  const content = readLegacyLegalContent("impressum.html", ".legal-content");
  return (
    <InteriorShell eyebrow="Rechtliches" title="Impressum." intro="Anbieterkennzeichnung und Kontaktdaten von Satzstrategie.">
      <article className="legal-document legal-document-short" dangerouslySetInnerHTML={{ __html: content }} />
    </InteriorShell>
  );
}
