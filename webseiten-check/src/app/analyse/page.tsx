import AnalysisExperience from "@/app/components/AnalysisExperience";

export default async function AnalysePage({ searchParams }: PageProps<"/analyse">) {
  const query = await searchParams;
  const url = typeof query.url === "string" ? query.url : "";
  return <AnalysisExperience initialUrl={url} />;
}
