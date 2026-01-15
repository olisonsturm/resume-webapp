import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Copy, Loader2, AlertCircle, Upload, Mail, User, LogOut, Cloud, CloudOff, Grid } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import type { CVFile } from '../../store/resumeStore';
import { useLetterStore } from '../../store/letterStore';
import type { LetterFile } from '../../store/letterStore';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { useCloudSync } from '../../hooks/useCloudSync';
import { scrapeLinkedInProfile, parseLinkedInPDF, checkServerHealth } from '../../utils/linkedinApi';
import { populateResumeLogos } from '../../utils/logoUtils';
import { DocumentPreview } from '../../components/DocumentPreview';
import { ProfileModal } from '../../components/ProfileModal';
import type { Resume } from '../../types/resume';
import type { LetterData } from '../../types/letter';
import './Dashboard.css';

type DocType = 'cv' | 'letter';
type ActiveTab = 'all' | 'cvs' | 'letters';

export function Dashboard() {
    const navigate = useNavigate();
    const { cvList, createCV, createCVWithData, deleteCV, duplicateCV, loadCV } = useResumeStore();
    const { letterList, createLetter, createLetterWithData, deleteLetter, duplicateLetter, loadLetter } = useLetterStore();
    const { user, signOut } = useAuthStore();
    const { isCloudEnabled, saveCV, saveLetter, deleteCloudCV, deleteCloudLetter } = useCloudSync();
    const { profile, fetchProfile } = useProfileStore();

    const [activeTab, setActiveTab] = useState<ActiveTab>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createDocType, setCreateDocType] = useState<DocType>('cv');
    const [newDocName, setNewDocName] = useState('');
    const [newLinkedInUrl, setNewLinkedInUrl] = useState('');
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        checkServerHealth().then(online => {
            setServerStatus(online ? 'online' : 'offline');
        });
        fetchProfile();
    }, [fetchProfile]);

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
                let letterId: string;

                // Pre-fill from profile if available
                if (profile) {
                    const freshLetter = useLetterStore.getState().letter; // Get empty defaults
                    const letterData = {
                        ...freshLetter,
                        sender: {
                            ...freshLetter.sender,
                            name: profile.full_name || freshLetter.sender.name,
                            title: profile.job_title || freshLetter.sender.title,
                            email: profile.email || freshLetter.sender.email,
                            phone: profile.phone || freshLetter.sender.phone,
                            address: profile.address || freshLetter.sender.address,
                            location: profile.location || freshLetter.sender.location,
                            link: profile.website || freshLetter.sender.link,
                        }
                    };
                    letterId = createLetterWithData(newDocName.trim(), letterData);
                } else {
                    letterId = createLetter(newDocName.trim());
                }

                // Save to cloud immediately
                const newLetter = useLetterStore.getState().letterList.find(l => l.id === letterId);
                if (newLetter) {
                    saveLetter(newLetter);
                }

                setShowCreateModal(false);
                resetModal();
                loadLetter(letterId);
                navigate(`/letter/${letterId}`);
            } else {
                // Create CV
                let cvId: string;

                if (selectedPdf && serverStatus === 'online') {
                    const result = await parseLinkedInPDF(selectedPdf);
                    if (result.success && result.data) {
                        const enrichedData = populateResumeLogos(result.data);
                        // Merge with profile data if available
                        if (profile) {
                            enrichedData.header = {
                                ...enrichedData.header,
                                name: profile.full_name || enrichedData.header.name,
                                title: profile.job_title || enrichedData.header.title,
                                email: profile.email || enrichedData.header.email,
                                phone: profile.phone || enrichedData.header.phone,
                                location: profile.location || enrichedData.header.location,
                                link: profile.website || enrichedData.header.link,
                            };
                        }
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
                    // Manual creation - Fill from Profile
                    if (profile) {

                        // Better to rely on createCVWithData handling defaults or construct here.
                        // Actually createCV uses emptyResume. Let's create a fresh empty structure + profile data.

                        // We need to get empty resume structure. Accessing it via creating a dummy logic or importing it?
                        // Importing `emptyResume` is not exported from store.
                        // Workaround: We use createCV, then update it immediately? No, that triggers saves.
                        // Better: createCVWithData with merged data.
                        // I will assume createCVWithData handles partial or complete overrides.
                        // Wait, createCVWithData expects full Resume object.

                        // Let's stick to simple createCV for now and then update if profile exists?
                        // Or better: Let's assume createCV creates a blank one, and we can't easily inject without full object.
                        // Let's just use createCV, and if we have profile, we load it and update it.

                        cvId = createCV(newDocName.trim(), newLinkedInUrl.trim() || undefined);

                        if (profile) {
                            const createdCV = useResumeStore.getState().cvList.find(c => c.id === cvId);
                            if (createdCV) {
                                const updatedResume = {
                                    ...createdCV.resume,
                                    header: {
                                        ...createdCV.resume.header,
                                        name: profile.full_name || '',
                                        title: profile.job_title || '',
                                        email: profile.email || '',
                                        phone: profile.phone || '',
                                        location: profile.location || '',
                                        link: profile.website || '',
                                    }
                                };
                                // We need a way to update this CV in the list without being "active" yet or set active then update.
                                // useResumeStore.setState...
                                // Let's just set it as active and the store will sync on next edit?
                                // Actually, let's manually update the object in the store list.
                                useResumeStore.setState(state => ({
                                    cvList: state.cvList.map(c => c.id === cvId ? { ...c, resume: updatedResume } : c)
                                }));
                            }
                        }
                    } else {
                        cvId = createCV(newDocName.trim(), newLinkedInUrl.trim() || undefined);
                    }
                }

                // Save to cloud immediately
                const newCV = useResumeStore.getState().cvList.find(cv => cv.id === cvId);
                if (newCV) {
                    saveCV(newCV);
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
        if (cvList.length === 1 && letterList.length === 0) { // Only protect if it's strictly the last doc? maybe loose restriction
            // Allow deleting last CV if letters exist?
        }

        if (confirm('Diesen CV wirklich löschen?')) {
            deleteCV(id);
            deleteCloudCV(id);
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
            deleteCloudLetter(id);
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

    // Unified list for "All" tab
    const getAllDocuments = () => {
        const cvs = cvList.map(cv => ({ ...cv, type: 'cv' as const }));
        const letters = letterList.map(l => ({ ...l, type: 'letter' as const }));
        return [...cvs, ...letters].sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    };

    const filteredDocs = activeTab === 'all'
        ? getAllDocuments()
        : activeTab === 'cvs'
            ? cvList.map(cv => ({ ...cv, type: 'cv' as const }))
            : letterList.map(l => ({ ...l, type: 'letter' as const }));

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Dokumente</h1>
                    <p className="subtitle">Verwalte deine Karriere-Dokumente</p>
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

                {/* User Menu */}
                <div className="user-menu-container">
                    <button
                        className="user-menu-trigger"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        {isCloudEnabled ? (
                            <Cloud size={16} className="cloud-icon synced" />
                        ) : (
                            <CloudOff size={16} className="cloud-icon offline" />
                        )}
                        <User size={20} />
                        <span className="user-email">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</span>
                    </button>

                    {showUserMenu && (
                        <div className="user-dropdown">
                            <div className="user-dropdown-header">
                                <span className="user-full-email">{user?.email || 'Not logged in'}</span>
                                <span className="cloud-status">
                                    {isCloudEnabled ? '☁️ Cloud Sync Active' : '💾 Local Only'}
                                </span>
                            </div>
                            <button
                                className="dropdown-item"
                                onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                            >
                                <User size={16} />
                                Profil bearbeiten
                            </button>
                            <button
                                className="dropdown-item logout"
                                onClick={() => { signOut(); setShowUserMenu(false); }}
                            >
                                <LogOut size={16} />
                                Abmelden
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* V2 Controls: Tabs & View Toggle */}
            <div className="dashboard-controls">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <Grid size={16} />
                        Alle
                    </button>
                    <button
                        className={`tab ${activeTab === 'cvs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cvs')}
                    >
                        <FileText size={16} />
                        Lebensläufe
                    </button>
                    <button
                        className={`tab ${activeTab === 'letters' ? 'active' : ''}`}
                        onClick={() => setActiveTab('letters')}
                    >
                        <Mail size={16} />
                        Anschreiben
                    </button>
                </div>
            </div>

            <main className="cv-grid">
                {filteredDocs.map((doc) => {
                    const data = doc.type === 'cv' ? (doc as CVFile).resume : (doc as LetterFile).letterData;

                    // Defensive check: if data is somehow missing, skip rendering content logic or provide defaults
                    if (!data) return null;

                    const candidateName = doc.type === 'cv'
                        ? ((data as Resume)?.header?.name)
                        : ((data as LetterData)?.sender?.name);
                    const jobTitle = doc.type === 'cv'
                        ? ((data as Resume)?.header?.title)
                        : ((data as LetterData)?.sender?.title);

                    return (
                        <div
                            key={`${doc.type}-${doc.id}`}
                            className={`cv-card ${doc.type === 'letter' ? 'letter-card' : ''}`}
                            onClick={() => doc.type === 'cv' ? handleOpenCV(doc.id) : handleOpenLetter(doc.id)}
                        >
                            <div className="cv-card-preview-container">
                                <DocumentPreview
                                    type={doc.type}
                                    data={data}
                                    className="scale-preview"
                                />
                                <div className="preview-overlay">
                                    <span className="open-btn">Öffnen</span>
                                </div>
                            </div>

                            <div className="cv-card-content">
                                <div className="doc-type-badge">
                                    {doc.type === 'cv' ? <FileText size={12} /> : <Mail size={12} />}
                                    <span>{doc.type === 'cv' ? 'Lebenslauf' : 'Anschreiben'}</span>
                                </div>

                                <h3 className="cv-name" title={doc.name}>{doc.name}</h3>

                                {(candidateName || jobTitle) && (
                                    <div className="cv-details">
                                        {candidateName && <div className="detail-row user"><User size={12} /> {candidateName}</div>}
                                        {jobTitle && <div className="detail-row title">{jobTitle}</div>}
                                    </div>
                                )}

                                <div className="cv-meta">
                                    <span>Aktualisiert: {formatDate(doc.updatedAt)}</span>
                                </div>
                            </div>

                            <div className="cv-card-actions">
                                <button
                                    className="action-btn"
                                    onClick={(e) => doc.type === 'cv' ? handleDuplicateCV(doc.id, e) : handleDuplicateLetter(doc.id, e)}
                                    title="Duplizieren"
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={(e) => doc.type === 'cv' ? handleDeleteCV(doc.id, e) : handleDeleteLetter(doc.id, e)}
                                    title="Löschen"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filteredDocs.length === 0 && (
                    <div className="empty-state col-span-full">
                        {activeTab === 'letters' ? <Mail size={48} /> : <FileText size={48} />}
                        <h3>Keine Dokumente gefunden</h3>
                        <p>Erstellen Sie jetzt Ihr erstes Dokument für Ihre Bewerbung.</p>
                        <div className="flex gap-4 justify-center mt-4">
                            <button className="btn btn-primary" onClick={() => openCreateModal('cv')}>
                                <Plus size={16} />
                                CV erstellen
                            </button>
                            <button className="btn btn-secondary" onClick={() => openCreateModal('letter')}>
                                <Plus size={16} />
                                Anschreiben
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => !isLoading && setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{createDocType === 'cv' ? 'Neuen CV erstellen' : 'Neues Anschreiben erstellen'}</h2>

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
                            <label>{createDocType === 'cv' ? 'Name des Dokuments' : 'Betreff / Name'} *</label>
                            <input
                                type="text"
                                value={newDocName}
                                onChange={(e) => setNewDocName(e.target.value)}
                                placeholder={createDocType === 'cv' ? 'z.B. Mein Lebenslauf 2024' : 'z.B. Bewerbung bei SAP'}
                                autoFocus
                                disabled={isLoading}
                            />
                        </div>

                        {createDocType === 'cv' && (
                            <div className="import-options">
                                <div className="form-group">
                                    <label>
                                        <Upload size={16} />
                                        LinkedIn PDF Importieren
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
                                            {selectedPdf ? selectedPdf.name : 'PDF auswählen...'}
                                        </button>
                                    </div>
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
                                    'Erstellen'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </div>
    );
}
