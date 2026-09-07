import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

/**
 * Loads an image from a URL and converts it to Base64
 * @param {string} url
 * @returns {Promise<string>} Base64 data URL
 */
const getBase64ImageFromUrl = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Error loading image for PDF:", err);
    return null;
  }
};

/**
 * Generates and downloads a PDF Valuation Report
 * @param {Object} valuation - The valuation response data
 * @param {Object} formData - The submitted form data (optional fallback)
 */
export const generateValuationPDF = async (valuation, formData) => {
  // A4 size: 210 x 297 mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // -- THEME COLORS --
  // We'll use a clean light theme for the PDF but incorporate brand Gold/Dark
  const colors = {
    brandDark: [15, 23, 42],    // Slate 900
    brandGold: [212, 175, 55],  // Gold
    textMain: [51, 65, 85],     // Slate 700
    textMuted: [100, 116, 139], // Slate 500
    lightBg: [248, 250, 252],   // Slate 50
    emerald: [16, 185, 129],    // Emerald 500
    rose: [244, 63, 94]         // Rose 500
  };

  // Variables
  const estimated = valuation.estimatedValue || 0;
  const low = valuation.rangeLow || estimated * 0.95;
  const high = valuation.rangeHigh || estimated * 1.05;
  const address = valuation.address || formData?.address || "Valuation Report";
  const confidence = valuation.confidenceScore || 0.85;
  const confidencePct = Math.round(confidence * 100);
  const confidenceLabel = confidence >= 0.85 ? "High Accuracy" : confidence >= 0.70 ? "Moderate Accuracy" : "Low Accuracy";
  const confidenceColor = confidence >= 0.85 ? colors.emerald : confidence >= 0.70 ? colors.brandGold : colors.rose;

  const sqft = formData?.gr_liv_area || valuation.grLivArea || "—";
  const bedrooms = formData?.bedrooms ?? valuation.bedrooms ?? "—";
  const baths = formData?.full_bath ?? valuation.fullBath ?? "—";
  const yearBuilt = formData?.year_built ?? valuation.yearBuilt ?? "—";
  const quality = formData?.overall_qual ?? valuation.overallQual ?? "—";
  const neighborhood = valuation.neighborhood || formData?.neighborhood || "—";

  let currentY = margin;

  // --- 1. HEADER (Logo & Title) ---
  const logoBase64 = await getBase64ImageFromUrl('/valualtion_gold_logo.png');
  
  if (logoBase64) {
    // logo aspect ratio roughly ~ 1:1, we'll draw it 20x20
    doc.addImage(logoBase64, 'PNG', margin, currentY, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...colors.brandDark);
    doc.text("ValuAltion", margin + 25, currentY + 12);
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.brandGold);
    doc.text("AI Property Valuation Report", margin + 25, currentY + 18);
  } else {
    // Fallback if logo fails to load
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...colors.brandDark);
    doc.text("ValuAltion Report", margin, currentY + 10);
  }

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.textMuted);
  const dateStr = new Date(valuation.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, currentY + 18, { align: 'right' });

  currentY += 35;
  
  // Divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 15;

  // --- 2. PROPERTY ADDRESS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...colors.brandDark);
  doc.text(address, margin, currentY);
  currentY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...colors.textMuted);
  doc.text(`${neighborhood}, Ames, IA`, margin, currentY);
  currentY += 20;

  // --- 3. VALUATION SUMMARY (The Big Numbers) ---
  // Draw a very light bounding box
  doc.setFillColor(...colors.lightBg);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 40, 3, 3, "F");
  
  currentY += 12;
  doc.setFontSize(10);
  doc.setTextColor(...colors.textMuted);
  doc.text("ESTIMATED MARKET VALUE", margin + 10, currentY);
  
  currentY += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...colors.brandDark);
  doc.text(formatCurrency(estimated), margin + 10, currentY);

  // Range
  currentY -= 5;
  doc.setFontSize(10);
  doc.setTextColor(...colors.textMuted);
  doc.setFont("helvetica", "normal");
  doc.text("ESTIMATED RANGE", pageWidth - margin - 60, currentY - 7);
  
  doc.setFontSize(12);
  doc.setTextColor(...colors.textMain);
  doc.text(`${formatCurrency(low)} - ${formatCurrency(high)}`, pageWidth - margin - 60, currentY);

  currentY += 35; // Move past the box

  // --- 4. PROPERTY SPECS & AI CONFIDENCE ---
  // We'll draw two columns
  const col1X = margin;
  const col2X = pageWidth / 2 + 10;
  let gridY = currentY;

  // Property details title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...colors.brandDark);
  doc.text("Property Summary", col1X, gridY);

  // AI Confidence title
  doc.text("AI Model Accuracy", col2X, gridY);
  gridY += 10;

  // Property Details List
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const drawSpecRow = (label, val, y) => {
    doc.setTextColor(...colors.textMuted);
    doc.text(label, col1X, y);
    doc.setTextColor(...colors.brandDark);
    doc.setFont("helvetica", "bold");
    doc.text(String(val), col1X + 40, y);
    doc.setFont("helvetica", "normal");
  };

  drawSpecRow("Living Area:", `${sqft} sq ft`, gridY);
  drawSpecRow("Bedrooms:", bedrooms, gridY + 8);
  drawSpecRow("Bathrooms:", baths, gridY + 16);
  drawSpecRow("Year Built:", yearBuilt, gridY + 24);
  drawSpecRow("Quality:", `${quality} / 10`, gridY + 32);

  // AI Confidence rendering
  doc.setFillColor(...colors.lightBg); // Light bg instead of trying alpha on setFillColor
  doc.roundedRect(col2X, gridY - 4, 70, 24, 2, 2, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...confidenceColor);
  doc.text(`${confidencePct}%`, col2X + 5, gridY + 8);
  
  doc.setFontSize(10);
  doc.text(confidenceLabel, col2X + 5, gridY + 14);

  currentY = gridY + 50;

  // --- 5. PAGE 2: COMPARABLE SALES ---
  const comps = valuation.comparables || [];
  if (comps.length > 0) {
    doc.addPage();
    let p2Y = margin;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...colors.brandDark);
    doc.text("Comparable Sales", margin, p2Y);
    p2Y += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...colors.textMuted);
    doc.text("Recently sold properties similar to this valuation profile.", margin, p2Y);
    p2Y += 10;

    // Prepare table data
    const tableHead = [["Address", "Sale Date", "Similarity", "Sq Ft", "Beds/Baths", "Sale Price"]];
    const tableBody = comps.map(c => [
      c.address,
      c.saleDate || "N/A",
      `${Math.round(c.similarityScore || 0)}%`,
      c.livingAreaSqft || "—",
      `${c.bedrooms || 0} / ${c.fullBath || 0}`,
      formatCurrency(c.salePrice)
    ]);

    autoTable(doc, {
      startY: p2Y,
      head: tableHead,
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: colors.brandDark, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: colors.lightBg },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
      columnStyles: {
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'center' },
        5: { halign: 'right', fontStyle: 'bold', textColor: colors.brandDark }
      }
    });
  }

  // Save the PDF
  const filename = address.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "valuation";
  doc.save(`ValuAltion_${filename}.pdf`);
};
