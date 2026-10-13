import Link from "next/link";
import StudioShell from "./components/StudioShell";
export default function NotFound() { return <StudioShell active=""><section className="not-found"><p>404</p><h1>Hier fehlt<br />eine Seite.</h1><Link className="studio-button" href="/">Zur Startseite</Link></section></StudioShell>; }
