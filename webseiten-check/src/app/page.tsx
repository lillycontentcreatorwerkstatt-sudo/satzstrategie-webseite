import Image from "next/image";
import Link from "next/link";
import StudioShell from "./components/StudioShell";
import ServiceExperience from "./components/ServiceExperience";
import { pageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site-metadata";
export const metadata = pageMetadata("/", SITE_TITLE, SITE_DESCRIPTION);
export default function Home() {
  return <StudioShell active="/" flowFooter>
    <div className="home-opening">
    <section className="paper-hero" aria-labelledby="home-title">
      <div className="hero-art"><Image src="/images/papierarchitektur.webp" alt="" fill preload sizes="(max-width: 760px) 82vw, 50vw" /></div>
      <h1 id="home-title" className="hero-title"><span>Wörter </span><span>brauchen </span><span>Haltung.</span></h1>
      <div className="hero-bottom"><Link className="studio-button hero-action" href="#leistungen">Leistungen entdecken</Link><p>Texte <strong>schreiben und prüfen.</strong><br />Webseiten <strong>gestalten und entwickeln.</strong></p></div>
    </section>
    <section className="discipline-band" aria-label="Text, Design und Code"><Link href="#neue-texte">Text.</Link><Link href="#design">Design.</Link><Link href="#entwicklung">Code.</Link></section>
    </div>
    <a className="home-services-scroll" href="#leistungen">Weiter zu den Leistungen</a>
    <ServiceExperience />
  </StudioShell>;
}
