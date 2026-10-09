import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map(path => ({ url: new URL(path, SITE_URL).href }));
}
