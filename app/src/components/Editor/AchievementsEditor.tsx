import { useResumeStore, useActiveResume } from '../../store/resumeStore';
import { Plus, Trash2 } from 'lucide-react';
import './AchievementsEditor.css';

export function AchievementsEditor() {
    const { updateAchievement, addAchievement, removeAchievement } = useResumeStore();
    const resume = useActiveResume();
    const { achievements } = resume;

    return (
        <div className="achievements-editor">
            {achievements.map((ach, index) => (
                <div key={ach.id} className="item-card">
                    <div className="item-card-header">
                        <span className="item-number">#{index + 1}</span>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => removeAchievement(ach.id)}
                            title="Remove"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Achievement Title</label>
                        <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                            placeholder="e.g. Effective Communication Enhancement"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={ach.description}
                            onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                            placeholder="Describe the impact..."
                            rows={2}
                        />
                    </div>
                </div>
            ))}

            <button className="btn btn-secondary add-btn" onClick={addAchievement}>
                <Plus size={16} />
                Add Achievement
            </button>
        </div>
    );
}
