import jsPDF from "jspdf";
import "jspdf-autotable";  // Make sure this is imported correctly

export const generatePDF = async (elementId, customerName) => {
    const input = document.getElementById(elementId);

    if (!input) return;

    // Convert the HTML element to a canvas
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create a new jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");

    // Get the dimensions for the image
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    // Set a background color (optional)
    pdf.setFillColor("#f5f5f5");
    pdf.rect(0, 0, width, height, 'F');

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    // If you want to add a table to the PDF as well, use autoTable
    const tableColumn = ["Product Name", "Quantity", "Price", "Total"];
    const tableRows = [
      // Your table rows data here (as an example)
      ["Product 1", 2, 200, 400],
      ["Product 2", 3, 150, 450],
    ];

    // Using autoTable plugin to add a table
    pdf.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: height + 10, // Position the table after the image
    });

    // Save the PDF with the customer name or default "invoice"
    pdf.save(`${customerName || "invoice"}.pdf`);
}
