const fs = require('fs');
const pdfParse = require('pdf-parse/dist/pdf-parse/cjs/index.cjs');

const pdfPath = '/Users/I569892/SAPDevelop/Private/resume-webapp/app/Profile.pdf';
const dataBuffer = fs.readFileSync(pdfPath);

pdfParse(dataBuffer).then(function (data) {
    console.log('=== PDF TEXT CONTENT ===');
    console.log(data.text);
    console.log('=== END ===');
}).catch(err => console.error('Error:', err));
