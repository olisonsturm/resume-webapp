import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A4 width in mm (height calculated proportionally)
const A4_WIDTH_MM = 210;

export async function generatePDF(pagesContainer: HTMLElement, filename: string = 'Resume.pdf') {
    const pages = pagesContainer.querySelectorAll('.resume-page, .letter-page');

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
            onclone: (clonedDoc, clonedElement) => {
                // Fix object-fit rendering issue
                // Instead of background-image, we position the img correctly within a clipped container
                const images = clonedElement.querySelectorAll('img');
                images.forEach((img: HTMLImageElement) => {
                    img.crossOrigin = 'anonymous';

                    const computedStyle = window.getComputedStyle(img);
                    const objectFit = computedStyle.objectFit;

                    if (objectFit && (objectFit === 'cover' || objectFit === 'contain')) {
                        const containerWidth = img.clientWidth;
                        const containerHeight = img.clientHeight;
                        const naturalWidth = img.naturalWidth || containerWidth;
                        const naturalHeight = img.naturalHeight || containerHeight;

                        if (containerWidth > 0 && containerHeight > 0 && naturalWidth > 0 && naturalHeight > 0) {
                            const containerRatio = containerWidth / containerHeight;
                            const imageRatio = naturalWidth / naturalHeight;

                            let newWidth: number, newHeight: number, offsetX: number, offsetY: number;

                            if (objectFit === 'cover') {
                                // Scale to cover the container
                                if (imageRatio > containerRatio) {
                                    // Image is wider - scale by height
                                    newHeight = containerHeight;
                                    newWidth = naturalWidth * (containerHeight / naturalHeight);
                                } else {
                                    // Image is taller - scale by width
                                    newWidth = containerWidth;
                                    newHeight = naturalHeight * (containerWidth / naturalWidth);
                                }
                                offsetX = (containerWidth - newWidth) / 2;
                                offsetY = (containerHeight - newHeight) / 2;
                            } else {
                                // contain - scale to fit inside
                                if (imageRatio > containerRatio) {
                                    newWidth = containerWidth;
                                    newHeight = naturalHeight * (containerWidth / naturalWidth);
                                } else {
                                    newHeight = containerHeight;
                                    newWidth = naturalWidth * (containerHeight / naturalHeight);
                                }
                                offsetX = (containerWidth - newWidth) / 2;
                                offsetY = (containerHeight - newHeight) / 2;
                            }

                            // Create wrapper div
                            const wrapper = clonedDoc.createElement('div');
                            wrapper.style.cssText = `
                                width: ${containerWidth}px;
                                height: ${containerHeight}px;
                                overflow: hidden;
                                position: relative;
                                border-radius: ${computedStyle.borderRadius};
                            `;

                            // Clone the image and apply calculated dimensions
                            const clonedImg = img.cloneNode(true) as HTMLImageElement;
                            clonedImg.style.cssText = `
                                width: ${newWidth}px;
                                height: ${newHeight}px;
                                position: absolute;
                                left: ${offsetX}px;
                                top: ${offsetY}px;
                                object-fit: fill;
                                max-width: none;
                                max-height: none;
                            `;

                            wrapper.appendChild(clonedImg);
                            img.replaceWith(wrapper);
                        }
                    }
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
