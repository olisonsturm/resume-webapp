import { forwardRef, useEffect, useState, useCallback } from 'react';
import { useActiveResume } from '../../store/resumeStore';
import { Phone, Mail, MapPin, Link as LinkIcon, Calendar, Diamond } from 'lucide-react';
import type { Resume } from '../../types/resume';
import './ResumePreview.css';

// A4 page content height in pixels
const PAGE_CONTENT_HEIGHT = 1000;

interface ResumePreviewProps {
    data?: Resume;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
    const storeResume = useActiveResume();
    const resume = data || storeResume;
    const { header, experience, education, achievements, certifications, skills, languages } = resume;
    const [pageCount, setPageCount] = useState(1);

    const levelToDots = (level: string): number => {
        switch (level) {
            case 'Native': return 5;
            case 'Advanced': return 4;
            case 'Intermediate': return 3;
            case 'Basic': return 2;
            default: return 3;
        }
    };

    const calculatePageCount = useCallback(() => {
        const headerHeight = 120;
        const experienceHeight = experience.reduce((acc, exp) => acc + 85 + (exp.description ? 50 : 0), 35);
        const educationHeight = education.length * 70 + 35;
        const leftColumnHeight = headerHeight + experienceHeight + educationHeight;

        const achievementsHeight = achievements.length * 55 + 35;
        const certsHeight = certifications.length * 40 + 35;
        const skillsHeight = 100;
        const languagesHeight = languages.length * 28 + 35;
        const rightColumnHeight = achievementsHeight + certsHeight + skillsHeight + languagesHeight;

        const maxHeight = Math.max(leftColumnHeight, rightColumnHeight);
        return Math.ceil(maxHeight / PAGE_CONTENT_HEIGHT);
    }, [experience, education, achievements, certifications, skills, languages]);

    useEffect(() => {
        setPageCount(calculatePageCount());
    }, [calculatePageCount]);

    return (
        <div className="resume-preview" ref={ref}>
            <div className="pages-container">
                <div className="resume-page" data-page="1">
                    {/* Header - White background */}
                    <header className="resume-header">
                        <div className="header-content">
                            <h1 className="name">{header.name || 'Your Name'}</h1>
                            <p className="title">{header.title || 'Your Job Title'}</p>
                            <div className="contact-info">
                                {header.phone && (
                                    <span className="contact-item">
                                        <Phone size={11} /> {header.phone}
                                    </span>
                                )}
                                {header.email && (
                                    <span className="contact-item">
                                        <Mail size={11} /> {header.email}
                                    </span>
                                )}
                                {header.link && (
                                    <span className="contact-item">
                                        <LinkIcon size={11} /> {header.link}
                                    </span>
                                )}
                                {header.location && (
                                    <span className="contact-item">
                                        <MapPin size={11} /> {header.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        {header.photo && (
                            <div className="header-photo">
                                <img src={header.photo} alt={header.name} />
                            </div>
                        )}
                    </header>

                    {/* Two column layout */}
                    <div className="resume-columns">
                        {/* Left column - Experience & Education */}
                        <div className="column-left">
                            {/* Experience */}
                            {experience?.length > 0 && (
                                <section className="resume-section">
                                    <h2 className="section-heading">Experience</h2>
                                    {experience.filter(exp => exp?.position).map((exp) => (
                                        <div key={exp.id} className="experience-item">
                                            <div className="item-header">
                                                {exp.logo && <img src={exp.logo} alt="" className="company-logo" />}
                                                <div className="item-details">
                                                    <h3 className="item-title">{exp.position}</h3>
                                                    <p className="item-company">{exp.workplace}</p>
                                                    <div className="item-meta">
                                                        {(exp.startDate || exp.endDate) && (
                                                            <span className="meta-date">
                                                                <Calendar size={10} /> {exp.startDate} - {exp.endDate}
                                                            </span>
                                                        )}
                                                        {exp.location && (
                                                            <span className="meta-location">
                                                                <MapPin size={10} /> {exp.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {exp.description && <p className="item-description">{exp.description}</p>}
                                            {exp.bullets?.length > 0 && (
                                                <ul className="item-bullets">
                                                    {exp.bullets.map((bullet, idx) => (
                                                        <li key={idx}>{bullet}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Education */}
                            {education?.length > 0 && (
                                <section className="resume-section">
                                    <h2 className="section-heading">Education</h2>
                                    {education.filter(edu => edu?.degree).map((edu) => (
                                        <div key={edu.id} className="education-item">
                                            <div className="item-header">
                                                {edu.logo && <img src={edu.logo} alt="" className="company-logo" />}
                                                <div className="item-details">
                                                    <h3 className="item-title">{edu.degree}</h3>
                                                    <p className="item-company">{edu.institution}</p>
                                                    <div className="item-meta">
                                                        {(edu.startDate || edu.endDate) && (
                                                            <span className="meta-date">
                                                                <Calendar size={10} /> {edu.startDate} - {edu.endDate}
                                                            </span>
                                                        )}
                                                        {edu.location && (
                                                            <span className="meta-location">
                                                                <MapPin size={10} /> {edu.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}
                        </div>

                        {/* Right column - Achievements, Certs, Skills, Languages */}
                        <div className="column-right">
                            {/* Achievements */}
                            {achievements?.length > 0 && (
                                <section className="resume-section">
                                    <h2 className="section-heading">Key Achievements</h2>
                                    {achievements.map((ach) => (
                                        <div key={ach.id} className="achievement-item">
                                            <Diamond size={12} className="achievement-icon" />
                                            <div className="achievement-content">
                                                <h4 className="achievement-title">{ach.title}</h4>
                                                <p className="achievement-desc">{ach.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Certifications */}
                            {certifications?.length > 0 && (
                                <section className="resume-section">
                                    <h2 className="section-heading">Certification</h2>
                                    {certifications.map((cert) => (
                                        <div key={cert.id} className="cert-item">
                                            <h4 className="cert-title">{cert.title}</h4>
                                            <p className="cert-issuer">{cert.issuer}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Skills */}
                            {skills.length > 0 && (
                                <section className="resume-section">
                                    <h2 className="section-heading">Skills</h2>
                                    <div className="skills-grid">
                                        {skills.map((skill, idx) => (
                                            <span key={idx} className="skill-pill">{skill}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Languages */}
                            {languages?.length > 0 && (
                                <section className="resume-section">
                                    <h2 className="section-heading">Languages</h2>
                                    {languages.map((lang) => (
                                        <div key={lang.id} className="language-item">
                                            <div className="language-info">
                                                <span className="language-name">{lang.name}</span>
                                                <span className="language-level-text">{lang.level}</span>
                                            </div>
                                            <div className="language-dots">
                                                {[1, 2, 3, 4, 5].map((dot) => (
                                                    <span
                                                        key={dot}
                                                        className={`dot ${dot <= levelToDots(lang.level) ? 'filled' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}
                        </div>
                    </div>

                    {pageCount > 1 && (
                        <div className="page-number">Page 1 of {pageCount}</div>
                    )}
                </div>
            </div>
        </div>
    );
});

ResumePreview.displayName = 'ResumePreview';
