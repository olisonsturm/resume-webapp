import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { Plus, Trash2 } from 'lucide-react';
import type { Language } from '../../types/resume';
import './LanguagesEditor.css';

const LEVEL_OPTIONS: Language['level'][] = ['Native', 'Advanced', 'Intermediate', 'Basic'];

export function LanguagesEditor() {
    const { updateLanguage, addLanguage, removeLanguage } = useResumeStore();
    const resume = useActiveResume();
    const { languages } = resume;

    return (
        <div className="languages-editor">
            {languages.map((lang) => (
                <div key={lang.id} className="language-item">
                    <input
                        type="text"
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                        placeholder="Language name"
                        className="language-name"
                    />
                    <select
                        value={lang.level}
                        onChange={(e) => updateLanguage(lang.id, { level: e.target.value as Language['level'] })}
                        className="language-level"
                    >
                        {LEVEL_OPTIONS.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => removeLanguage(lang.id)}
                        title="Remove"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}

            <button className="btn btn-secondary add-btn" onClick={addLanguage}>
                <Plus size={16} />
                Add Language
            </button>
        </div>
    );
}
