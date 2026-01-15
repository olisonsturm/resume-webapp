import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resume, Header, Experience, Education, Achievement, Certification, Language } from '../types/resume';

// CV file structure
export interface CVFile {
    id: string;
    name: string;
    linkedInUrl?: string;
    resume: Resume;
    createdAt: string;
    updatedAt: string;
}

// Default empty resume template
const emptyResume: Resume = {
    header: {
        name: '',
        title: '',
        phone: '',
        email: '',
        location: '',
        link: '',
        photo: '',
    },
    experience: [],
    education: [],
    achievements: [],
    certifications: [],
    skills: [],
    languages: [],
};

// Pre-populated with user's existing resume data (preserved!)
const initialResume: Resume = {
    header: {
        name: 'Olison Sturm',
        title: 'Technology Consulting',
        phone: '+49 1522 1602305',
        email: 'olison.sturm@sap.com',
        location: 'Ravensburg, Germany',
        link: 'linkedin.com/in/olisonsturm',
        photo: 'https://enhancv.s3.amazonaws.com/avatars/89d1f0f7cfee175556746c8c1f09b6a8f1c0cfcd607a02377b6c477300c502f9.jpg',
    },
    experience: [
        {
            id: '1',
            position: 'Consecutive Master Student in Technology Consulting at Mobile Innovation Technology',
            workplace: 'SAP',
            location: 'Walldorf, Germany',
            startDate: '10/2025',
            endDate: 'Present',
            description: '',
            bullets: [],
            logo: 'https://logo.clearbit.com/sap.com',
        },
        {
            id: '2',
            position: 'STAR Student',
            workplace: 'SAP',
            location: 'Markdorf, Germany',
            startDate: '2022',
            endDate: '09/2025',
            description: '',
            bullets: [],
            logo: 'https://logo.clearbit.com/sap.com',
        },
        {
            id: '3',
            position: 'Programming Tutorial, Student Assistant',
            workplace: 'DHBW Ravensburg',
            location: 'Ravensburg, Germany',
            startDate: '10/2024',
            endDate: '12/2024',
            description: 'Employed in a paid position to facilitate learning and answer student inquiries. Led tutorials for first-semester students, helping them understand core programming concepts and solve exercises, ensuring their success in the module.',
            bullets: [],
            logo: 'https://logo.clearbit.com/dhbw.de',
        },
        {
            id: '4',
            position: 'Lead of Campus Radio, Student Assistant',
            workplace: 'DHBW Ravensburg',
            location: 'Ravensburg, Germany',
            startDate: '10/2023',
            endDate: '09/2024',
            description: 'Directed the campus radio "das kleine uboot" for two semesters, managing Pub Quiz, Social Media, Livestreams, Podcasts, and Events. Oversaw a team of 30+ for smooth operations. Worked as a paid Student Assistant at DHBW Ravensburg.',
            bullets: [],
            logo: 'https://logo.clearbit.com/dhbw.de',
        },
        {
            id: '5',
            position: 'Care and Education Assistant',
            workplace: 'Stiftung Liebenau',
            location: 'Meckenbeuren, Germany',
            startDate: '08/2021',
            endDate: '08/2021',
            description: '',
            bullets: [],
        },
        {
            id: '6',
            position: 'Care and Education Assistant',
            workplace: 'Stiftung Liebenau',
            location: 'Meckenbeuren, Germany',
            startDate: '08/2020',
            endDate: '08/2020',
            description: 'Liebenau Foundation is a non-profit organization providing care, education, and support for people with special needs across Europe.',
            bullets: ['I provided care and support for people with disabilities in a residential facility, assisting professionals with personal hygiene, meal preparation, and daily routines in shift work.'],
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Master of Science, Business Information Systems - Data Science & Consulting',
            institution: 'Ludwigshafen University of Business and Society',
            location: 'Ludwigshafen, Germany',
            startDate: '10/2025',
            endDate: 'Present',
            logo: 'https://logo.clearbit.com/hwg-lu.de',
        },
        {
            id: '2',
            degree: 'Bachelor of Science, Business Information Systems - Business Engineering',
            institution: 'Baden-Wuerttemberg Cooperative State University (DHBW)',
            location: 'Ravensburg, Germany',
            startDate: '09/2022',
            endDate: '09/2025',
            logo: 'https://logo.clearbit.com/dhbw.de',
        },
        {
            id: '3',
            degree: 'German High School Diploma, Information Technology (IT)',
            institution: 'Gewerbliche Schule Ravensburg - TG Ravensburg',
            location: 'Ravensburg, Germany',
            startDate: '09/2019',
            endDate: '08/2022',
        },
        {
            id: '4',
            degree: 'German Secondary School Diploma',
            institution: 'Bildungszentrum Meckenbeuren',
            location: 'Meckenbeuren, Germany',
            startDate: '09/2013',
            endDate: '08/2019',
        },
    ],
    achievements: [
        { id: '1', title: 'Effective Communication Enhancement', description: 'Consulting project reducing communication error rate by 50% at Kulturfonds Energie.' },
        { id: '2', title: 'Compliance Checks Advancement', description: 'Enabled 15+ compliance checks with Joule capability prototype.' },
        { id: '3', title: 'Boosted Threat Detection Efficiency', description: 'Enhanced Joule capability, improving threat identification speed by 30%.' },
        { id: '4', title: 'Optimized Data Simulation', description: 'Simulated data ingestion process, increasing system testing efficiency by 25%.' },
        { id: '5', title: 'Improved User Engagement', description: 'Increased user engagement by 40% in cloud applications.' },
        { id: '6', title: 'Led Campus Radio Team', description: 'Successfully led a team of 30 students, increasing event attendance by 50%.' },
    ],
    certifications: [
        { id: '1', title: 'S4D400 - Basic ABAP Programming', issuer: 'SAP' },
        { id: '2', title: 'Learning Cloud Computing: Core Concepts', issuer: 'LinkedIn' },
    ],
    skills: [
        'Business Process', 'Flutter', 'Android Development', 'Databases', 'Kyma', 'Docker', 'Mermaid',
        'Jupyter', 'Python', 'Tutoring', 'Management', 'ERP Software', 'Business Process Management',
        'BPMN', 'EPK', 'SAP Joule', 'ABAP', 'CAP', 'RAP', 'SAPUI5', 'Fiori Elements', 'CouchDB',
    ],
    languages: [
        { id: '1', name: 'German', level: 'Native' },
        { id: '2', name: 'English', level: 'Advanced' },
    ],
};

