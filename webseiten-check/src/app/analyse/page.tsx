import AnalysisExperience from "@/app/components/AnalysisExperience";
import { pageMetadata } from "@/lib/site-metadata";
import { isAnalysisAvailable } from "@/lib/analysis-release";

export const metadata = pageMetadata("/analyse", "Webseitenanalyse — Satzstrategie", "Was vermittelt Ihre Webseite? Lernen Sie unseren Textcheck an einer gekennzeichneten Beispielauswertung kennen. Persönliche Beratung auf Anfrage.");

export default async function AnalysePage({ searchParams }: PageProps<"/analyse">) {
  const query = await searchParams;
  const url = typeof query.url === "string" ? query.url : "";
  return <AnalysisExperience available={isAnalysisAvailable()} initialUrl={url} />;
}
