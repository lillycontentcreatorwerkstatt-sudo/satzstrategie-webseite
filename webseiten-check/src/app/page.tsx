import Image from "next/image";
import Link from "next/link";
import StudioShell from "./components/StudioShell";
import Arrow from "./components/Arrow";
import { pageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site-metadata";
export const metadata = pageMetadata("/", SITE_TITLE, SITE_DESCRIPTION);
export default function Home() {
  return <StudioShell active="/">
    <div className="home-opening">
    <section className="paper-hero" aria-labelledby="home-title">
      <div className="hero-art"><Image src="/images/papierarchitektur.webp" alt="" fill preload sizes="(max-width: 760px) 82vw, 50vw" /></div>
      <h1 id="home-title" className="hero-title"><span>Wörter </span><span>brauchen </span><span>Haltung.</span></h1>
      <div className="hero-bottom"><p>Wir führen Interessierte<br />vom <strong>Suchtreffer</strong> bis zur <strong>Anfrage.</strong></p><Link className="text-link" href="/beratung">Leistungen entdecken <Arrow /></Link></div>
    </section>
    <section className="discipline-band" aria-label="Text, Design und Code"><Link href="/beratung#neue-texte">Text.</Link><Link href="/beratung#design">Design.</Link><Link href="/beratung#entwicklung">Code.</Link></section>
    </div>
  </StudioShell>;
}
