import { useLetterStore, useActiveLetter } from '../../store/letterStore';
import './SenderEditor.css';

export function SenderEditor() {
    const { updateSender, updateLetterType } = useLetterStore();
    const letter = useActiveLetter();
    const { sender, letterType } = letter;

    return (
        <div className="sender-editor">
            {/* Letter Type Toggle */}
            <div className="form-group">
                <label>Brieftyp</label>
                <div className="letter-type-toggle">
                    <button
                        className={`type-btn ${letterType === 'motivation' ? 'active' : ''}`}
                        onClick={() => updateLetterType('motivation')}
                        type="button"
                    >
                        Motivation
                    </button>
                    <button
                        className={`type-btn ${letterType === 'formal' ? 'active' : ''}`}
                        onClick={() => updateLetterType('formal')}
                        type="button"
                    >
                        Formal
                    </button>
                </div>
                <p className="form-hint">
                    {letterType === 'motivation'
                        ? 'Einfaches Layout ohne Empfängeradresse und Anlagen'
                        : 'Geschäftsbrief mit Empfänger und Anlagen (DIN 5008)'}
                </p>
            </div>

            <div className="form-group">
                <label>Name</label>
                <input
                    type="text"
                    value={sender.name}
                    onChange={(e) => updateSender({ name: e.target.value })}
                    placeholder="Max Mustermann"
                />
            </div>

            <div className="form-group">
                <label>Titel / Position</label>
                <input
                    type="text"
                    value={sender.title || ''}
                    onChange={(e) => updateSender({ title: e.target.value })}
                    placeholder="Software Entwickler"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Telefon</label>
                    <input
                        type="tel"
                        value={sender.phone}
                        onChange={(e) => updateSender({ phone: e.target.value })}
                        placeholder="+49 123 456789"
                    />
                </div>
                <div className="form-group">
                    <label>E-Mail</label>
                    <input
                        type="email"
                        value={sender.email}
                        onChange={(e) => updateSender({ email: e.target.value })}
                        placeholder="max@example.com"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>LinkedIn / Website</label>
                    <input
                        type="text"
                        value={sender.link || ''}
                        onChange={(e) => updateSender({ link: e.target.value })}
                        placeholder="linkedin.com/in/max"
                    />
                </div>
                <div className="form-group">
                    <label>Standort</label>
                    <input
                        type="text"
                        value={sender.location || ''}
                        onChange={(e) => updateSender({ location: e.target.value })}
                        placeholder="Berlin, Germany"
                    />
                </div>
            </div>

            {/* Address only for formal letters */}
            {letterType === 'formal' && (
                <div className="form-group">
                    <label>Adresse</label>
                    <textarea
                        value={sender.address}
                        onChange={(e) => updateSender({ address: e.target.value })}
                        placeholder="Musterstraße 123&#10;12345 Musterstadt"
                        rows={2}
                    />
                </div>
            )}
        </div>
    );
}
