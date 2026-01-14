import { useLetterStore, useActiveLetter } from '../../store/letterStore';
import './SenderEditor.css';

export function RecipientEditor() {
    const { updateRecipient } = useLetterStore();
    const letter = useActiveLetter();
    const { recipient, letterType } = letter;

    // Only show for formal letters
    if (letterType !== 'formal') {
        return (
            <div className="recipient-editor">
                <p className="info-text">
                    Empfängeradresse wird nur bei formellen Geschäftsbriefen angezeigt.
                    <br />
                    Wechseln Sie zum "Formal" Brieftyp im Absender-Bereich.
                </p>
            </div>
        );
    }

    return (
        <div className="recipient-editor">
            <div className="form-group">
                <label>Ansprechpartner</label>
                <input
                    type="text"
                    value={recipient.name}
                    onChange={(e) => updateRecipient({ name: e.target.value })}
                    placeholder="Frau Erika Musterfrau"
                />
            </div>

            <div className="form-group">
                <label>Unternehmen</label>
                <input
                    type="text"
                    value={recipient.company}
                    onChange={(e) => updateRecipient({ company: e.target.value })}
                    placeholder="Muster GmbH"
                />
            </div>

            <div className="form-group">
                <label>Adresse</label>
                <textarea
                    value={recipient.address}
                    onChange={(e) => updateRecipient({ address: e.target.value })}
                    placeholder="Firmenstraße 456&#10;67890 Firmenstadt"
                    rows={2}
                />
            </div>
        </div>
    );
}
