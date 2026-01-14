const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = '/Users/I569892/SAPDevelop/Private/resume-webapp/app/Profile.pdf';
const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    const lines = data.text.split('\n');
    lines.forEach((line, i) => {
        console.log(`${i.toString().padStart(3, '0')}: [${line.trim()}]`);
    });
}).catch(err => console.error(err));
