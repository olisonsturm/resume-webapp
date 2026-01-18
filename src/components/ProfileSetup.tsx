import { useState, useEffect } from 'react';
import { Save, User, MapPin, Phone, Mail, Globe, LayoutTemplate, Loader2, Sparkles } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import './ProfileSetup.css';

interface ProfileSetupProps {
    onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
    const { profile, updateProfile, isLoading: profileLoading } = useProfileStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Sync form with profile data when it becomes available (no fetchProfile call!)
    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                job_title: profile.job_title || '',
                email: profile.email || user?.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
                location: profile.location || '',
                website: profile.website || '',
            });
        } else if (user?.email) {
            // Pre-fill email from auth if no profile yet
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
    }, [profile, user?.email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.full_name.trim()) {
            setError('Bitte geben Sie Ihren Namen ein');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await updateProfile(formData);
            onComplete();
        } catch (err) {
            console.error('Failed to save profile', err);
            setError('Profil konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    if (profileLoading) {
        return (
            <div className="profile-setup-loading">
                <Loader2 size={40} className="spin" />
            </div>
        );
    }

    return (
        <div className="profile-setup">
            <div className="profile-setup-container">
                {/* Header */}
                <div className="profile-setup-header">
                    <div className="profile-setup-icon">
                        <Sparkles size={32} />
                    </div>
                    <h1>Willkommen bei applyro!</h1>
                    <p>Richten Sie Ihr Profil ein, um loszulegen. Diese Daten werden automatisch in Ihre CVs und Anschreiben übernommen.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="profile-setup-form">
                    {error && (
                        <div className="profile-setup-error">
                            {error}
                        </div>
                    )}

                    {/* Section: Identity */}
                    <div className="form-section">
                        <h3>
                            <User size={16} />
                            Identität
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Vollständiger Name *</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Max Mustermann"
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <LayoutTemplate size={14} />
                                    Job Titel
                                </label>
                                <input
                                    type="text"
                                    value={formData.job_title}
                                    onChange={e => setFormData({ ...formData, job_title: e.target.value })}
                                    placeholder="Senior Marketing Manager"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Contact */}
                    <div className="form-section">
                        <h3>
                            <Phone size={16} />
                            Kontakt
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    <Mail size={14} />
                                    E-Mail Adresse
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@beispiel.de"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <Phone size={14} />
                                    Telefonnummer
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+49 151 12345678"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Location */}
                    <div className="form-section">
                        <h3>
                            <MapPin size={16} />
                            Standort & Links
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Straße & Nr.</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Musterstraße 42"
                                />
                            </div>
                            <div className="form-group">
                                <label>PLZ & Ort</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="10115 Berlin"
                                />
                            </div>
                            <div className="form-group form-group-full">
                                <label>
                                    <Globe size={14} />
                                    Website / LinkedIn
                                </label>
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="linkedin.com/in/name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !formData.full_name.trim()}
                        className="profile-setup-submit"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="spin" />
                                Wird gespeichert...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Profil speichern & loslegen
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
