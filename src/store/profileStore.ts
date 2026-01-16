import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface UserProfile {
    id: string;
    full_name: string;
    job_title: string;
    email: string;
    phone: string;
    address: string;
    location: string;
    website: string;
    avatar_url: string;
}

interface ProfileStore {
    profile: UserProfile | null;
    isLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    isLoading: false,

    fetchProfile: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        if (!user || !supabase) return;

        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
                console.error('Error fetching profile:', error);
            }

            if (data) {
                set({ profile: data as UserProfile });
            } else {
                // If no profile exists yet (should be created by trigger, but as fallback)
                // or if trigger failed, we might want to init it locally or wait for first update
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (updates) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        if (!user || !supabase) return;

        set({ isLoading: true });
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...updates,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            set((state) => ({
                profile: state.profile ? { ...state.profile, ...updates } : { id: user.id, ...updates } as UserProfile
            }));
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));
