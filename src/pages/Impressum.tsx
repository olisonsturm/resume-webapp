import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

export function Impressum() {
    return (
        <div className="legal-page">
            <div className="legal-content">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Zurück zur Startseite
                </Link>

                <h1>Impressum</h1>

                <h2>Angaben gemäß § 5 TMG</h2>
                <p>
                    Olison Sturm<br />
                    G7 6<br />
                    68159 Mannheim<br />
                    Deutschland
                </p>

                <h2>Kontakt</h2>
                <p>
                    E-Mail: olisonsturm@gmx.de
                </p>

                <h2>Haftung für Inhalte</h2>
                <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                    Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
                    oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p>
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
                    Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                    Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>

                <h2>Urheberrecht</h2>
                <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
                    Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
                    der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten,
                    nicht kommerziellen Gebrauch gestattet.
                </p>
                <p>
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet.
                    Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                    bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                </p>
            </div>
        </div>
    );
}
