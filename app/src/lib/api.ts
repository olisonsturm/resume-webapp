import { supabase, isSupabaseConfigured } from './supabase';
import type { DbCV, DbLetter } from '../types/database';
import type { Resume } from '../types/resume';
import type { LetterData } from '../types/letter';

// ============================================
// CV API Functions
// ============================================

export async function fetchUserCVs(): Promise<DbCV[]> {
    if (!isSupabaseConfigured() || !supabase) {
        console.warn('Supabase not configured, returning empty array');
        return [];
    }

    const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching CVs:', error);
        throw error;
    }

    return data || [];
}

export async function createCV(name: string, linkedInUrl?: string): Promise<DbCV> {
    if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase not configured');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const emptyResume: Resume = {
        header: { name: '', title: '', phone: '', email: '', location: '', link: '', photo: '' },
        experience: [],
        education: [],
        achievements: [],
        certifications: [],
        skills: [],
        languages: [],
    };

    const { data, error } = await supabase
        .from('cvs')
        .insert({
            user_id: user.id,
            name,
            linkedin_url: linkedInUrl || null,
            resume: emptyResume,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating CV:', error);
        throw error;
    }

    return data;
}

export async function updateCV(id: string, updates: { name?: string; resume?: Resume }): Promise<DbCV> {
    if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
        .from('cvs')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating CV:', error);
        throw error;
    }

    return data;
}

export async function deleteCV(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase not configured');
    }

    const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting CV:', error);
        throw error;
    }
}

// ============================================
// Letter API Functions
// ============================================

export async function fetchUserLetters(): Promise<DbLetter[]> {
    if (!isSupabaseConfigured() || !supabase) {
        console.warn('Supabase not configured, returning empty array');
        return [];
    }

    const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching letters:', error);
        throw error;
    }

    return data || [];
}

export async function createLetter(name: string): Promise<DbLetter> {
    if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase not configured');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const emptyLetter: LetterData = {
        letterType: 'motivation',
        sender: { name: '', title: '', address: '', phone: '', email: '', link: '', location: '' },
        recipient: { name: '', company: '', address: '' },
        date: new Date().toLocaleDateString('de-DE'),
        subject: '',
        greeting: 'Sehr geehrte Damen und Herren,',
        body: '',
        closing: 'Mit freundlichen Grüßen',
        signatureName: '',
        signatureImage: '',
        attachments: [],
    };

    const { data, error } = await supabase
        .from('letters')
        .insert({
            user_id: user.id,
            name,
            letter_data: emptyLetter,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating letter:', error);
        throw error;
    }

    return data;
}

export async function updateLetter(id: string, updates: { name?: string; letter_data?: LetterData }): Promise<DbLetter> {
    if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
        .from('letters')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating letter:', error);
        throw error;
    }

    return data;
}

export async function deleteLetter(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase not configured');
    }

    const { error } = await supabase
        .from('letters')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting letter:', error);
        throw error;
    }
}
