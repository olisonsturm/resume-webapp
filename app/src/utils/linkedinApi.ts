import type { Resume } from '../types/resume';

const API_BASE = 'http://localhost:3001';

export interface LinkedInScrapResult {
    success: boolean;
    error?: string;
    data: Resume | null;
}

export async function scrapeLinkedInProfile(linkedInUrl: string): Promise<LinkedInScrapResult> {
    try {
        const response = await fetch(`${API_BASE}/api/scrape-linkedin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ linkedInUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('LinkedIn API error:', error);
        return {
            success: false,
            error: 'Could not connect to LinkedIn scraper. Make sure the server is running.',
            data: null,
        };
    }
}

export async function parseLinkedInPDF(file: File): Promise<LinkedInScrapResult> {
    try {
        const formData = new FormData();
        formData.append('pdf', file);

        const response = await fetch(`${API_BASE}/api/parse-linkedin-pdf`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('LinkedIn PDF API error:', error);
        return {
            success: false,
            error: 'Could not connect to LinkedIn PDF parser. Make sure the server is running.',
            data: null,
        };
    }
}

export async function checkServerHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
}

