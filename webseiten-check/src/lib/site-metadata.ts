import type { Metadata } from "next";

export const SITE_URL = "https://www.satzstrategie.de";
export const SITE_TITLE = "Webseitentexte & Webdesign, die zeigen, was Sie können | Satzstrategie";
export const SITE_DESCRIPTION = "Copywriting, Webdesign und Entwicklung: Lilly und Piet schreiben Ihre Webseitentexte, gestalten und bauen Ihre Webseite. Mit kostenloser Ersteinschätzung.";
export const PUBLIC_ROUTES = ["/", "/leistungen", "/beispiele", "/wer-wir-sind", "/kontakt", "/erster-blick", "/impressum", "/datenschutz"] as const;

// Local and Vercel preview builds must not enter search results.
export function isIndexableDeployment(environment = process.env.VERCEL_ENV): boolean {
  return environment === "production";
}

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, SITE_URL).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: "Satzstrategie", locale: "de_DE", type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Satzstrategie — Endlich gesehen werden. Text, Design, Technik." }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/opengraph-image`] },
  };
}

export const organizationData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Satzstrategie",
      url: SITE_URL,
      email: "kontakt@satzstrategie.de",
      description: SITE_DESCRIPTION,
      logo: `${SITE_URL}/icon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Satzstrategie",
      url: SITE_URL,
      inLanguage: "de-DE",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
