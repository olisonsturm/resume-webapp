const fs = require('fs');
const logFile = '/Users/I569892/SAPDevelop/Private/resume-webapp/server/parser.log';

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

function parseLinkedInPDF(text) {
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
    log('--- Starting Parse ---');

    const resume = {
        header: { name: '', title: '', phone: '', email: '', location: '', link: '', photo: '' },
        experience: [],
        education: [],
        achievements: [],
        certifications: [],
        skills: [],
        languages: []
    };

    const rawLines = text.split('\n').map(l => l.trim()).filter(l => l);

    const isDateRange = (l) => /^[A-Z][a-zäöü]+ [0-9]{4}\s*-\s*(Present|Heute|Angestellt|[A-Z][a-zäöü]+ [0-9]{4})/i.test(l);
    const isDuration = (l) => /^[0-9]+ (Jahr[e]?|Monat[e]?)/i.test(l);
    const isPageMarker = (l) => /^(Page|Seite) [0-9]+ (of|von|\/) [0-9]+/i.test(l);
    const isLocation = (l) => l.includes(',') && !isDateRange(l) && !l.includes('·') && !l.includes('www.') && l.length < 60;
    const sectionHeaders = ['Kontakt', 'Top-Kenntnisse', 'Certifications', 'Experience', 'Berufserfahrung', 'Ausbildung', 'Education', 'Zusammenfassung', 'Summary'];

    const monthMap = {
        'januar': '01', 'january': '01', 'jan': '01',
        'februar': '02', 'february': '02', 'feb': '02',
        'märz': '03', 'march': '03', 'mar': '03',
        'april': '04', 'apr': '04',
        'mai': '05', 'may': '05',
        'juni': '06', 'june': '06', 'jun': '06',
        'juli': '07', 'july': '07', 'jul': '07',
        'august': '08', 'aug': '08',
        'september': '09', 'sept': '09', 'sep': '09',
        'oktober': '10', 'october': '10', 'oct': '10',
        'november': '11', 'nov': '11',
        'dezember': '12', 'december': '12', 'dec': '12'
    };

    function normalizeDate(dateStr) {
        if (!dateStr) return '';
        let clean = dateStr.replace(/\s+/g, ' ').trim();
        clean = clean.split(' (')[0];

        const lower = clean.toLowerCase();
        if (lower === 'present' || lower === 'heute' || lower === 'angestellt') return 'Present';

        const parts = lower.split(' ');
        if (parts.length === 2) {
            const month = monthMap[parts[0]];
            const year = parts[1];
            if (month && year.match(/^[0-9]{4}$/)) {
                return `${month}/${year}`;
            }
        }
        return clean;
    }

    const taggedLines = rawLines.map((l, idx) => {
        let type = 'TEXT';
        if (isPageMarker(l)) type = 'PAGE';
        else if (isDateRange(l)) type = 'DATE';
        else if (isDuration(l)) type = 'DURATION';
        else if (isLocation(l)) type = 'LOCATION';
        else if (sectionHeaders.some(h => l.toLowerCase() === h.toLowerCase() || (l.length < 25 && l.includes(h)))) type = 'HEADER';

        return { text: l, type, index: idx };
    });

    const lines = taggedLines.filter(tl => tl.type !== 'PAGE');
    let currentSection = '';
    let currentCompany = '';

    for (let i = 0; i < lines.length; i++) {
        const { text, type } = lines[i];

        if (type === 'HEADER') {
            const h = text.toLowerCase();
            if (h.includes('kontakt')) currentSection = 'CONTACT';
            else if (h.includes('kenntnisse')) currentSection = 'SKILLS';
            else if (h.includes('certif')) currentSection = 'CERTS';
            else if (h.includes('berufs') || h.includes('experience')) currentSection = 'EXPERIENCE';
            else if (h.includes('ausbild') || h.includes('education')) currentSection = 'EDUCATION';
            else currentSection = '';
            continue;
        }

        if (text === "Olison Sturm") {
            resume.header.name = text;
            let j = i + 1;
            let titleParts = [];
            while (j < lines.length && lines[j].type !== 'HEADER' && lines[j].text !== 'Zusammenfassung') {
                if (lines[j].type === 'LOCATION') {
                    resume.header.location = lines[j].text;
                    break;
                }
                titleParts.push(lines[j].text);
                j++;
            }
            resume.header.title = titleParts.join(' ').trim();
            i = j - 1;
            continue;
        }

        switch (currentSection) {
            case 'CONTACT':
                if (text.includes('@')) resume.header.email = text;
                else if (text.includes('linkedin.com')) resume.header.link = 'https://' + text.replace('(LinkedIn)', '').trim();
                else if (text.match(/[0-9]{5,}/)) resume.header.phone = text.split(' (')[0];
                break;

            case 'SKILLS':
                if (type === 'TEXT' && text.length < 40) resume.skills.push(text);
                break;

            case 'CERTS':
                if (type === 'TEXT' && text.length > 2 && !text.includes("Olison Sturm")) {
                    // Smart merge for certs
                    if (resume.certifications.length > 0) {
                        const last = resume.certifications[resume.certifications.length - 1];
                        const lastWords = last.title.split(' ');
                        const lastWord = lastWords[lastWords.length - 1];
                        if (/^(with|and|of|for|Core|in|the)$/i.test(lastWord) || last.title.length < 15) {
                            last.title += ' ' + text;
                        } else {
                            resume.certifications.push({ id: `cert-${i}`, title: text, issuer: '' });
                        }
                    } else {
                        resume.certifications.push({ id: `cert-${i}`, title: text, issuer: '' });
                    }
                }
                break;

            case 'EXPERIENCE':
                if (type === 'DURATION') {
                    currentCompany = lines[i - 1].text;
                }

                if (type === 'DATE') {
                    const [rawStart, rawEnd] = text.split(/\s*-\s*/).map(s => s.trim().split(' (')[0]);
                    const start = normalizeDate(rawStart);
                    const end = normalizeDate(rawEnd);
                    let position = lines[i - 1]?.text || '';

                    if (!currentCompany || i < 15) {
                        // Look back for company
                        if (lines[i - 2] && lines[i - 2].type === 'TEXT' && lines[i - 2].text !== position) {
                            currentCompany = lines[i - 2].text;
                        }
                    }

                    let location = '';
                    if (lines[i + 1]?.type === 'LOCATION') location = lines[i + 1].text;

                    let desc = '';
                    let k = i + (location ? 2 : 1);
                    while (k < lines.length && lines[k].type !== 'DATE' && lines[k].type !== 'HEADER' && lines[k].type !== 'DURATION') {
                        desc += lines[k].text + ' ';
                        k++;
                    }

                    resume.experience.push({
                        id: `exp-${i}`,
                        position,
                        workplace: currentCompany,
                        location,
                        startDate: start,
                        endDate: end,
                        description: desc.trim(),
                        bullets: []
                    });
                    i = k - 1;
                }
                break;

            case 'EDUCATION':
                // Check for education anchor: School followed by Degree and Date
                // Dates are either in the same line with ( · ) or in the next line
                if (text.includes('·') && text.includes('(')) {
                    let degree = text.split('·')[0].trim();
                    const dateMatch = text.match(/\((.*?)\s*-\s*(.*?)\)/);
                    const start = dateMatch ? normalizeDate(dateMatch[1]) : '';
                    const end = dateMatch ? normalizeDate(dateMatch[2]) : '';

                    // Backtrack for institution and potential degree prefix
                    let inst = '';
                    let degreePrefix = '';
                    if (lines[i - 1] && lines[i - 1].type === 'TEXT') {
                        if (lines[i - 2] && lines[i - 2].type === 'TEXT' && lines[i - 2].type !== 'HEADER') {
                            inst = lines[i - 2].text;
                            degreePrefix = lines[i - 1].text;
                        } else {
                            inst = lines[i - 1].text;
                        }
                    }

                    resume.education.push({
                        id: `edu-${i}`,
                        institution: inst,
                        degree: (degreePrefix ? degreePrefix + ' ' : '') + degree,
                        startDate: start,
                        endDate: end,
                        location: '',
                        bullets: []
                    });
                }
                break;
        }
    }

    return resume;
}

module.exports = { parseLinkedInPDF };
