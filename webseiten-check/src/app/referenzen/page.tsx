import Link from 'next/link';
import { pageMetadata } from '@/lib/site-metadata';
import StudioShell, { StudioNext } from '../components/StudioShell';
import WorkExamples from './work-examples';
import './referenzen.css';

export const metadata = pageMetadata('/referenzen', 'Referenzen: Text, Design, Code und Zugang | Satzstrategie', 'Typische Situationen. Eigene Arbeitsbeispiele zeigen, wie Satzstrategie Texte, Gestaltung, Formulare und die Zugänglichkeit von Webseiten verbessert.');

export default function ReferencesPage() {
  return <StudioShell active="/referenzen" flowFooter>
    <div className="work-page">
      <header className="work-intro">
        <h1>Referenzen.</h1>
        <div className="work-intro-copy"><p className="work-lead">Typische Situationen.<br />So überarbeiten wir sie.</p><p>Eigene Arbeitsbeispiele aus Text, Design und Entwicklung – mit Blick auf Barrierefreiheit. Sehen Sie, was wir ändern, und probieren Sie aus, warum.</p></div>
        <nav className="work-index" aria-label="Bereiche der Referenzen"><a href="#text">Text.</a><a href="#design">Design.</a><a href="#code">Code.</a><a href="#zugang">Zugang.</a></nav>
      </header>
      <WorkExamples />
      <aside className="work-method"><h2>Vom Beispiel<br />zu Ihrer Seite.</h2><div><p>Die Beispiele zeigen einzelne Entscheidungen. Was Ihre Webseite braucht, sehen wir uns im Zusammenhang an: die Texte, die Gestaltung und die Bedienung.</p><p>Eine vollständige Prüfung der Barrierefreiheit umfasst weitere Anforderungen. Die Beispiele orientieren sich an den W3C-Erläuterungen zu <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">Textkontrast</a>, <a href="https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html">Fehlermeldungen</a> und <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html">sichtbarem Tastaturfokus</a>.</p><Link href="/beratung">Unsere Leistungen ansehen</Link></div></aside>
      <StudioNext href="/kontakt" label="Schreiben Sie Lilly, was Sie ändern möchten." actionLabel="Über Ihre Webseite sprechen">Wo hakt es<br />auf Ihrer Seite?</StudioNext>
    </div>
  </StudioShell>;
}
