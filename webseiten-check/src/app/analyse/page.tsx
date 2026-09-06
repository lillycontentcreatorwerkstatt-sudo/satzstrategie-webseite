import AnalysisExperience from "@/app/components/AnalysisExperience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webseitenanalyse — Satzstrategie",
  description: "Was vermittelt Ihre Webseite? Eine KI-gestützte Ersteinschätzung zu Texten, Verständlichkeit und möglichen Barrieren mit konkreten Textvorschlägen.",
};

export default async function AnalysePage({ searchParams }: PageProps<"/analyse">) {
  const query = await searchParams;
  const url = typeof query.url === "string" ? query.url : "";
  return <AnalysisExperience initialUrl={url} />;
}
