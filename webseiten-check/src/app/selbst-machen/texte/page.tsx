import StudioShell from "../../components/StudioShell";
import FloskelLesson from "../../components/FloskelLesson";
import { pageMetadata } from "@/lib/site-metadata";
import "../selbst-machen.css";
import "./texte.css";
export const metadata = pageMetadata("/selbst-machen/texte", "Floskeln erkennen und ersetzen: kostenlose Übung | Satzstrategie", "Kostenlose Übung ohne Anmeldung: Floskeln auf der eigenen Webseite erkennen, einen besseren Satz schreiben und mit Claude weiterarbeiten. Schritt 2 von 10 aus „Selbst machen“.");

export default function TextePage() {
  return <StudioShell active="/selbst-machen" flowFooter>
    <FloskelLesson />
  </StudioShell>;
}
