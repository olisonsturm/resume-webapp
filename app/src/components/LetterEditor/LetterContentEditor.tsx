import { useLetterStore, useActiveLetter } from '../../store/letterStore';
import './SenderEditor.css';

export function LetterContentEditor() {
    const { updateLetterContent } = useLetterStore();
    const letter = useActiveLetter();

    return (
        <div className="content-editor">
            <div className="form-row">
                <div className="form-group">
                    <label>Datum</label>
                    <input
                        type="text"
                        value={letter.date}
                        onChange={(e) => updateLetterContent({ date: e.target.value })}
                        placeholder="14. Januar 2026"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Betreff</label>
                <input
                    type="text"
                    value={letter.subject}
                    onChange={(e) => updateLetterContent({ subject: e.target.value })}
                    placeholder="Bewerbung als Software Entwickler"
                />
            </div>

            <div className="form-group">
                <label>Anrede</label>
                <input
                    type="text"
                    value={letter.greeting}
                    onChange={(e) => updateLetterContent({ greeting: e.target.value })}
                    placeholder="Sehr geehrte Damen und Herren,"
                />
            </div>

            <div className="form-group">
                <label>Inhalt</label>
                <textarea
                    value={letter.body}
                    onChange={(e) => updateLetterContent({ body: e.target.value })}
                    placeholder="Schreiben Sie hier Ihren Anschreibentext..."
                    rows={12}
                />
            </div>

            <div className="form-group">
                <label>Grußformel</label>
                <input
                    type="text"
                    value={letter.closing}
                    onChange={(e) => updateLetterContent({ closing: e.target.value })}
                    placeholder="Mit freundlichen Grüßen"
                />
            </div>
        </div>
    );
}
