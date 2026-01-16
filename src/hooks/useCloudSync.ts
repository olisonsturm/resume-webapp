import { useEffect, useCallback, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useResumeStore, type CVFile } from '../store/resumeStore';
import { useLetterStore, type LetterFile } from '../store/letterStore';
import { useAuthStore } from '../store/authStore';
import type { Resume } from '../types/resume';
import type { LetterData } from '../types/letter';

// Global sync state - persists across hook instances
let globalSyncedUserId: string | null = null;

// Default empty resume for corrupted database entries
const defaultEmptyResume: Resume = {
    header: { name: '', title: '', phone: '', email: '', location: '', link: '', photo: '' },
    experience: [],
    education: [],
    achievements: [],
    certifications: [],
    skills: [],
    languages: [],
};

// Safely parse resume data from database, providing fallback for corrupted entries
function safeParseResume(resumeData: unknown): Resume {
    if (!resumeData || typeof resumeData !== 'object') {
        console.warn('CV has invalid resume_data, using empty resume');
        return { ...defaultEmptyResume };
    }
    const data = resumeData as Record<string, unknown>;
    // Check if essential structure exists
    if (!data.header || typeof data.header !== 'object') {
        console.warn('CV has missing header, using empty resume');
        return { ...defaultEmptyResume };
    }
    return resumeData as Resume;
}

// Debounce helper with flush support
function createDebouncedFn<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: T | null = null;

    const debouncedFn = (...args: T) => {
        lastArgs = args;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
            lastArgs = null;
            timeoutId = null;
        }, delay);
    };

    // Flush: execute immediately if there's a pending call
    debouncedFn.flush = () => {
        if (timeoutId && lastArgs) {
            clearTimeout(timeoutId);
            fn(...lastArgs);
            lastArgs = null;
            timeoutId = null;
        }
    };

    return debouncedFn;
}

/**
 * Hook to sync local store data with Supabase cloud storage.
 * Falls back to localStorage-only mode when Supabase is not configured.
 */
