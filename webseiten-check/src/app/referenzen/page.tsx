import Link from 'next/link';
import { pageMetadata } from '@/lib/site-metadata';
import StudioShell, { StudioNext } from '../components/StudioShell';
import WorkExamples from './work-examples';
import './referenzen.css';

export const metadata = pageMetadata('/referenzen', 'Beispiele: Text, Design, Code und Zugang | Satzstrategie', 'Typische Situationen. Eigene Arbeitsbeispiele zeigen, wie Satzstrategie Texte, Gestaltung, Formulare und die Zugänglichkeit von Webseiten verbessert.');

export default function ReferencesPage() {
  return <StudioShell active="/referenzen" flowFooter>
    <div className="work-page">
      <header className="work-intro">
        <h1>Beispiele.</h1>
        <div className="work-intro-copy"><p className="work-lead">Typische Situationen.<br />So überarbeiten wir sie.</p><p>Eigene Arbeitsbeispiele aus Text, Design und Entwicklung. Dazu zeigen wir, wie Seiten besser lesbar und leichter bedienbar werden. Sehen Sie, was wir ändern, und probieren Sie aus, warum.</p></div>
        <nav className="work-index" aria-label="Bereiche der Beispiele"><a href="#text">Text.</a><a href="#design">Design.</a><a href="#code">Code.</a><a href="#zugang">Zugang.</a></nav>
      </header>
      <WorkExamples />
      <aside className="work-method"><h2>Vom Beispiel<br />zu Ihrer Seite.</h2><div><p>Die Beispiele zeigen einzelne Entscheidungen. Was Ihre Webseite braucht, sehen wir uns im Zusammenhang an: die Texte, die Gestaltung und die Bedienung.</p><p>Die Beispiele zeigen einzelne Verbesserungen, keine vollständige Prüfung. Grundlage sind internationale Regeln für zugängliche Webseiten, kurz WCAG. Dazu gehören die Erläuterungen zu <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">Textkontrast</a>, <a href="https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html">Fehlermeldungen</a> und <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html">sichtbarem Tastaturfokus</a>.</p><Link href="/beratung">Unsere Leistungen ansehen</Link></div></aside>
      <StudioNext href="/erster-blick" label="Lilly schaut persönlich drauf. Auf Wunsch erhalten Sie ein bis zwei konkrete Hinweise kostenlos per E-Mail." actionLabel="Kostenlose Ersteinschätzung anfragen">Wo hakt es<br />auf Ihrer Seite?</StudioNext>
    </div>
  </StudioShell>;
}
