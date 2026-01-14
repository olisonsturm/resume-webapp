import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A4 width in mm (height calculated proportionally)
const A4_WIDTH_MM = 210;

export async function generatePDF(pagesContainer: HTMLElement, filename: string = 'Resume.pdf') {
    const pages = pagesContainer.querySelectorAll('.resume-page');

    if (pages.length === 0) {
        console.error('No pages found');
        return;
    }

    // Hide page numbers before capturing
    const pageNumbers = pagesContainer.querySelectorAll('.page-number');
    pageNumbers.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
    });

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;

        // Create canvas from the page element
        const canvas = await html2canvas(page, {
            scale: 2, // Higher resolution for better quality
            useCORS: true, // Allow cross-origin images (logos)
            allowTaint: false, // Don't taint canvas with cross-origin content
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 15000, // Wait longer for images to load
            onclone: (clonedDoc) => {
                // Ensure images are loaded in cloned document
                const images = clonedDoc.querySelectorAll('img');
                images.forEach((img) => {
                    img.crossOrigin = 'anonymous';
                });
            },
        });

        // Calculate dimensions to fit A4
        const imgWidth = A4_WIDTH_MM;
        const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

        // Add page if not the first one
        if (i > 0) {
            pdf.addPage();
        }

        // Add the image to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }

    // Restore page numbers
    pageNumbers.forEach((el) => {
        (el as HTMLElement).style.display = '';
    });

    // Download the PDF
    pdf.save(filename);
}
