import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    initialized: boolean;

    // Actions
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signInWithGithub: () => Promise<{ error: Error | null }>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    initialized: false,

    initialize: async () => {
        if (!isSupabaseConfigured() || !supabase) {
            set({ loading: false, initialized: true });
            return;
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        set({
            user: session?.user ?? null,
            session,
            loading: false,
            initialized: true
        });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            set({ user: session?.user ?? null, session });
        });
    },

    signIn: async (email, password) => {
        if (!isSupabaseConfigured() || !supabase) {
            return { error: new Error('Supabase not configured') };
        }

        set({ loading: true });
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        set({ loading: false });

        return { error: error ? new Error(error.message) : null };
    },

    signUp: async (email, password) => {
        if (!isSupabaseConfigured() || !supabase) {
            return { error: new Error('Supabase not configured') };
        }

        set({ loading: true });
        const { error } = await supabase.auth.signUp({ email, password });
        set({ loading: false });

        return { error: error ? new Error(error.message) : null };
    },

    signOut: async () => {
        if (!isSupabaseConfigured() || !supabase) return;

        set({ loading: true });
        await supabase.auth.signOut();

        // CRITICAL: Clear all user data from localStorage to prevent data leakage
        localStorage.removeItem('cv-storage');
        localStorage.removeItem('letter-storage');

        set({ user: null, session: null, loading: false });
    },

    signInWithGoogle: async () => {
        if (!isSupabaseConfigured() || !supabase) {
            return { error: new Error('Supabase not configured') };
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });

        return { error: error ? new Error(error.message) : null };
    },

    signInWithGithub: async () => {
        if (!isSupabaseConfigured() || !supabase) {
            return { error: new Error('Supabase not configured') };
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });

        return { error: error ? new Error(error.message) : null };
    },
}));

