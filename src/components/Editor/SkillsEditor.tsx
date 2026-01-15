import { useState } from 'react';
import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { Plus, X } from 'lucide-react';
import './SkillsEditor.css';

export function SkillsEditor() {
    const { updateSkills } = useResumeStore();
    const resume = useActiveResume();
    const { skills } = resume;
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            updateSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        updateSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div className="skills-editor">
            <div className="skill-input-row">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill (press Enter)"
                />
                <button className="btn btn-primary" onClick={handleAddSkill}>
                    <Plus size={16} />
                </button>
            </div>

            <div className="skills-list">
                {skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                        <span>{skill}</span>
                        <button
                            className="skill-remove"
                            onClick={() => handleRemoveSkill(skill)}
                            title="Remove"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {skills.length === 0 && (
                <p className="empty-message">No skills added yet. Start typing above!</p>
            )}
        </div>
    );
}
