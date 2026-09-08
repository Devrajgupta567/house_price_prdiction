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
 * Generates and downloads a PDF Valuation Report with Explainable AI attribution
 * @param {Object} valuation - The valuation response data
 * @param {Object} formData - The submitted form data (optional fallback)
 * @param {Object} options - { returnBase64: boolean, autoDownload: boolean }
 */
export const generateValuationPDF = async (valuation, formData, options = { returnBase64: false, autoDownload: true }) => {
  // A4 size: 210 x 297 mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // -- THEME COLORS --
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
  const neighborhood = valuation.neighborhood || formData?.neighborhood || "Ames, Iowa";

  let currentY = margin;

  // --- 1. HEADER (Logo & Title) ---
  const logoBase64 = await getBase64ImageFromUrl('/valualtion_gold_logo.png');
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', margin, currentY - 5, 24, 24);
    } catch (e) {
      console.warn("Could not draw logo:", e);
    }
  }

  // Header texts
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...colors.brandDark);
  doc.text("ValuAltion", margin + 28, currentY + 7);

  doc.setFontSize(9);
  doc.setTextColor(...colors.textMuted);
  doc.setFont("helvetica", "normal");
  doc.text("AI-POWERED REAL ESTATE VALUATION DOSSIER", margin + 28, currentY + 13);

  // Date and ref
  doc.setFontSize(9);
  doc.setTextColor(...colors.textMuted);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  doc.text(`DATE: ${today}`, pageWidth - margin, currentY + 7, { align: "right" });
  doc.text(`REF: VAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, pageWidth - margin, currentY + 13, { align: "right" });

  currentY += 24;

  // Thin separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 10;

  // --- 2. SUBJECT PROPERTY ADDRESS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...colors.brandDark);
  doc.text(address, margin, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.textMuted);
  doc.text(`${neighborhood}, IA · Single Family Residential`, margin, currentY + 5);

  currentY += 15;

  // --- 3. VALUATION SUMMARY BOX ---
  doc.setFillColor(...colors.lightBg);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 30, 3, 3, "F");
  doc.setDrawColor(...colors.brandGold);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 30, 3, 3, "S");

  currentY += 12;

  // Estimated Value label & value
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colors.brandGold);
  doc.text("ESTIMATED MARKET VALUE", margin + 10, currentY - 4);

  doc.setFontSize(22);
  doc.setTextColor(...colors.brandDark);
  doc.text(formatCurrency(estimated), margin + 10, currentY + 7);

  // Conservative & Optimistic Range
  doc.setFontSize(10);
  doc.setTextColor(...colors.textMuted);
  doc.setFont("helvetica", "normal");
  doc.text("CONFIDENCE SPREAD", pageWidth - margin - 70, currentY - 4);

  doc.setFontSize(12);
  doc.setTextColor(...colors.textMain);
  doc.text(`${formatCurrency(low)} — ${formatCurrency(high)}`, pageWidth - margin - 70, currentY + 4);

  currentY += 28;

  // --- 4. PROPERTY SPECS & AI CONFIDENCE ---
  const col1X = margin;
  const col2X = pageWidth / 2 + 10;
  let gridY = currentY;

  // Property details title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...colors.brandDark);
  doc.text("Property Summary", col1X, gridY);

  doc.text("Model Accuracy", col2X, gridY);
  gridY += 8;

  const drawSpecRow = (label, val, y) => {
    doc.setTextColor(...colors.textMuted);
    doc.setFont("helvetica", "normal");
    doc.text(label, col1X, y);
    doc.setTextColor(...colors.brandDark);
    doc.setFont("helvetica", "bold");
    doc.text(String(val), col1X + 38, y);
  };

  drawSpecRow("Living Area:", `${sqft} sq ft`, gridY);
  drawSpecRow("Bedrooms:", bedrooms, gridY + 6);
  drawSpecRow("Bathrooms:", baths, gridY + 12);
  drawSpecRow("Year Built:", yearBuilt, gridY + 18);
  drawSpecRow("Quality Rating:", `${quality} / 10`, gridY + 24);

  // AI Confidence badge
  doc.setFillColor(...colors.lightBg);
  doc.roundedRect(col2X, gridY - 4, 65, 26, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...confidenceColor);
  doc.text(`${confidencePct}%`, col2X + 6, gridY + 8);

  doc.setFontSize(9);
  doc.setTextColor(...confidenceColor);
  doc.text(confidenceLabel, col2X + 6, gridY + 16);

  currentY = gridY + 34;

  // --- 5. EXPLAINABLE AI (XAI) ATTRIBUTION TABLE ---
  const attributions = valuation.attributions || [];
  if (attributions.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...colors.brandDark);
    doc.text("Valuation Attribution Drivers (Explainable AI)", margin, currentY);
    currentY += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.textMuted);
    doc.text("Attribute-by-attribute contribution breakdown vs the regional benchmark home.", margin, currentY);
    currentY += 4;

    const attrTableHead = [["Value Driver", "Category", "Property Attribute", "Impact ($ / %)"]];
    const attrTableBody = attributions.map(a => [
      a.feature_name || a.featureName,
      a.category,
      a.detail_description || a.detailDescription || "—",
      `${a.formatted_amount || a.formattedAmount} (${a.percentage}%)`
    ]);

    autoTable(doc, {
      startY: currentY,
      head: attrTableHead,
      body: attrTableBody,
      theme: 'grid',
      headStyles: { fillColor: colors.brandDark, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: colors.lightBg },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5 },
      columnStyles: {
        0: { fontStyle: 'bold' },
        3: { halign: 'right', fontStyle: 'bold', textColor: colors.emerald }
      }
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // --- 6. COMPARABLE SALES (PAGE 2) ---
  const comps = valuation.comparables || [];
  if (comps.length > 0) {
    doc.addPage();
    let p2Y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...colors.brandDark);
    doc.text("Comparable Sales", margin, p2Y);
    p2Y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.textMuted);
    doc.text("Recently sold properties similar to this valuation profile in Ames, Iowa.", margin, p2Y);
    p2Y += 7;

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
      styles: { font: "helvetica", fontSize: 10, cellPadding: 3.5 },
      columnStyles: {
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'center' },
        5: { halign: 'right', fontStyle: 'bold', textColor: colors.brandDark }
      }
    });
  }

  // Handle Return or Download
  const filename = address.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "valuation";
  if (options?.autoDownload !== false) {
    doc.save(`ValuAltion_${filename}.pdf`);
  }

  if (options?.returnBase64) {
    const dataUri = doc.output('datauristring');
    return dataUri.split(',')[1];
  }
};
