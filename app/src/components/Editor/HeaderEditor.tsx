import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { Camera } from 'lucide-react';
import './HeaderEditor.css';

export function HeaderEditor() {
    const { updateHeader } = useResumeStore();
    const resume = useActiveResume();
    const { header } = resume;

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateHeader({ photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="header-editor">
            <div className="photo-section">
                <div
                    className="photo-preview"
                    style={{ backgroundImage: header.photo ? `url(${header.photo})` : undefined }}
                >
                    {!header.photo && <Camera size={32} />}
                </div>
                <label className="photo-upload btn btn-secondary">
                    <Camera size={16} />
                    Upload Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        hidden
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
