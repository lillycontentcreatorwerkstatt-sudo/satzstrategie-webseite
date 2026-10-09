import type { Metadata, Viewport } from "next";
import { isIndexableDeployment, organizationData, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site-metadata";
import "@fontsource/anton/latin-400.css";
import "@fontsource/libre-caslon-text/latin-400.css";
import "@fontsource/libre-caslon-text/latin-400-italic.css";
import "@fontsource/libre-caslon-text/latin-700.css";
import "./globals.css";
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f5f3ee" };
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s" },
  description: SITE_DESCRIPTION,
  robots: { index: isIndexableDeployment(), follow: isIndexableDeployment() },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData).replace(/</g, "\\u003c") }} />
    {children}
  </body></html>;
}
