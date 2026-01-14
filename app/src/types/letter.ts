export interface LetterSender {
    name: string;
    title?: string;  // Job title for header
    address: string;
    phone: string;
    email: string;
    link?: string;   // LinkedIn/website
    location?: string;
}

export interface LetterRecipient {
    name: string;
    company: string;
    address: string;
}

export type LetterType = 'formal' | 'motivation';

export interface LetterData {
    letterType: LetterType;
    sender: LetterSender;
    recipient: LetterRecipient;
    date: string;
    subject: string;
    greeting: string;
    body: string;
    closing: string;
    signatureName: string;
    signatureImage?: string;
    attachments: string[];
}
