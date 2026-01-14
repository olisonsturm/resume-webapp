import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { Plus, Trash2 } from 'lucide-react';
import './CertificationsEditor.css';

export function CertificationsEditor() {
    const { updateCertification, addCertification, removeCertification } = useResumeStore();
    const resume = useActiveResume();
    const { certifications } = resume;

    return (
        <div className="certifications-editor">
            {certifications.map((cert) => (
                <div key={cert.id} className="cert-item">
                    <div className="cert-fields">
                        <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => updateCertification(cert.id, { title: e.target.value })}
                            placeholder="Certificate name"
                            className="cert-title"
                        />
                        <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                            placeholder="Issuing organization"
                            className="cert-issuer"
                        />
                    </div>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => removeCertification(cert.id)}
                        title="Remove"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}

            <button className="btn btn-secondary add-btn" onClick={addCertification}>
                <Plus size={16} />
                Add Certification
            </button>
        </div>
    );
}
