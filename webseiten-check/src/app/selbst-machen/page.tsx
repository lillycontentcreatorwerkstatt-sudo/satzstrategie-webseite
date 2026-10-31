import StudioShell from "../components/StudioShell";
import DiyGuide from "../components/DiyGuide";
import { pageMetadata } from "@/lib/site-metadata";
import "./selbst-machen.css";
export const metadata = pageMetadata("/selbst-machen", "Webseite selbst gestalten und bauen | Satzstrategie", "Lernen Sie Schritt für Schritt, wie Sie mit einer KI Ihre bestehende Webseite verbessern oder eine neue aufbauen. Mit 5-Sekunden-Test zum Ausprobieren. Start am 16. November 2026.");

export default function SelbstMachenPage() {
  return <StudioShell active="/selbst-machen" flowFooter><DiyGuide /></StudioShell>;
}
