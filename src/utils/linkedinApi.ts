import type { Resume } from '../types/resume';

export interface LinkedInScrapResult {
    success: boolean;
    error?: string;
    data: Resume | null;
}

export async function scrapeLinkedInProfile(_linkedInUrl: string): Promise<LinkedInScrapResult> {
    // Note: LinkedIn scraping is not supported in serverless due to rate limiting
    // This feature requires the Express server or a different approach
    console.warn('LinkedIn URL scraping is only available with the local Express server');
    return {
        success: false,
        error: 'LinkedIn URL scraping is not available. Please use LinkedIn PDF export instead.',
        data: null,
    };
}

export async function parseLinkedInPDF(file: File): Promise<LinkedInScrapResult> {
    try {
        const formData = new FormData();
        formData.append('pdf', file);

        // Try serverless API first
        let response = await fetch(`/api/parse-linkedin-pdf`, {
            method: 'POST',
            body: formData,
        });

        // If serverless fails in dev, try Express server
        if (!response.ok && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            response = await fetch(`http://localhost:3001/api/parse-linkedin-pdf`, {
                method: 'POST',
                body: formData,
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('LinkedIn PDF API error:', error);
        return {
            success: false,
            error: 'Could not parse LinkedIn PDF. Make sure the file is valid.',
            data: null,
        };
    }
}

export async function checkServerHealth(): Promise<boolean> {
    try {
        // Try serverless health endpoint
        let response = await fetch(`/api/health`);
        if (response.ok) return true;

        // Fallback to Express server in dev
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            response = await fetch(`http://localhost:3001/api/health`);
            return response.ok;
        }
        return false;
    } catch {
        return false;
    }
}
