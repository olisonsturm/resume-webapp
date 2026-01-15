import type { Resume, Experience, Education } from '../types/resume';

/**
 * Common domain mappings for logos.
 * Focus on SAP-related, German institutions, and large tech companies.
 */
const DOMAIN_MAP: Record<string, string> = {
    // Companies
    'sap': 'sap.com',
    'google': 'google.com',
    'microsoft': 'microsoft.com',
    'apple': 'apple.com',
    'amazon': 'amazon.com',
    'meta': 'meta.com',
    'facebook': 'facebook.com',
    'stiftungliebenau': 'stiftung-liebenau.de',
    'liebenau': 'stiftung-liebenau.de',
    'porsche': 'porsche.com',
    'bmw': 'bmw.com',
    'mercedes': 'mercedes-benz.com',
    'daimler': 'daimler.com',
    'siemens': 'siemens.com',
    'bosch': 'bosch.com',
    'telekom': 'telekom.de',
    'adidas': 'adidas-group.com',
    'allianz': 'allianz.com',
    'basf': 'basf.com',
    'bayer': 'bayer.com',

    // Institutions & Universities
    'dhbw': 'dhbw.de',
    'dhbwravensburg': 'dhbw.de',
    'dualehochschule': 'dhbw.de',
    'dualehochschulebadenwuerttemberg': 'dhbw.de',
    'badenwuerttembergcooperativestateuniversity': 'dhbw.de',
    'badenwuerttembergcooperativestateuniversitydhbw': 'dhbw.de',
    'ludwigshafenu': 'hwg-lu.de',
    'hochschuleludwigshafen': 'hwg-lu.de',
    'hwglu': 'hwg-lu.de',
    'hochschulefürwirtschaftundgesellschaftludwigshafen': 'hwg-lu.de',
    'gewerblicheschuleravensburg': 'ks-rv.de',
    'tgravensburg': 'ks-rv.de',
    'ksrv': 'ks-rv.de',
    'technischesgymnasiumravensburg': 'ks-rv.de',
    'bildungszentrummeckenbeuren': 'bz-meckenbeuren.de',
    'bzmeckenbeuren': 'bz-meckenbeuren.de',
    'mit': 'mit.edu',
    'stanford': 'stanford.edu',
    'harvard': 'harvard.edu',
    'eth': 'ethz.ch',
    'tum': 'tum.de',
    'lmu': 'lmu.de',
    'kit': 'kit.edu'
};

/**
 * Normalizes a company/institution name to find its domain.
 */
export const getDomainFromName = (name: string): string => {
    if (!name) return '';

    // Remove special characters, spaces and take the core name
    const cleanName = name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/\s+/g, '');

    // Check direct mapping
    if (DOMAIN_MAP[cleanName]) return DOMAIN_MAP[cleanName];

    // Fuzzy check: if name contains keywords
    if (cleanName.includes('dhbw') || cleanName.includes('dualehochschule')) return 'dhbw.de';
    if (cleanName.includes('sap')) return 'sap.com';
    if (cleanName.includes('liebenau')) return 'stiftung-liebenau.de';
    if (cleanName.includes('hochschuleludwigshafen') || cleanName.includes('hwglu')) return 'hwg-lu.de';

    // Check if name itself looks like a domain
    if (name.includes('.') && !name.includes(' ')) return name.toLowerCase();

    // Default guess
    return `${cleanName.slice(0, 30)}.com`;
};

/**
 * Returns a high-quality logo URL for a given domain using reliable providers.
 */
export const getLogoUrl = (name: string): string => {
    const domain = getDomainFromName(name);
    if (!domain) return '';

    // Use unavatar.io as it has excellent fallbacks and handles clearbit issues
    return `https://unavatar.io/${domain}?fallback=https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

/**
 * Automatically populates logos for all experience and education entries in a resume.
 */
export const populateResumeLogos = (resume: Resume): Resume => {
    const updatedResume = { ...resume };

    if (updatedResume.experience) {
        updatedResume.experience = updatedResume.experience.map((exp: Experience) => ({
            ...exp,
            logo: exp.logo || getLogoUrl(exp.workplace)
        }));
    }

    if (updatedResume.education) {
        updatedResume.education = updatedResume.education.map((edu: Education) => ({
            ...edu,
            logo: edu.logo || getLogoUrl(edu.institution)
        }));
    }

    return updatedResume;
};
