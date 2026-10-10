// The public automated service was retired on 10 October 2026.
// Configured secrets must not enable analysis or lead collection.
export function isAnalysisAvailable(): boolean { return false; }

export function analysisReleaseGuard(): Response {
  return Response.json(
    { error: "Der automatische Check wird nicht mehr angeboten. Sie können unter /erster-blick eine persönliche Anfrage vorbereiten.", code: "ANALYSIS_RETIRED" },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
