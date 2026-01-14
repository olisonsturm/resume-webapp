import { forwardRef } from 'react';
import { Phone, Mail, MapPin, Link as LinkIcon } from 'lucide-react';
import { useActiveLetter } from '../../store/letterStore';
import './LetterPreview.css';

export const LetterPreview = forwardRef<HTMLDivElement>((_, ref) => {
    const letter = useActiveLetter();
    const { sender, recipient, letterType } = letter;

    // For motivation letters, use a simpler layout without formal business letter structure
    const isMotivation = letterType === 'motivation';

    return (
        <div className="letter-preview-container" ref={ref}>
            <div className="pages-container">
                <div className="letter-page">
                    {/* CV-Style Header */}
                    <header className="letter-header">
                        <div className="header-content">
                            <h1 className="name">{sender.name || 'YOUR NAME'}</h1>
                            {sender.title && <p className="title">{sender.title}</p>}
                            <div className="contact-info">
                                {sender.phone && (
                                    <span className="contact-item">
                                        <Phone size={11} /> {sender.phone}
                                    </span>
                                )}
                                {sender.email && (
                                    <span className="contact-item">
                                        <Mail size={11} /> {sender.email}
                                    </span>
                                )}
                                {sender.link && (
                                    <span className="contact-item">
                                        <LinkIcon size={11} /> {sender.link}
                                    </span>
                                )}
                                {sender.location && (
                                    <span className="contact-item">
                                        <MapPin size={11} /> {sender.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Letter Body */}
                    <div className="letter-content">
                        {/* Formal: Show recipient block */}
                        {!isMotivation && (recipient.name || recipient.company || recipient.address) && (
                            <div className="recipient-block">
                                {recipient.name && <div>{recipient.name}</div>}
                                {recipient.company && <div className="company">{recipient.company}</div>}
                                {recipient.address && (
                                    <div className="address">
                                        {recipient.address.split('\n').map((line, i) => (
                                            <span key={i}>{line}<br /></span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Subject */}
                        {letter.subject && (
                            <h2 className="letter-subject">{letter.subject}</h2>
                        )}

                        {/* Date - on its own line, right aligned */}
                        {letter.date && (
                            <div className="letter-date">{letter.date}</div>
                        )}

                        {/* Greeting */}
                        <div className="letter-greeting">
                            {letter.greeting || 'Sehr geehrte Damen und Herren,'}
                        </div>

                        {/* Body */}
                        <div className="letter-body">
                            {letter.body ? (
                                letter.body.split('\n\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))
                            ) : (
                                <p className="placeholder">Ihr Anschreiben...</p>
                            )}
                        </div>

                        {/* Closing */}
                        <div className="letter-closing">
                            {letter.closing || 'Mit freundlichen Grüßen'}
                        </div>

                        {/* Signature */}
                        <div className="letter-signature">
                            {letter.signatureImage && (
                                <img src={letter.signatureImage} alt="Unterschrift" className="signature-image" />
                            )}
                            <div className="signature-name">{letter.signatureName || sender.name}</div>
                        </div>

                        {/* Attachments - only for formal */}
                        {!isMotivation && letter.attachments.length > 0 && (
                            <div className="letter-attachments">
                                <span className="attachments-label">Anlagen:</span> {letter.attachments.join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

LetterPreview.displayName = 'LetterPreview';
