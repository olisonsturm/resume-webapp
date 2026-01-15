import { useState } from 'react';
import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { useAuthStore } from '../../store/authStore';
import { uploadImage, fileToDataUrl } from '../../lib/storage';
import { Camera, Loader2 } from 'lucide-react';
import './HeaderEditor.css';

export function HeaderEditor() {
    const { updateHeader } = useResumeStore();
    const resume = useActiveResume();
    const { header } = resume;
    const { user } = useAuthStore();
    const [uploading, setUploading] = useState(false);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            // Try to upload to Supabase if user is logged in
            if (user) {
                const url = await uploadImage(file, user.id, 'photos');
                if (url) {
                    updateHeader({ photo: url });
                    setUploading(false);
                    return;
                }
            }

            // Fallback to base64 data URL
            const dataUrl = await fileToDataUrl(file);
            updateHeader({ photo: dataUrl });
        } catch (error) {
            console.error('Error uploading photo:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="header-editor">
            <div className="photo-section">
                <div
                    className="photo-preview"
                    style={{ backgroundImage: header.photo ? `url(${header.photo})` : undefined }}
                >
                    {!header.photo && !uploading && <Camera size={32} />}
                    {uploading && <Loader2 size={32} className="spin" />}
                </div>
                <label className={`photo-upload btn btn-secondary ${uploading ? 'disabled' : ''}`}>
                    {uploading ? (
                        <>
                            <Loader2 size={16} className="spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Camera size={16} />
                            Upload Photo
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        hidden
                        disabled={uploading}
                    />
                </label>
            </div>

            <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    value={header.name}
                    onChange={(e) => updateHeader({ name: e.target.value })}
                    placeholder="Your full name"
                />
            </div>

            <div className="form-group">
                <label>Job Title</label>
                <input
                    type="text"
                    value={header.title}
                    onChange={(e) => updateHeader({ title: e.target.value })}
                    placeholder="e.g. Technology Consulting"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        value={header.phone}
                        onChange={(e) => updateHeader({ phone: e.target.value })}
                        placeholder="+49 123 456789"
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={header.email}
                        onChange={(e) => updateHeader({ email: e.target.value })}
                        placeholder="your@email.com"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        value={header.location}
                        onChange={(e) => updateHeader({ location: e.target.value })}
                        placeholder="City, Country"
                    />
                </div>
                <div className="form-group">
                    <label>LinkedIn / Portfolio</label>
                    <input
                        type="text"
                        value={header.link}
                        onChange={(e) => updateHeader({ link: e.target.value })}
                        placeholder="linkedin.com/in/yourname"
                    />
                </div>
            </div>
        </div>
    );
}