// Initial CV file with preserved data
const initialCVFile: CVFile = {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Olison Sturm Resume',
    linkedInUrl: 'https://www.linkedin.com/in/olisonsturm/',
    resume: initialResume,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

interface CVStore {
    // CV List Management
    cvList: CVFile[];
    activeCvId: string | null;

    // CV CRUD
    createCV: (name: string, linkedInUrl?: string) => string;
    createCVWithData: (name: string, linkedInUrl: string, resume: Resume) => string;
    deleteCV: (id: string) => void;
    loadCV: (id: string) => void;
    duplicateCV: (id: string) => string;
    renameCV: (id: string, name: string) => void;

    // Active Resume Access
    resume: Resume;

    // Resume Section Updates
    updateHeader: (header: Partial<Header>) => void;
    updateExperience: (id: string, data: Partial<Experience>) => void;
    addExperience: () => void;
    removeExperience: (id: string) => void;
    reorderExperience: (fromIndex: number, toIndex: number) => void;
    updateEducation: (id: string, data: Partial<Education>) => void;
    addEducation: () => void;
    removeEducation: (id: string) => void;
    updateAchievement: (id: string, data: Partial<Achievement>) => void;
    addAchievement: () => void;
    removeAchievement: (id: string) => void;
    updateCertification: (id: string, data: Partial<Certification>) => void;
    addCertification: () => void;
    removeCertification: (id: string) => void;
    updateSkills: (skills: string[]) => void;
    updateLanguage: (id: string, data: Partial<Language>) => void;
    addLanguage: () => void;
    removeLanguage: (id: string) => void;

    // Utility
    resetCurrentCV: () => void;
}

// Helper to get active resume from state
const getActiveResume = (state: { cvList: CVFile[]; activeCvId: string | null }): Resume => {
    const cv = state.cvList.find(c => c.id === state.activeCvId);
    return cv?.resume || emptyResume;
};

// Helper to update active CV's resume
const updateActiveResume = (
    state: { cvList: CVFile[]; activeCvId: string | null },
    updater: (resume: Resume) => Resume
): CVFile[] => {
    return state.cvList.map(cv => {
        if (cv.id === state.activeCvId) {
            return {
                ...cv,
                resume: updater(cv.resume),
                updatedAt: new Date().toISOString(),
            };
        }
        return cv;
    });
};

export const useResumeStore = create<CVStore>()(
    persist(
        (set, get) => ({
            cvList: [initialCVFile],
            activeCvId: 'c0000000-0000-0000-0000-000000000001',

            get resume() {
                const state = get();
                // During hydration, state may not be fully initialized
                if (!state || !state.cvList) {
                    return emptyResume;
                }
                return getActiveResume({ cvList: state.cvList, activeCvId: state.activeCvId });
            },

            createCV: (name, linkedInUrl) => {
                const id = crypto.randomUUID();
                // Deep clone to ensure completely empty resume (no shared references)
                const freshResume = JSON.parse(JSON.stringify(emptyResume));
                const newCV: CVFile = {
                    id,
                    name,
                    linkedInUrl,
                    resume: freshResume,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set(state => ({ cvList: [...state.cvList, newCV] }));
                return id;
            },

            createCVWithData: (name, linkedInUrl, resumeData) => {
                const id = crypto.randomUUID();
                const newCV: CVFile = {
                    id,
                    name,
                    linkedInUrl,
                    resume: resumeData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set(state => ({ cvList: [...state.cvList, newCV] }));
                return id;
            },

            deleteCV: (id) => {
                set(state => ({
                    cvList: state.cvList.filter(cv => cv.id !== id),
                    activeCvId: state.activeCvId === id ? state.cvList[0]?.id || null : state.activeCvId,
                }));
            },

            loadCV: (id) => {
                set({ activeCvId: id });
            },

            duplicateCV: (id) => {
                const state = get();
                const source = state.cvList.find(cv => cv.id === id);
                if (!source) return id;

                const newId = crypto.randomUUID();
                const duplicate: CVFile = {
                    ...source,
                    id: newId,
                    name: `${source.name} (Copy)`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set(state => ({ cvList: [...state.cvList, duplicate] }));
                return newId;
            },

            renameCV: (id, name) => {
                set(state => ({
                    cvList: state.cvList.map(cv => cv.id === id ? { ...cv, name, updatedAt: new Date().toISOString() } : cv),
                }));
            },

            updateHeader: (header) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        header: { ...resume.header, ...header },
                    })),
                })),

            updateExperience: (id, data) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        experience: resume.experience.map(exp => exp.id === id ? { ...exp, ...data } : exp),
                    })),
                })),

            addExperience: () =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        experience: [
                            ...resume.experience,
                            { id: crypto.randomUUID(), position: '', workplace: '', location: '', startDate: '', endDate: '', description: '', bullets: [] },
                        ],
                    })),
                })),

            removeExperience: (id) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        experience: resume.experience.filter(exp => exp.id !== id),
                    })),
                })),

            reorderExperience: (fromIndex, toIndex) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => {
                        const newExp = [...resume.experience];
                        const [removed] = newExp.splice(fromIndex, 1);
                        newExp.splice(toIndex, 0, removed);
                        return { ...resume, experience: newExp };
                    }),
                })),

            updateEducation: (id, data) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        education: resume.education.map(edu => edu.id === id ? { ...edu, ...data } : edu),
                    })),
                })),

            addEducation: () =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        education: [...resume.education, { id: crypto.randomUUID(), degree: '', institution: '', location: '', startDate: '', endDate: '' }],
                    })),
                })),

            removeEducation: (id) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        education: resume.education.filter(edu => edu.id !== id),
                    })),
                })),

            updateAchievement: (id, data) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        achievements: resume.achievements.map(ach => ach.id === id ? { ...ach, ...data } : ach),
                    })),
                })),

            addAchievement: () =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        achievements: [...resume.achievements, { id: crypto.randomUUID(), title: '', description: '' }],
                    })),
                })),

            removeAchievement: (id) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        achievements: resume.achievements.filter(ach => ach.id !== id),
                    })),
                })),

            updateCertification: (id, data) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        certifications: resume.certifications.map(cert => cert.id === id ? { ...cert, ...data } : cert),
                    })),
                })),

            addCertification: () =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        certifications: [...resume.certifications, { id: crypto.randomUUID(), title: '', issuer: '' }],
                    })),
                })),

            removeCertification: (id) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        certifications: resume.certifications.filter(cert => cert.id !== id),
                    })),
                })),

            updateSkills: (skills) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({ ...resume, skills })),
                })),

            updateLanguage: (id, data) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        languages: resume.languages.map(lang => lang.id === id ? { ...lang, ...data } : lang),
                    })),
                })),

            addLanguage: () =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        languages: [...resume.languages, { id: crypto.randomUUID(), name: '', level: 'Intermediate' as const }],
                    })),
                })),

            removeLanguage: (id) =>
                set(state => ({
                    cvList: updateActiveResume(state, resume => ({
                        ...resume,
                        languages: resume.languages.filter(lang => lang.id !== id),
                    })),
                })),

            resetCurrentCV: () =>
                set(state => ({
                    cvList: updateActiveResume(state, () => emptyResume),
                })),
        }),
        {
            name: 'cv-storage',
            version: 1,
            partialize: (state) => ({
                cvList: state.cvList,
                activeCvId: state.activeCvId,
            }),
            merge: (persistedState, currentState) => {
                // If we have persisted state, use it entirely (don't merge with defaults)
                if (persistedState && typeof persistedState === 'object') {
                    const persisted = persistedState as { cvList?: CVFile[]; activeCvId?: string | null };
                    return {
                        ...currentState,
                        cvList: persisted.cvList ?? currentState.cvList,
                        activeCvId: persisted.activeCvId ?? currentState.activeCvId,
                    };
                }
                return currentState;
            },
        }
    )
);

// Selector hook for getting the active resume reactively
export const useActiveResume = () => {
    return useResumeStore((state) => {
        const cv = state.cvList.find(c => c.id === state.activeCvId);
        return cv?.resume || emptyResume;
    });
};
