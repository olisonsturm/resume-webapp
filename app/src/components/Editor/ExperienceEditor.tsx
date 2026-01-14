import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { Plus, Trash2, GripVertical, Upload, Search } from 'lucide-react';
import { MonthYearPicker } from '../common/MonthYearPicker';
import { getLogoUrl } from '../../utils/logoUtils';
import './ExperienceEditor.css';

export function ExperienceEditor() {
    const { updateExperience, addExperience, removeExperience } = useResumeStore();
    const resume = useActiveResume();
    const { experience } = resume;

    const handleLogoUpload = (expId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateExperience(expId, { logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFetchLogo = (expId: string, companyName: string) => {
        const logoUrl = getLogoUrl(companyName);
        if (logoUrl) {
            updateExperience(expId, { logo: logoUrl });
        }
    };

    const handleCompanyChange = (expId: string, companyName: string) => {
        updateExperience(expId, { workplace: companyName });
        // Auto-fetch logo when company name changes
        if (companyName.length > 2) {
            const logoUrl = getLogoUrl(companyName);
            updateExperience(expId, { logo: logoUrl });
        }
    };

    return (
        <div className="experience-editor">
            {experience.map((exp, index) => (
                <div key={exp.id} className="item-card">
                    <div className="item-card-header">
                        <div className="drag-handle">
                            <GripVertical size={16} />
                            <span className="item-number">#{index + 1}</span>
                        </div>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => removeExperience(exp.id)}
                            title="Remove"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Company Logo Section */}
                    <div className="logo-section">
                        <div
                            className="logo-preview"
                            style={{ backgroundImage: exp.logo ? `url(${exp.logo})` : undefined }}
                        >
                            {!exp.logo && <Upload size={20} />}
                        </div>
                        <div className="logo-actions">
                            <label className="btn btn-secondary btn-sm">
                                <Upload size={14} />
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(exp.id, e)}
                                    hidden
                                />
                            </label>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleFetchLogo(exp.id, exp.workplace)}
                                title="Fetch logo from company name"
                            >
                                <Search size={14} />
                                Auto
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                            placeholder="e.g. Software Engineer"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Company</label>
                            <input
                                type="text"
                                value={exp.workplace}
                                onChange={(e) => handleCompanyChange(exp.id, e.target.value)}
                                placeholder="Company name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <MonthYearPicker
                                value={exp.startDate}
                                onChange={(value) => updateExperience(exp.id, { startDate: value })}
                                placeholder="Select Start Date"
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <MonthYearPicker
                                value={exp.endDate}
                                onChange={(value) => updateExperience(exp.id, { endDate: value })}
                                placeholder="Select End Date"
                                showPresent={true}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                        />
                    </div>
                </div>
            ))}

            <button className="btn btn-secondary add-btn" onClick={addExperience}>
                <Plus size={16} />
                Add Experience
            </button>
        </div>
    );
}
