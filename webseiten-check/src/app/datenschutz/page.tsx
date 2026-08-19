import InteriorShell from "@/app/components/InteriorShell";
import { readLegacyLegalContent } from "@/lib/legal-content";

export default function DatenschutzPage() {
  const content = readLegacyLegalContent("datenschutz.html", ".privacy-content");
  return (
    <InteriorShell eyebrow="Rechtliches" title="Datenschutz." intro="Informationen über die Verarbeitung Ihrer Daten gemäß Art. 13 und Art. 14 der Datenschutz-Grundverordnung.">
      <article className="legal-document" dangerouslySetInnerHTML={{ __html: content }} />
    </InteriorShell>
  );
}
