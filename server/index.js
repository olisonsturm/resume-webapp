const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const multer = require('multer');
const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const { parseLinkedInPDF } = require('./pdfParser');

const app = express();
const PORT = 3001;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Extract LinkedIn username from URL
function extractUsername(linkedInUrl) {
    const match = linkedInUrl.match(/linkedin\.com\/in\/([^\/\?]+)/);
    return match ? match[1] : null;
}

// Scrape LinkedIn profile (public data only)
app.post('/api/scrape-linkedin', async (req, res) => {
    try {
        const { linkedInUrl } = req.body;

        if (!linkedInUrl) {
            return res.status(400).json({ error: 'LinkedIn URL is required' });
        }

        const username = extractUsername(linkedInUrl);
        if (!username) {
            return res.status(400).json({ error: 'Invalid LinkedIn URL format' });
        }

        const profileUrl = `https://www.linkedin.com/in/${username}/`;

        const response = await axios.get(profileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            timeout: 10000,
        });

        const $ = cheerio.load(response.data);
        const name = $('h1.text-heading-xlarge').text().trim() || username;
        const title = $('div.text-body-medium').first().text().trim() || '';
        const location = $('span.text-body-small').first().text().trim() || '';

        res.json({
            success: true,
            data: {
                header: { name, title, location, phone: '', email: '', link: linkedInUrl, photo: '' },
                experience: [],
                education: [],
                achievements: [],
                certifications: [],
                skills: [],
                languages: [],
            }
        });
    } catch (error) {
        console.error('Scraping error:', error.message);
        res.json({
            success: false,
            error: 'Could not scrape LinkedIn profile. LinkedIn may be blocking the request.',
            data: null,
        });
    }
});

// Parse LinkedIn PDF
app.post('/api/parse-linkedin-pdf', upload.single('pdf'), async (req, res) => {
    try {
        let pdfPath;

        if (req.file) {
            pdfPath = req.file.path;
        } else if (req.body.testPath) {
            pdfPath = req.body.testPath;
        } else {
            return res.status(400).json({ error: 'No PDF file provided' });
        }

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: 'PDF file not found' });
        }

        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        const resumeData = parseLinkedInPDF(data.text);

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.json({ success: true, data: resumeData });
    } catch (error) {
        console.error('PDF parsing error:', error);
        res.status(500).json({ success: false, error: 'Failed to parse PDF' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`LinkedIn scraper server running on http://localhost:${PORT}`);
});


