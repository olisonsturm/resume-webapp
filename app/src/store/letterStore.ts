import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LetterData, LetterType } from '../types/letter';

export interface LetterFile {
    id: string;
    name: string;
    letterData: LetterData;
    createdAt: string;
    updatedAt: string;
}

const emptyLetter: LetterData = {
    letterType: 'motivation',
    sender: {
        name: '',
        title: '',
        address: '',
        phone: '',
        email: '',
        link: '',
        location: '',
    },
    recipient: {
        name: '',
        company: '',
        address: '',
    },
    date: new Date().toLocaleDateString('de-DE'),
    subject: '',
    greeting: 'Sehr geehrte Damen und Herren,',
    body: '',
    closing: 'Mit freundlichen Grüßen',
    signatureName: '',
    signatureImage: '',
    attachments: [],
};

interface LetterStore {
    letterList: LetterFile[];
    activeLetterId: string | null;

    // CRUD
    createLetter: (name: string) => string;
    deleteLetter: (id: string) => void;
    loadLetter: (id: string) => void;
    duplicateLetter: (id: string) => string;
    renameLetter: (id: string, name: string) => void;

    // Active Letter Access
    letter: LetterData;

    // Update functions
    updateLetterType: (type: LetterType) => void;
    updateSender: (data: Partial<LetterData['sender']>) => void;
    updateRecipient: (data: Partial<LetterData['recipient']>) => void;
    updateLetterContent: (data: Partial<Pick<LetterData, 'date' | 'subject' | 'greeting' | 'body' | 'closing'>>) => void;
    updateSignature: (data: Partial<Pick<LetterData, 'signatureName' | 'signatureImage'>>) => void;
    updateAttachments: (attachments: string[]) => void;
    resetCurrentLetter: () => void;
}

const getActiveLetter = (state: { letterList: LetterFile[]; activeLetterId: string | null }): LetterData => {
    const letter = state.letterList.find(l => l.id === state.activeLetterId);
    return letter?.letterData || emptyLetter;
};

const updateActiveLetter = (
    state: { letterList: LetterFile[]; activeLetterId: string | null },
    updater: (letter: LetterData) => LetterData
): LetterFile[] => {
    return state.letterList.map(letter => {
        if (letter.id === state.activeLetterId) {
            return {
                ...letter,
                letterData: updater(letter.letterData),
                updatedAt: new Date().toISOString(),
            };
        }
        return letter;
    });
};

export const useLetterStore = create<LetterStore>()(
    persist(
        (set, get) => ({
            letterList: [],
            activeLetterId: null,

            get letter() {
                return getActiveLetter({ letterList: get().letterList, activeLetterId: get().activeLetterId });
            },

            createLetter: (name) => {
                const id = `letter-${Date.now()}`;
                const freshLetter = JSON.parse(JSON.stringify(emptyLetter));
                const newLetter: LetterFile = {
                    id,
                    name,
                    letterData: freshLetter,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set(state => ({ letterList: [...state.letterList, newLetter] }));
                return id;
            },

            deleteLetter: (id) => {
                set(state => ({
                    letterList: state.letterList.filter(l => l.id !== id),
                    activeLetterId: state.activeLetterId === id ? state.letterList[0]?.id || null : state.activeLetterId,
                }));
            },

            loadLetter: (id) => {
                set({ activeLetterId: id });
            },

            duplicateLetter: (id) => {
                const state = get();
                const source = state.letterList.find(l => l.id === id);
                if (!source) return id;

                const newId = `letter-${Date.now()}`;
                const duplicate: LetterFile = {
                    ...source,
                    id: newId,
                    name: `${source.name} (Copy)`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set(state => ({ letterList: [...state.letterList, duplicate] }));
                return newId;
            },

            renameLetter: (id, name) => {
                set(state => ({
                    letterList: state.letterList.map(l => l.id === id ? { ...l, name, updatedAt: new Date().toISOString() } : l),
                }));
            },

            updateLetterType: (type) =>
                set(state => ({
                    letterList: updateActiveLetter(state, letter => ({
                        ...letter,
                        letterType: type,
                    })),
                })),

            updateSender: (data) =>
                set(state => ({
                    letterList: updateActiveLetter(state, letter => ({
                        ...letter,
                        sender: { ...letter.sender, ...data },
                    })),
                })),

            updateRecipient: (data) =>
                set(state => ({
                    letterList: updateActiveLetter(state, letter => ({
                        ...letter,
                        recipient: { ...letter.recipient, ...data },
                    })),
                })),

            updateLetterContent: (data) =>
                set(state => ({
                    letterList: updateActiveLetter(state, letter => ({
                        ...letter,
                        ...data,
                    })),
                })),

            updateSignature: (data) =>
                set(state => ({
                    letterList: updateActiveLetter(state, letter => ({
                        ...letter,
                        ...data,
                    })),
                })),

            updateAttachments: (attachments) =>
                set(state => ({
                    letterList: updateActiveLetter(state, letter => ({
                        ...letter,
                        attachments,
                    })),
                })),

            resetCurrentLetter: () =>
                set(state => ({
                    letterList: updateActiveLetter(state, () => emptyLetter),
                })),
        }),
        { name: 'letter-storage' }
    )
);

export const useActiveLetter = () => {
    return useLetterStore((state) => {
        const letter = state.letterList.find(l => l.id === state.activeLetterId);
        return letter?.letterData || emptyLetter;
    });
};
