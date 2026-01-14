import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Copy, Edit3, Linkedin, ExternalLink, Loader2, AlertCircle, Upload, Mail } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import type { CVFile } from '../../store/resumeStore';
import { useLetterStore } from '../../store/letterStore';
import type { LetterFile } from '../../store/letterStore';
import { scrapeLinkedInProfile, parseLinkedInPDF, checkServerHealth } from '../../utils/linkedinApi';
import { populateResumeLogos } from '../../utils/logoUtils';
import './Dashboard.css';

type DocType = 'cv' | 'letter';
type ActiveTab = 'cvs' | 'letters';

export function Dashboard() {
    const navigate = useNavigate();
    const { cvList, createCV, createCVWithData, deleteCV, duplicateCV, loadCV } = useResumeStore();
    const { letterList, createLetter, deleteLetter, duplicateLetter, loadLetter } = useLetterStore();

    const [activeTab, setActiveTab] = useState<ActiveTab>('cvs');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createDocType, setCreateDocType] = useState<DocType>('cv');
    const [newDocName, setNewDocName] = useState('');
    const [newLinkedInUrl, setNewLinkedInUrl] = useState('');
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        checkServerHealth().then(online => {
            setServerStatus(online ? 'online' : 'offline');
        });
    }, []);

    const handleOpenCV = (id: string) => {
        loadCV(id);
        navigate(`/cv/${id}`);
    };

    const handleOpenLetter = (id: string) => {
        loadLetter(id);
        navigate(`/letter/${id}`);
    };

    const handleCreate = async () => {
        if (!newDocName.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            if (createDocType === 'letter') {
                // Create Letter
                const letterId = createLetter(newDocName.trim());
                setShowCreateModal(false);
                resetModal();
                loadLetter(letterId);
                navigate(`/letter/${letterId}`);
            } else {
                // Create CV (existing logic)
                let cvId: string;

                if (selectedPdf && serverStatus === 'online') {
                    const result = await parseLinkedInPDF(selectedPdf);
                    if (result.success && result.data) {
                        const enrichedData = populateResumeLogos(result.data);
                        cvId = createCVWithData(newDocName.trim(), newLinkedInUrl.trim(), enrichedData);
                    } else {
                        setError(result.error || 'Could not parse LinkedIn PDF');
                        cvId = createCV(newDocName.trim(), newLinkedInUrl.trim());
                    }
                } else if (newLinkedInUrl.trim() && serverStatus === 'online') {
                    const result = await scrapeLinkedInProfile(newLinkedInUrl.trim());
                    if (result.success && result.data) {
                        const enrichedData = populateResumeLogos(result.data);
                        cvId = createCVWithData(newDocName.trim(), newLinkedInUrl.trim(), enrichedData);
                    } else {
                        setError(result.error || 'Could not scrape LinkedIn profile');
                        cvId = createCV(newDocName.trim(), newLinkedInUrl.trim());
                    }
                } else {
                    cvId = createCV(newDocName.trim(), newLinkedInUrl.trim() || undefined);
                }

                setShowCreateModal(false);
                resetModal();
                loadCV(cvId);
                navigate(`/cv/${cvId}`);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetModal = () => {
        setNewDocName('');
        setNewLinkedInUrl('');
        setSelectedPdf(null);
        setError(null);
        setCreateDocType('cv');
    };

    const handleDuplicateCV = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateCV(id);
    };

    const handleDeleteCV = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (cvList.length === 1) {
            alert('Letzten CV kann nicht gelöscht werden');
            return;
        }
        if (confirm('Diesen CV wirklich löschen?')) {
            deleteCV(id);
        }
    };

    const handleDuplicateLetter = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateLetter(id);
    };

    const handleDeleteLetter = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Dieses Anschreiben wirklich löschen?')) {
            deleteLetter(id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedPdf(file);
            if (!newDocName) {
                setNewDocName(file.name.replace('.pdf', '') + ' (Imported)');
            }
        }
    };

    const openCreateModal = (docType: DocType) => {
        setCreateDocType(docType);
        setShowCreateModal(true);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Dokumente</h1>
                    <p className="subtitle">CVs und Anschreiben verwalten</p>
                </div>
                <div className="create-buttons">
                    <button className="btn btn-secondary" onClick={() => openCreateModal('letter')}>
                        <Mail size={18} />
                        Anschreiben
                    </button>
                    <button className="btn btn-primary create-btn" onClick={() => openCreateModal('cv')}>
                        <Plus size={18} />
                        CV erstellen
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'cvs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cvs')}
                >
                    <FileText size={16} />
                    CVs ({cvList.length})
                </button>
                <button
                    className={`tab ${activeTab === 'letters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('letters')}
                >
                    <Mail size={16} />
                    Anschreiben ({letterList.length})
                </button>
            </div>

            <main className="cv-grid">
                {activeTab === 'cvs' && cvList.map((cv: CVFile) => (
                    <div key={cv.id} className="cv-card" onClick={() => handleOpenCV(cv.id)}>
                        <div className="cv-card-preview">
                            <FileText size={48} />
                        </div>
                        <div className="cv-card-content">
                            <h3 className="cv-name">{cv.name}</h3>
                            {cv.linkedInUrl && (
                                <a
                                    href={cv.linkedInUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="linkedin-link"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Linkedin size={14} />
                                    LinkedIn
                                    <ExternalLink size={12} />
                                </a>
                            )}
                            <div className="cv-meta">
                                <span>Erstellt: {formatDate(cv.createdAt)}</span>
                                <span>Geändert: {formatDate(cv.updatedAt)}</span>
                            </div>
                        </div>
                        <div className="cv-card-actions">
                            <button className="action-btn" onClick={(e) => handleDuplicateCV(cv.id, e)} title="Duplizieren">
                                <Copy size={16} />
                            </button>
                            <button className="action-btn edit" onClick={() => handleOpenCV(cv.id)} title="Bearbeiten">
                                <Edit3 size={16} />
                            </button>
                            <button className="action-btn delete" onClick={(e) => handleDeleteCV(cv.id, e)} title="Löschen">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {activeTab === 'letters' && letterList.map((letter: LetterFile) => (
                    <div key={letter.id} className="cv-card letter-card" onClick={() => handleOpenLetter(letter.id)}>
                        <div className="cv-card-preview letter-preview">
                            <Mail size={48} />
                        </div>
                        <div className="cv-card-content">
                            <h3 className="cv-name">{letter.name}</h3>
                            <div className="cv-meta">
                                <span>Erstellt: {formatDate(letter.createdAt)}</span>
                                <span>Geändert: {formatDate(letter.updatedAt)}</span>
                            </div>
                        </div>
                        <div className="cv-card-actions">
                            <button className="action-btn" onClick={(e) => handleDuplicateLetter(letter.id, e)} title="Duplizieren">
                                <Copy size={16} />
                            </button>
                            <button className="action-btn edit" onClick={() => handleOpenLetter(letter.id)} title="Bearbeiten">
                                <Edit3 size={16} />
                            </button>
                            <button className="action-btn delete" onClick={(e) => handleDeleteLetter(letter.id, e)} title="Löschen">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {activeTab === 'letters' && letterList.length === 0 && (
                    <div className="empty-state">
                        <Mail size={48} />
                        <h3>Noch keine Anschreiben</h3>
                        <p>Erstellen Sie Ihr erstes Anschreiben</p>
                        <button className="btn btn-primary" onClick={() => openCreateModal('letter')}>
                            <Plus size={16} />
                            Anschreiben erstellen
                        </button>
                    </div>
                )}
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => !isLoading && setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{createDocType === 'cv' ? 'Neuen CV erstellen' : 'Neues Anschreiben erstellen'}</h2>

                        {/* Doc Type Selector */}
                        <div className="doc-type-selector">
                            <button
                                className={`doc-type-btn ${createDocType === 'cv' ? 'active' : ''}`}
                                onClick={() => setCreateDocType('cv')}
                            >
                                <FileText size={20} />
                                CV
                            </button>
                            <button
                                className={`doc-type-btn ${createDocType === 'letter' ? 'active' : ''}`}
                                onClick={() => setCreateDocType('letter')}
                            >
                                <Mail size={20} />
                                Anschreiben
                            </button>
                        </div>

                        {error && (
                            <div className="error-banner">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>{createDocType === 'cv' ? 'CV Name' : 'Anschreiben Name'} *</label>
                            <input
                                type="text"
                                value={newDocName}
                                onChange={(e) => setNewDocName(e.target.value)}
                                placeholder={createDocType === 'cv' ? 'z.B. Mein Lebenslauf' : 'z.B. Bewerbung SAP'}
                                autoFocus
                                disabled={isLoading}
                            />
                        </div>

                        {/* CV-specific options */}
                        {createDocType === 'cv' && (
                            <div className="import-options">
                                <div className="form-group">
                                    <label>
                                        <Upload size={16} />
                                        LinkedIn PDF (Empfohlen)
                                    </label>
                                    <div className="file-upload-row">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={onFileChange}
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            className="btn btn-secondary btn-full"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isLoading}
                                        >
                                            <Upload size={14} />
                                            {selectedPdf ? selectedPdf.name : 'LinkedIn PDF wählen...'}
                                        </button>
                                    </div>
                                    <p className="form-hint">
                                        Exportieren Sie Ihr LinkedIn-Profil als PDF und laden Sie es hier hoch.
                                    </p>
                                </div>

                                <div className="divider"><span>ODER</span></div>

                                <div className="form-group">
                                    <label>
                                        <Linkedin size={16} />
                                        LinkedIn Profil URL
                                        {serverStatus === 'online' && (
                                            <span className="server-status online">● Online</span>
                                        )}
                                        {serverStatus === 'offline' && (
                                            <span className="server-status offline">● Offline</span>
                                        )}
                                    </label>
                                    <input
                                        type="url"
                                        value={newLinkedInUrl}
                                        onChange={(e) => setNewLinkedInUrl(e.target.value)}
                                        placeholder="https://www.linkedin.com/in/yourprofile/"
                                        disabled={isLoading || !!selectedPdf}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setShowCreateModal(false); resetModal(); }}
                                disabled={isLoading}
                            >
                                Abbrechen
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreate}
                                disabled={!newDocName.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="spin" />
                                        Erstelle...
                                    </>
                                ) : (
                                    createDocType === 'cv' ? 'CV erstellen' : 'Anschreiben erstellen'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
