// Release lock: remove only with the implemented and verified confirmation flow,
// consent storage, abuse protection and 30-day deletion. Existing secrets alone
// must never activate the legacy email gate in a new deployment.
export const ANALYSIS_RELEASE_READY: boolean = false;

export function isAnalysisAvailable(): boolean {
  return ANALYSIS_RELEASE_READY && Boolean(
    process.env.OPENAI_API_KEY?.trim() && process.env.GOOGLE_SHEET_URL?.trim(),
  );
}

export function analysisReleaseGuard(): Response | null {
  if (ANALYSIS_RELEASE_READY) return null;
  return Response.json(
    { error: "Der KI-Textcheck wird vorbereitet. Bitte nutzen Sie die Beispielauswertung oder kontaktieren Sie uns direkt.", code: "ANALYSIS_NOT_RELEASED" },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
