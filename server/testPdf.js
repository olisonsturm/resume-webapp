const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = '/Users/I569892/SAPDevelop/Private/resume-webapp/app/Profile.pdf';

if (!fs.existsSync(pdfPath)) {
    console.error('PDF file not found at:', pdfPath);
    process.exit(1);
}

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    console.log('=== PDF TEXT CONTENT ===');
    console.log(data.text);
    console.log('=== END ===');
}).catch(err => {
    console.error('Error during PDF parsing:', err);
});
