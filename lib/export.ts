import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export const exportToPDF = async (elementId: string, fileName: string = "TruRate-Receipt.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        // html-to-image is much more robust for modern CSS (oklch, backdrop-filter)
        const dataUrl = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2, // High resolution
            backgroundColor: "#09090b",
            style: {
                // Ensure the cloned element doesn't have clipping or scrollbars
                overflow: 'visible'
            }
        });

        // Use jsPDF to wrap the high-res PNG into a PDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
    } catch (error) {
        console.error("Modern PDF Export failed:", error);
        alert("Export failed using modern engine. Please try again or check settings.");
    }
};
