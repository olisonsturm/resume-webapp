import { useState } from 'react';
import {
    User, Briefcase, GraduationCap, Award, Wrench, Languages, BadgeCheck,
    ChevronDown, ChevronRight
} from 'lucide-react';
import { HeaderEditor } from './HeaderEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { AchievementsEditor } from './AchievementsEditor';
import { SkillsEditor } from './SkillsEditor';
import { LanguagesEditor } from './LanguagesEditor';
import { CertificationsEditor } from './CertificationsEditor';
import './EditorLayout.css';

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
    component: React.ReactNode;
}

const sections: Section[] = [
    { id: 'header', title: 'Personal Details', icon: <User size={18} />, component: <HeaderEditor /> },
    { id: 'experience', title: 'Experience', icon: <Briefcase size={18} />, component: <ExperienceEditor /> },
    { id: 'education', title: 'Education', icon: <GraduationCap size={18} />, component: <EducationEditor /> },
    { id: 'achievements', title: 'Key Achievements', icon: <Award size={18} />, component: <AchievementsEditor /> },
    { id: 'skills', title: 'Skills', icon: <Wrench size={18} />, component: <SkillsEditor /> },
    { id: 'languages', title: 'Languages', icon: <Languages size={18} />, component: <LanguagesEditor /> },
    { id: 'certifications', title: 'Certifications', icon: <BadgeCheck size={18} />, component: <CertificationsEditor /> },
];

export function EditorLayout() {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['header']));

    const toggleSection = (id: string) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="editor-layout">
            <div className="editor-header">
                <h2>Resume Editor</h2>
            </div>

            <div className="editor-sections">
                {sections.map((section) => {
                    const isExpanded = expandedSections.has(section.id);
                    return (
                        <div key={section.id} className="editor-section card">
                            <button
                                className="section-header"
                                onClick={() => toggleSection(section.id)}
                                aria-expanded={isExpanded}
                            >
                                <div className="section-title">
                                    {section.icon}
                                    <h3>{section.title}</h3>
                                </div>
                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </button>

                            {isExpanded && (
                                <div className="section-content">
                                    {section.component}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
