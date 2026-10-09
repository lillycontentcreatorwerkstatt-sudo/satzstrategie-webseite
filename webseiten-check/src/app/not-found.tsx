import Link from "next/link";
import StudioShell from "./components/StudioShell";
import Arrow from "./components/Arrow";
export default function NotFound() { return <StudioShell active=""><section className="not-found"><p>404</p><h1>Hier fehlt<br />eine Seite.</h1><Link className="text-link" href="/">Zur Startseite <Arrow /></Link></section></StudioShell>; }
