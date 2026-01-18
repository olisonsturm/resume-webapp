import { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Phone, Mail, Globe, LayoutTemplate, Loader2 } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import './ProfileModal.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { profile, updateProfile } = useProfileStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        job_title: '',
        email: '',
        phone: '',
        address: '',
        location: '',
        website: '',
    });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Sync form data with profile when modal opens
            setFormData({
                full_name: profile?.full_name || '',
                job_title: profile?.job_title || '',
                email: profile?.email || user?.email || '',
                phone: profile?.phone || '',
                address: profile?.address || '',
                location: profile?.location || '',
                website: profile?.website || '',
            });
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save profile', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`profile-modal-overlay ${isOpen ? 'open' : 'closed'}`}>
            {/* Backdrop */}
            <div className="profile-modal-backdrop" onClick={onClose} />

            {/* Side Sheet */}
            <div className="profile-modal-sheet">
                {/* Header */}
                <div className="profile-modal-header">
                    <div>
                        <h2>Profil bearbeiten</h2>
                        <p>Ihre persönlichen Daten für Dokumente</p>
                    </div>
                    <button onClick={onClose} className="profile-modal-close">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="profile-modal-content">
                    <form id="profile-form" onSubmit={handleSubmit} className="profile-modal-form">

                        {/* Section: Identity */}
                        <div className="profile-modal-section">
                            <h3>
                                <User size={16} />
                                Identität
                            </h3>
                            <div className="profile-modal-fields">
                                <div className="profile-modal-field">
                                    <label>Vollständiger Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Max Mustermann"
                                    />
                                </div>
                                <div className="profile-modal-field">
                                    <label>Job Titel</label>
                                    <div className="input-with-icon">
                                        <LayoutTemplate size={18} />
                                        <input
                                            type="text"
                                            value={formData.job_title}
                                            onChange={e => setFormData({ ...formData, job_title: e.target.value })}
                                            placeholder="Senior Marketing Manager"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Contact */}
                        <div className="profile-modal-section">
                            <h3>
                                <Phone size={16} />
                                Kontakt
                            </h3>
                            <div className="profile-modal-fields">
                                <div className="profile-modal-field">
                                    <label>E-Mail Adresse</label>
                                    <div className="input-with-icon">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="email@beispiel.de"
                                        />
                                    </div>
                                </div>
                                <div className="profile-modal-field">
                                    <label>Telefonnummer</label>
                                    <div className="input-with-icon">
                                        <Phone size={18} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+49 151 12345678"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Location & Details */}
                        <div className="profile-modal-section">
                            <h3>
                                <MapPin size={16} />
                                Standort & Links
                            </h3>
                            <div className="profile-modal-fields">
                                <div className="profile-modal-grid">
                                    <div className="profile-modal-field">
                                        <label>Straße & Nr.</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Musterstraße 42"
                                        />
                                    </div>
                                    <div className="profile-modal-field">
                                        <label>PLZ & Ort</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="10115 Berlin"
                                        />
                                    </div>
                                </div>
                                <div className="profile-modal-field">
                                    <label>Website / LinkedIn</label>
                                    <div className="input-with-icon">
                                        <Globe size={18} />
                                        <input
                                            type="text"
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="linkedin.com/in/name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="profile-modal-footer">
                    <button
                        type="button"
                        onClick={onClose}
                        className="profile-modal-btn-cancel"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        form="profile-form"
                        disabled={loading}
                        className="profile-modal-btn-save"
                    >
                        {loading ? (
                            <Loader2 size={18} className="spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                Änderungen speichern
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
