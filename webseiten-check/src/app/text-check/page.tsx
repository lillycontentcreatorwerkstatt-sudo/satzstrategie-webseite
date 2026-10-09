import type { Metadata } from "next";
import AnalysisExperience from "@/app/components/AnalysisExperience";

export const metadata: Metadata = {
  title: "Textcheck — Satzstrategie",
  description: "Texte einfügen und konkrete Formulierungsvorschläge erhalten. KI-gestützte Ersteinschätzung, keine Erkennung von KI-Urheberschaft.",
};

export default function TextCheckPage() {
  return <AnalysisExperience textMode />;
}
