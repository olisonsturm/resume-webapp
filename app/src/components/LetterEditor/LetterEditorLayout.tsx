import { useState } from 'react';
import { ChevronDown, ChevronRight, User, Building, FileText, PenTool } from 'lucide-react';
import { SenderEditor } from './SenderEditor';
import { RecipientEditor } from './RecipientEditor';
import { LetterContentEditor } from './LetterContentEditor';
import { SignatureEditor } from './SignatureEditor';
import './LetterEditorLayout.css';

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
    component: React.ReactNode;
}

export function LetterEditorLayout() {
    const [openSections, setOpenSections] = useState<string[]>(['sender', 'recipient', 'content']);

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const sections: Section[] = [
        { id: 'sender', title: 'Absender', icon: <User size={18} />, component: <SenderEditor /> },
        { id: 'recipient', title: 'Empfänger', icon: <Building size={18} />, component: <RecipientEditor /> },
        { id: 'content', title: 'Inhalt', icon: <FileText size={18} />, component: <LetterContentEditor /> },
        { id: 'signature', title: 'Unterschrift & Anlagen', icon: <PenTool size={18} />, component: <SignatureEditor /> },
    ];

    return (
        <div className="letter-editor-layout">
            <div className="editor-sections">
                {sections.map(section => (
                    <div key={section.id} className={`editor-section card ${openSections.includes(section.id) ? 'open' : ''}`}>
                        <button
                            className="section-header"
                            onClick={() => toggleSection(section.id)}
                        >
                            <div className="section-title">
                                {section.icon}
                                <h3>{section.title}</h3>
                            </div>
                            {openSections.includes(section.id) ? (
                                <ChevronDown size={18} />
                            ) : (
                                <ChevronRight size={18} />
                            )}
                        </button>
                        {openSections.includes(section.id) && (
                            <div className="section-content">
                                {section.component}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
