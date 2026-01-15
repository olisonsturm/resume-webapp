import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { Plus, Trash2, GripVertical, Upload, Search } from 'lucide-react';
import { MonthYearPicker } from '../common/MonthYearPicker';
import { getLogoUrl } from '../../utils/logoUtils';
import './EducationEditor.css';

export function EducationEditor() {
    const { updateEducation, addEducation, removeEducation } = useResumeStore();
    const resume = useActiveResume();
    const { education } = resume;

    const handleLogoUpload = (eduId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateEducation(eduId, { logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFetchLogo = (eduId: string, institutionName: string) => {
        const logoUrl = getLogoUrl(institutionName);
        if (logoUrl) {
            updateEducation(eduId, { logo: logoUrl });
        }
    };

    const handleInstitutionChange = (eduId: string, institutionName: string) => {
        updateEducation(eduId, { institution: institutionName });
        // Auto-fetch logo when institution name changes
        if (institutionName.length > 3) {
            const logoUrl = getLogoUrl(institutionName);
            updateEducation(eduId, { logo: logoUrl });
        }
    };

    return (
        <div className="education-editor">
            {education.map((edu, index) => (
                <div key={edu.id} className="item-card">
                    <div className="item-card-header">
                        <div className="drag-handle">
                            <GripVertical size={16} />
                            <span className="item-number">#{index + 1}</span>
                        </div>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => removeEducation(edu.id)}
                            title="Remove"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Institution Logo Section */}
                    <div className="logo-section">
                        <div
                            className="logo-preview"
                            style={{ backgroundImage: edu.logo ? `url(${edu.logo})` : undefined }}
                        >
                            {!edu.logo && <Upload size={20} />}
                        </div>
                        <div className="logo-actions">
                            <label className="btn btn-secondary btn-sm">
                                <Upload size={14} />
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(edu.id, e)}
                                    hidden
                                />
                            </label>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleFetchLogo(edu.id, edu.institution)}
                                title="Fetch logo from institution name"
                            >
                                <Search size={14} />
                                Auto
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Degree & Field of Study</label>
                        <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                            placeholder="e.g. Bachelor of Science, Computer Science"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Institution</label>
                            <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleInstitutionChange(edu.id, e.target.value)}
                                placeholder="University or School name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <MonthYearPicker
                                value={edu.startDate}
                                onChange={(value) => updateEducation(edu.id, { startDate: value })}
                                placeholder="Select Start Date"
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <MonthYearPicker
                                value={edu.endDate}
                                onChange={(value) => updateEducation(edu.id, { endDate: value })}
                                placeholder="Select End Date"
                                showPresent={true}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button className="btn btn-secondary add-btn" onClick={addEducation}>
                <Plus size={16} />
                Add Education
            </button>
        </div>
    );
}
