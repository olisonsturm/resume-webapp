import { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Phone, Mail, Globe, Briefcase } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { profile, updateProfile, fetchProfile } = useProfileStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

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
            if (!profile) {
                fetchProfile();
            } else {
                setFormData({
                    full_name: profile.full_name || '',
                    job_title: profile.job_title || '',
                    email: profile.email || user?.email || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    location: profile.location || '',
                    website: profile.website || '',
                });
            }
        }
    }, [isOpen, profile, user, fetchProfile]);

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <User className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Profil bearbeiten</h2>
                            <p className="text-sm text-slate-400">Diese Daten werden für neue Dokumente verwendet</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 transition-colors hover:text-white hover:bg-slate-800 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                <User size={16} /> Persönliche Daten
                            </h3>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Vollständiger Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Max Mustermann"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Aktueller Job-Titel</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input
                                        type="text"
                                        value={formData.job_title}
                                        onChange={e => setFormData({ ...formData, job_title: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Software Engineer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                <Phone size={16} /> Kontakt
                            </h3>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">E-Mail</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Telefon</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="+49 123 4567890"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location & Web */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                <MapPin size={16} /> Adresse & Web
                            </h3>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Straße & Hausnummer</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Musterstraße 1"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">PLZ & Ort</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                    placeholder="12345 Musterstadt"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-medium text-slate-400">Website / LinkedIn</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
