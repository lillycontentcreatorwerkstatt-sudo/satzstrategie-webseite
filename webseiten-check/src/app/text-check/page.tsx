import { pageMetadata } from "@/lib/site-metadata";
import { isAnalysisAvailable } from "@/lib/analysis-release";
import AnalysisExperience from "@/app/components/AnalysisExperience";

export const metadata = pageMetadata("/text-check", "Textcheck — Satzstrategie", "Original und Überarbeitung im Vergleich: eine gekennzeichnete Beispielauswertung zeigt, wie wir Texte verständlicher machen.");

export default function TextCheckPage() {
  return <AnalysisExperience available={isAnalysisAvailable()} textMode />;
}
