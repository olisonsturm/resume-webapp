import type { Resume } from '../types/resume';
import type { LetterData } from '../types/letter';

// Database types matching Supabase schema
export interface DbCV {
    id: string;
    user_id: string;
    name: string;
    linkedin_url: string | null;
    resume: Resume;
    created_at: string;
    updated_at: string;
}

export interface DbLetter {
    id: string;
    user_id: string;
    name: string;
    letter_data: LetterData;
    created_at: string;
    updated_at: string;
}

// User profile from Supabase Auth
export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
}
