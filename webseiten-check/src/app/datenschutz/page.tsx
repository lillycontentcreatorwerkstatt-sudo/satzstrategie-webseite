import { pageMetadata } from "@/lib/site-metadata";
import InteriorShell from "@/app/components/InteriorShell";

export const metadata = pageMetadata("/datenschutz", "Datenschutz — Satzstrategie", "Informationen zur Verarbeitung personenbezogener Daten bei Satzstrategie.");

export default function DatenschutzPage() {
  return (
    <InteriorShell title="Datenschutz." intro="Welche Daten bei einem Besuch und einer Kontaktaufnahme verarbeitet werden.">
      <article className="legal-document">
        <p>Stand: 27. Oktober 2026. Diese Informationen beziehen sich auf die Webseite von Satzstrategie.</p>

        <h2>Verantwortlich</h2>
        <p>Peter Josef Klein<br />c/o IP-Management #8336<br />Ludwig-Erhard-Straße 18<br />20459 Hamburg</p>
        <p>Bei Fragen zum Datenschutz: <a href="mailto:kontakt@satzstrategie.de">kontakt@satzstrategie.de</a>.</p>

        <h2>Aufruf der Webseite</h2>
        <p>Die Webseite wird über Vercel bereitgestellt. Dabei werden technische Verbindungsdaten verarbeitet, insbesondere Ihre IP-Adresse, die angeforderte Adresse, Zeitpunkt des Zugriffs sowie Angaben zu Browser und Gerät. Das ist erforderlich, um die Seite auszuliefern, Fehler zu erkennen und den Betrieb zu schützen.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist ein sicherer und zuverlässiger Webauftritt. Technische Protokolle werden für die Bereitstellung, Fehlerbehebung und Sicherheit verwendet; ihre Aufbewahrung richtet sich nach dem jeweiligen Zweck und der Konfiguration des Hostingdienstes.</p>
        <p>Anbieter ist Vercel Inc., USA. Eine Verarbeitung außerhalb der EU bzw. des EWR ist möglich. Informationen zu Verarbeitung und Übermittlungsmechanismen finden Sie in der <a href="https://vercel.com/legal/privacy-notice">Datenschutzerklärung von Vercel</a> und dessen <a href="https://vercel.com/legal/dpa">Vereinbarung zur Datenverarbeitung</a>.</p>

        <h2>Schriften, Cookies und externe Inhalte</h2>
        <p>Die Schriften und Bilder werden mit der Webseite ausgeliefert. Beim Laden der Seite werden keine Google Fonts nachgeladen. Wir setzen in dieser Fassung keine Werbepixel, Besuchsstatistik oder eingebetteten Karten und Videos ein. Die Webseite setzt keine Cookies und speichert keine Angaben im lokalen Browser-Speicher.</p>
        <p>Externe Links öffnen die Seite des jeweiligen Anbieters erst, wenn Sie sie aufrufen. Dort gelten dessen Datenschutzhinweise.</p>

        <h2>Kontaktformular</h2>
        <p>Wenn Sie uns über den Kontaktbrief oder die Anfrage zur Ersteinschätzung schreiben, übertragen wir Ihre Angaben nach Ihrem Klick auf „Anfrage senden“ verschlüsselt an unseren Webserver: Ihre E-Mail-Adresse, Ihre Nachricht, Ihre Webadresse und, falls angegeben, Ihren Namen. Der Webserver leitet diese Angaben sofort als E-Mail an unser Postfach weiter. Auf der Webseite selbst werden sie nicht gespeichert; es gibt keine Datenbank und keine Weitergabe an andere Dienste.</p>
        <p>Für die Übertragung verarbeitet unser Hostingdienst Vercel die Angaben kurzzeitig (siehe „Aufruf der Webseite“). Versand und Empfang der E-Mail erfolgen über unser Postfach bei IONOS.</p>

        <h2>Kontakt per E-Mail</h2>
        <p>Sie können uns auch direkt an <a href="mailto:kontakt@satzstrategie.de">kontakt@satzstrategie.de</a> schreiben.</p>
        <p>Wir verarbeiten Ihre Absenderadresse, den Inhalt und freiwillige Angaben, um Ihre Anfrage zu beantworten. Das gilt für Nachrichten über das Kontaktformular und für direkte E-Mails. Bei Anfragen zu einem Auftrag ist Art. 6 Abs. 1 lit. b DSGVO die Rechtsgrundlage; bei anderen Anliegen Art. 6 Abs. 1 lit. f DSGVO mit dem Interesse, die gewünschte Kommunikation zu ermöglichen.</p>
        <p>Unser Postfach liegt bei der IONOS SE, Elgendorfer Straße 57, 56410 Montabaur, Deutschland. IONOS verarbeitet die Nachrichten und die damit verbundenen Daten in unserem Auftrag. Weitere Informationen enthält die <a href="https://www.ionos.de/terms-gtc/datenschutzerklaerung/">Datenschutzerklärung von IONOS</a>. Bitte senden Sie uns keine sensiblen Daten, die für Ihre Anfrage nicht erforderlich sind.</p>
        <p>Eine Kontaktanfrage meldet Sie nicht für einen Newsletter an.</p>

        <h2>Persönliche Ersteinschätzung und Textbeispiele</h2>
        <p>Unter „Erster Blick“ senden Sie uns Ihre Webadresse, das Ziel Ihrer Webseite, Ihre E-Mail-Adresse und optional Ihren Namen. Die Nachricht enthält die Bitte um eine kostenlose kurze Ersteinschätzung. Für die Übertragung gelten die Hinweise zum Kontaktformular.</p>
        <p>Die Webseite führt keinen automatischen KI-Check durch und überträgt diese Eingaben nicht an einen KI-, Newsletter- oder Tabellendienst. Die Textbeispiele sind selbst entwickelt und rufen keine Besucher-Webseite ab. Für Ihre Nachricht gelten die Hinweise zur Kontaktaufnahme per E-Mail.</p>

        <h2>Postanschrift</h2>
        <p>Für den Empfang und die Weiterleitung von Post verwenden wir den im Impressum genannten Dienst Impressum-Privatschutz. Bei postalischer Kontaktaufnahme erhält dieser die zur Bearbeitung erforderlichen Absender- und Sendungsdaten. Die Verarbeitung dient der Erreichbarkeit und Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Weitere Informationen: <a href="https://impressum-privatschutz.de/datenschutzerklaerung/">Datenschutz bei Impressum-Privatschutz</a>.</p>

        <h2>Wie lange Daten gespeichert werden</h2>
        <p>Nachrichten werden so lange aufbewahrt, wie sie für die Bearbeitung der Anfrage erforderlich sind. Kommt ein Auftrag zustande oder bestehen gesetzliche Aufbewahrungspflichten, können die betreffenden Unterlagen länger aufzubewahren sein. Entfällt der Zweck und besteht keine Aufbewahrungspflicht, werden die Angaben gelöscht.</p>

        <h2>Ihre Rechte</h2>
        <p>Unter den gesetzlichen Voraussetzungen haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit (Art. 15 bis 20 DSGVO). Einwilligungen können Sie mit Wirkung für die Zukunft widerrufen.</p>
        <p>Bei einer Verarbeitung auf Grundlage berechtigter Interessen können Sie aus Gründen Ihrer besonderen Situation widersprechen (Art. 21 DSGVO). Gegen Direktwerbung ist ein Widerspruch jederzeit möglich.</p>
        <p>Wenden Sie sich dafür an die oben genannte Adresse. Sie können sich außerdem bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere an Ihrem Wohnort, Arbeitsplatz oder am Ort des vermuteten Verstoßes (Art. 77 DSGVO).</p>
      </article>
    </InteriorShell>
  );
}
