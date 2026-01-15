import { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Phone, Mail, Globe, LayoutTemplate } from 'lucide-react';
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
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
            return () => clearTimeout(timer);
        }
    }, [isOpen, profile, user, fetchProfile]);

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
        <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Side Sheet */}
            <div
                className={`relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-spring ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Profil bearbeiten</h2>
                        <p className="text-sm text-gray-500 mt-1">Ihre persönlichen Daten für Dokumente</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Section: Identity */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                                <User size={16} className="text-blue-500" />
                                Identität
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Vollständiger Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                                        placeholder="Max Mustermann"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Job Titel</label>
                                    <div className="relative">
                                        <LayoutTemplate size={18} className="absolute left-3 top-2.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.job_title}
                                            onChange={e => setFormData({ ...formData, job_title: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="Senior Marketing Manager"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Contact */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                                <Phone size={16} className="text-blue-500" />
                                Kontakt
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">E-Mail Adresse</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="email@beispiel.de"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Telefonnummer</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-3 top-2.5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="+49 151 12345678"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Location & Details */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                                <MapPin size={16} className="text-blue-500" />
                                Standort & Links
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Straße & Nr.</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="Musterstraße 42"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">PLZ & Ort</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="10115 Berlin"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Website / LinkedIn</label>
                                    <div className="relative">
                                        <Globe size={18} className="absolute left-3 top-2.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                            placeholder="linkedin.com/in/name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white shadow-lg-up z-10 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        form="profile-form"
                        disabled={loading}
                        className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

