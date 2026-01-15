import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, RotateCcw, Loader2, ArrowLeft } from 'lucide-react';
import { LetterEditorLayout } from '../components/LetterEditor';
import { LetterPreview } from '../components/LetterPreview';
import { useLetterStore, useActiveLetter } from '../store/letterStore';
import { generatePDF } from '../utils/pdfGenerator';
import { SaveIndicator } from '../components/common/SaveIndicator';
import '../App.css';

import { useCloudSync } from '../hooks/useCloudSync';

export function LetterApp() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const letterRef = useRef<HTMLDivElement>(null);
    const { letterList, loadLetter, resetCurrentLetter } = useLetterStore();
    const letter = useActiveLetter();
    const { flushPendingSaves, isLoading } = useCloudSync();
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isLoading) return; // Wait for cloud sync

        if (id) {
            const letterExists = letterList.some(l => l.id === id);
            if (letterExists) {
                loadLetter(id);
            } else {
                navigate('/dashboard');
            }
        }
    }, [id, letterList, loadLetter, navigate, isLoading]);

    // Flush pending saves on unmount
    useEffect(() => {
        return () => {
            flushPendingSaves();
        };
    }, [flushPendingSaves]);

    const currentLetter = letterList.find(l => l.id === id);

    const handleBack = () => {
        flushPendingSaves();
        navigate('/dashboard');
    };

    const handleExportPDF = async () => {
        if (!letterRef.current) return;

        setIsGenerating(true);
        try {
            const pagesContainer = letterRef.current.querySelector('.pages-container') as HTMLElement;
            if (pagesContainer) {
                const filename = `${letter.sender.name.replace(/\s+/g, '_') || 'Anschreiben'}_${letter.recipient.company.replace(/\s+/g, '_') || 'Brief'}.pdf`;
                await generatePDF(pagesContainer, filename);
            }
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('PDF-Generierung fehlgeschlagen. Bitte erneut versuchen.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (!currentLetter) {
        return null;
    }

    return (
        <div className="app">
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="btn btn-ghost" onClick={handleBack}>
                        <ArrowLeft size={16} />
                        Zurück
                    </button>
                    <div className="navbar-brand">
                        <h1>{currentLetter.name}</h1>
                    </div>
                    <SaveIndicator watchData={letter} />
                </div>
                <div className="navbar-actions">
                    <button className="btn btn-ghost" onClick={resetCurrentLetter}>
                        <RotateCcw size={16} />
                        Zurücksetzen
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleExportPDF}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="spin" />
                                Generiere...
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                PDF Export
                            </>
                        )}
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <div className="editor-pane">
                    <LetterEditorLayout />
                </div>
                <div className="preview-pane">
                    <LetterPreview ref={letterRef} />
                </div>
            </main>
        </div>
    );
}
