import { Upload } from 'lucide-react';
import { useLetterStore, useActiveLetter } from '../../store/letterStore';
import './SignatureEditor.css';

export function SignatureEditor() {
    const { updateSignature, updateAttachments } = useLetterStore();
    const letter = useActiveLetter();
    const { letterType } = letter;

    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateSignature({ signatureImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const addAttachment = () => {
        const newAttachment = prompt('Name der Anlage eingeben:');
        if (newAttachment?.trim()) {
            updateAttachments([...letter.attachments, newAttachment.trim()]);
        }
    };

    const removeAttachment = (index: number) => {
        const updated = letter.attachments.filter((_, i) => i !== index);
        updateAttachments(updated);
    };

    return (
        <div className="signature-editor">
            <div className="form-group">
                <label>Name (unter der Unterschrift)</label>
                <input
                    type="text"
                    value={letter.signatureName}
                    onChange={(e) => updateSignature({ signatureName: e.target.value })}
                    placeholder="Max Mustermann"
                />
            </div>

            <div className="form-group">
                <label>Unterschrift (optional)</label>
                <div className="signature-upload">
                    {letter.signatureImage ? (
                        <div className="signature-preview">
                            <img src={letter.signatureImage} alt="Unterschrift" />
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => updateSignature({ signatureImage: '' })}
                            >
                                Entfernen
                            </button>
                        </div>
                    ) : (
                        <label className="upload-btn">
                            <Upload size={16} />
                            Unterschrift hochladen
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleSignatureUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Attachments only for formal letters */}
            {letterType === 'formal' && (
                <div className="form-group">
                    <label>Anlagen</label>
                    <div className="attachments-list">
                        {letter.attachments.map((att, index) => (
                            <div key={index} className="attachment-item">
                                <span>{att}</span>
                                <button
                                    className="btn btn-ghost btn-icon btn-sm"
                                    onClick={() => removeAttachment(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button className="btn btn-secondary btn-sm" onClick={addAttachment}>
                            + Anlage hinzufügen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
