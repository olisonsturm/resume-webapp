import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

export function Datenschutz() {
    return (
        <div className="legal-page">
            <div className="legal-content">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Zurück zur Startseite
                </Link>

                <h1>Datenschutzerklärung</h1>

                <h2>1. Datenschutz auf einen Blick</h2>
                <h3>Allgemeine Hinweise</h3>
                <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                    Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>

                <h3>Datenerfassung auf dieser Website</h3>
                <p>
                    <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>
                <p>
                    <strong>Wie erfassen wir Ihre Daten?</strong><br />
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben oder bei der Erstellung eines CVs angeben.
                </p>
                <p>
                    Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                    Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                </p>
                <p>
                    <strong>Wofür nutzen wir Ihre Daten?</strong><br />
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                    Ihre eingegebenen Daten (CV, Anschreiben) werden ausschließlich zur Bereitstellung der Funktionalität dieser Anwendung gespeichert.
                </p>

                <h2>2. Hosting</h2>
                <h3>Vercel</h3>
                <p>
                    Wir hosten unsere Website bei Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
                    Der Anbieter ist zertifiziert nach dem EU-US Data Privacy Framework und dem Swiss-US Data Privacy Framework.
                </p>

                <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
                <h3>Datenschutz</h3>
                <p>
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>

                <h3>Hinweis zur verantwortlichen Stelle</h3>
                <p>
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist im Impressum zu finden.
                </p>

                <h2>4. Datenerfassung auf dieser Website</h2>
                <h3>Registrierung auf dieser Website</h3>
                <p>
                    Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen auf der Seite zu nutzen (Authentifizierung via Supabase).
                    Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben.
                    Die bei der Registrierung abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden wir die Registrierung ablehnen.
                </p>
                <p>
                    Für die Authentifizierung nutzen wir Supabase (Supabase Inc., 970 Toa Payoh North #07-04, Singapore 319000).
                </p>

                <h3>Speicherdauer</h3>
                <p>
                    Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
                    Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.
                </p>
            </div>
        </div>
    );
}
