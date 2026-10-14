import Link from 'next/link';
import { pageMetadata } from '@/lib/site-metadata';
import StudioShell, { StudioNext } from '../components/StudioShell';
import WorkExamples from './work-examples';
import './referenzen.css';

export const metadata = pageMetadata('/beispiele', 'Beispiele: Texte, Gestaltung und Bedienung | Satzstrategie', 'An eigenen Arbeitsbeispielen sehen Sie, wie Satzstrategie Texte, Gestaltung, Formulare und die Zugänglichkeit von Webseiten verbessert.');

export default function ReferencesPage() {
  return <StudioShell active="/beispiele" flowFooter>
    <div className="work-page">
      <header className="work-intro">
        <h1>Beispiele.</h1>
        <div className="work-intro-copy"><p className="work-lead">Typische Situationen<br />und wie wir sie überarbeiten.</p><p>Eigene Arbeitsbeispiele aus Text, Design und Entwicklung. Dazu zeigen wir, wie Seiten besser lesbar und leichter bedienbar werden. Sie sehen Vorher und Nachher im direkten Vergleich – ohne Umschalten.</p></div>
        <nav id="beispielauswahl" tabIndex={-1} className="work-index" aria-label="Bereiche der Beispiele"><a href="#text">Text</a><a href="#design">Design</a><a href="#code">Technik</a><a href="#zugang">Bedienung</a></nav>
      </header>
      <WorkExamples />
      <aside className="work-method"><h2>Vom Beispiel<br />zu Ihrer Seite.</h2><div><p>Die Beispiele zeigen einzelne Entscheidungen. Was Ihre Webseite braucht, sehen wir uns im Zusammenhang an: die Texte, die Gestaltung und die Bedienung.</p><p>Die Beispiele zur Lesbarkeit und Bedienung orientieren sich an internationalen Regeln für zugängliche Webseiten, kurz WCAG. Dazu gehören die Erläuterungen zu <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">Textkontrast</a>, <a href="https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html">Fehlermeldungen</a> und <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html">sichtbarem Tastaturfokus</a>.</p><Link href="/leistungen">Unsere Leistungen ansehen</Link></div></aside>
      <StudioNext href="/kontakt" label="Schreiben Sie uns, was Sie verändern möchten." actionLabel="Projekt anfragen">Wo hakt es<br />auf Ihrer Seite?</StudioNext>
    </div>
  </StudioShell>;
}