export function useCloudSync() {
    const { user } = useAuthStore();

    const lastSyncRef = useRef<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Load data from cloud on mount/login
    const loadFromCloud = useCallback(async () => {
        if (!isSupabaseConfigured() || !supabase || !user) {
            setIsLoading(false);
            return;
        }

        // Skip if already synced for this user (prevents clearing data on navigation)
        if (globalSyncedUserId === user.id) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            // Clear local data when syncing for a NEW user
            useResumeStore.setState({ cvList: [], activeCvId: null });
            useLetterStore.setState({ letterList: [], activeLetterId: null });

            // Load CVs for this specific user
            const { data: cvs } = await supabase
                .from('cvs')
                .select('*')
                .eq('user_id', user.id) // Only load this user's CVs
                .order('updated_at', { ascending: false });

            if (cvs && cvs.length > 0) {
                const parsedCvs: CVFile[] = cvs.map(cv => ({
                    id: cv.id,
                    name: cv.name,
                    linkedInUrl: cv.linkedin_url || undefined,
                    resume: safeParseResume(cv.resume_data),
                    createdAt: cv.created_at,
                    updatedAt: cv.updated_at
                }));
                useResumeStore.setState({ cvList: parsedCvs });
                if (parsedCvs.length > 0) {
                    useResumeStore.setState({ activeCvId: parsedCvs[0].id });
                }
            }

            // Load Letters for this specific user (FIXED: Added user_id filter here too)
            const { data: letters } = await supabase
                .from('letters')
                .select('*')
                .eq('user_id', user.id) // Only load this user's letters
                .order('updated_at', { ascending: false });

            if (letters && letters.length > 0) {
                const parsedLetters: LetterFile[] = letters.map(l => ({
                    id: l.id,
                    name: l.name,
                    letterData: l.letter_data as LetterData,
                    createdAt: l.created_at,
                    updatedAt: l.updated_at
                }));
                useLetterStore.setState({ letterList: parsedLetters });
                if (parsedLetters.length > 0) {
                    useLetterStore.setState({ activeLetterId: parsedLetters[0].id });
                }
            }

            globalSyncedUserId = user.id;
        } catch (error) {
            console.error('Error loading from cloud:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Save CV to cloud (debounced)
    const saveCV = useCallback(async (cv: CVFile) => {
        if (!isSupabaseConfigured() || !supabase || !user) return;

        try {
            const { error } = await supabase
                .from('cvs')
                .upsert({
                    id: cv.id,
                    user_id: user.id,
                    name: cv.name,
                    linkedin_url: cv.linkedInUrl || null,
                    resume_data: cv.resume,
                    created_at: cv.createdAt,
                    updated_at: new Date().toISOString(),
                });

            if (error) console.error('Error saving CV:', error);
        } catch (error) {
            console.error('Error saving CV:', error);
        }
    }, [user]);

    // Save Letter to cloud (debounced)
    const saveLetter = useCallback(async (letter: LetterFile) => {
        if (!isSupabaseConfigured() || !supabase || !user) return;

        try {
            const { error } = await supabase
                .from('letters')
                .upsert({
                    id: letter.id,
                    user_id: user.id,
                    name: letter.name,
                    letter_data: letter.letterData,
                    created_at: letter.createdAt,
                    updated_at: new Date().toISOString(),
                });

            if (error) console.error('Error saving letter:', error);
        } catch (error) {
            console.error('Error saving letter:', error);
        }
    }, [user]);

    // Delete CV from cloud
    const deleteCloudCV = useCallback(async (id: string) => {
        if (!isSupabaseConfigured() || !supabase || !user) return;

        try {
            await supabase.from('cvs').delete().eq('id', id);
        } catch (error) {
            console.error('Error deleting CV:', error);
        }
    }, [user]);

    // Delete Letter from cloud
    const deleteCloudLetter = useCallback(async (id: string) => {
        if (!isSupabaseConfigured() || !supabase || !user) return;

        try {
            await supabase.from('letters').delete().eq('id', id);
        } catch (error) {
            console.error('Error deleting letter:', error);
        }
    }, [user]);

    // Debounced save for real-time editing with flush support
    const debouncedSaveCV = useRef(createDebouncedFn((cv: CVFile) => saveCV(cv), 1500)).current;
    const debouncedSaveLetter = useRef(createDebouncedFn((letter: LetterFile) => saveLetter(letter), 1500)).current;

    // Load from cloud when user logs in
    useEffect(() => {
        if (user && globalSyncedUserId !== user.id) {
            loadFromCloud();
        }
    }, [user, loadFromCloud]);

    // Subscribe to CV store changes and sync to cloud
    useEffect(() => {
        if (!isSupabaseConfigured() || !user) return;

        const unsubscribe = useResumeStore.subscribe((state, prevState) => {
            const activeCV = state.cvList.find(cv => cv.id === state.activeCvId);
            const prevActiveCV = prevState.cvList.find(cv => cv.id === prevState.activeCvId);

            // Only sync if content changed, not just selection
            if (activeCV && prevActiveCV && state.activeCvId === prevState.activeCvId) {
                const currentHash = JSON.stringify(activeCV.resume);
                if (currentHash !== lastSyncRef.current) {
                    lastSyncRef.current = currentHash;
                    debouncedSaveCV(activeCV);
                }
            }
        });

        return unsubscribe;
    }, [user, debouncedSaveCV]);

    // Subscribe to Letter store changes and sync to cloud
    useEffect(() => {
        if (!isSupabaseConfigured() || !user) return;

        const unsubscribe = useLetterStore.subscribe((state, prevState) => {
            const activeLetter = state.letterList.find(l => l.id === state.activeLetterId);
            const prevActiveLetter = prevState.letterList.find(l => l.id === prevState.activeLetterId);

            if (activeLetter && prevActiveLetter && state.activeLetterId === prevState.activeLetterId) {
                debouncedSaveLetter(activeLetter);
            }
        });

        return unsubscribe;
    }, [user, debouncedSaveLetter]);

    // Flush pending saves - call this before navigation
    const flushPendingSaves = useCallback(() => {
        debouncedSaveCV.flush();
        debouncedSaveLetter.flush();
    }, [debouncedSaveCV, debouncedSaveLetter]);

    return {
        loadFromCloud,
        saveCV,
        saveLetter,
        deleteCloudCV,
        deleteCloudLetter,
        flushPendingSaves,
        isCloudEnabled: isSupabaseConfigured() && !!user,
        isLoading,
    };
}
