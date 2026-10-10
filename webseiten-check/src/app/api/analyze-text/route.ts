import { analysisReleaseGuard } from "@/lib/analysis-release";
export function POST() { return analysisReleaseGuard(); }
