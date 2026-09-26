import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoicePricingMode, InvoiceSettings, TripLogEntry } from '../types/invoice';

export interface GeneratedPdfResult {
  doc: jsPDF;
  url: string;
  dataUri: string;
  blob: Blob;
  filename: string;
  totalDue: number;
  totalKm: number;
  save: () => void;
}

/**
 * Creates the vector jsPDF document instance with all styled invoice components.
 * Can be run both on the client and server-side (Node.js).
 */
export function createInvoiceJsPdfDoc(
  settings: InvoiceSettings,
  trips: TripLogEntry[],
  pricingMode: InvoicePricingMode = 'raw_trips',
  viewMode: 'detailed' | 'daily' = 'detailed'
): { doc: jsPDF; filename: string; totalDue: number; totalKm: number } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  const ratePerKm = settings.ratePerKm || 10.0;
  const rawSubtotalKm = trips.reduce((sum, t) => sum + t.distanceKm, 0); // 8,127.9 km

  let totalKm = rawSubtotalKm; // 8,127.9 km -> R 81,279.00
  if (pricingMode === 'summary_slip') {
    totalKm = 7723.0;
  } else if (pricingMode === 'exact_logbook') {
    totalKm = 7733.9;
  }

  const totalDue = totalKm * ratePerKm;

  // 1. Header Truck Icon / Badge (Vector)
  const logoX = margin;
  const logoY = 14;
  const logoW = 20;
  const logoH = 15;

  // Blue truck cabin background
  doc.setFillColor(0, 84, 166); // #0054a6
  doc.roundedRect(logoX, logoY, logoW, logoH, 2, 2, 'F');

  // Truck windshield & details in white
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(logoX + 2, logoY + 2, 10, 5, 1, 1, 'F');
  doc.rect(logoX + 13, logoY + 3, 5, 4, 'F');
  // Wheels
  doc.setFillColor(30, 41, 59);
  doc.circle(logoX + 5, logoY + logoH, 2, 'F');
  doc.circle(logoX + 15, logoY + logoH, 2, 'F');

  // 2. Contractor Details (Left)
  const headerTextX = logoX + logoW + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 84, 166);
  doc.text(settings.contractorCompany || 'Msebenzi and Maria Transport', headerTextX, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 64, 67);
  doc.text(settings.contractorAddress || '2028 Rockdale, Middelburg, 1053', headerTextX, 24);
  doc.text(`Phone: ${settings.contractorPhone || '060 773 8333'}`, headerTextX, 28);
  doc.text(`Email: ${settings.contractorEmail || 'geelbooiskosana@yahoo.com'}`, headerTextX, 32);

  // 3. Invoice Number & Metadata Badge (Right)
  const invBoxW = 56;
  const invBoxH = 10;
  const invBoxX = pageWidth - margin - invBoxW;
  const invBoxY = 14;

  doc.setFillColor(0, 72, 144); // #004890 solid navy
  doc.roundedRect(invBoxX, invBoxY, invBoxW, invBoxH, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(settings.invoiceNumber || 'INVOICE NO 5', invBoxX + invBoxW / 2, invBoxY + 6.8, {
    align: 'center',
  });

  // Meta under invoice badge
  const metaY = invBoxY + invBoxH + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Date:', invBoxX + 15, metaY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(settings.invoiceDate || '25/09/2026', invBoxX + 18, metaY);

  doc.setFont('helvetica', 'bold');
  doc.text('Customer ID:', invBoxX + 15, metaY + 4.5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(settings.clientTaxNumber || '2022/553989/07', invBoxX + 18, metaY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Rate:', invBoxX + 15, metaY + 9, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 84, 166);
  doc.text(`R${ratePerKm.toFixed(2)} per km`, invBoxX + 18, metaY + 9);

  // 4. Solid Dividing Bar
  const divY = 38;
  doc.setFillColor(0, 84, 166);
  doc.roundedRect(margin, divY, contentWidth, 1, 0.5, 0.5, 'F');

  // 5. BILL TO Box
  const billBoxY = divY + 3;
  const billBoxH = 18;
  doc.setFillColor(235, 244, 251); // #ebf4fb
  doc.setDrawColor(211, 229, 245); // #d3e5f5
  doc.roundedRect(margin, billBoxY, contentWidth, billBoxH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 84, 166);
  doc.text('BILL TO', margin + 4, billBoxY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(settings.clientCompany || 'AlageIndustrial (PTY) LTD', margin + 4, billBoxY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `${settings.clientAddress.replace(/\n/g, ', ') || 'Stand No 9166 Ext16, Middelburg, Mhluzi'}   •   ${settings.clientName || 'Contact: Mr Xolani Silinda'}`,
    margin + 4,
    billBoxY + 14.5
  );

  // 6. Prepare Table Data
  let tableRows: (string | number)[][] = [];

  if (viewMode === 'daily') {
    // 19 Daily Aggregation
    const groupedMap = new Map<string, { displayDate: string; routes: string[]; km: number }>();
    trips.forEach((t) => {
      if (!groupedMap.has(t.date)) {
        groupedMap.set(t.date, { displayDate: t.displayDate, routes: [], km: 0 });
      }
      const item = groupedMap.get(t.date)!;
      item.km += t.distanceKm;
      const cleanRoute = t.route.replace(/->/g, '→').replace(/&/g, '+');
      if (!item.routes.includes(cleanRoute)) {
        item.routes.push(cleanRoute);
      }
    });

    let index = 1;
    groupedMap.forEach((val) => {
      const amt = val.km * ratePerKm;
      tableRows.push([
        index.toString(),
        val.displayDate,
        val.routes.join(' & '),
        val.km.toFixed(1),
        amt.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ]);
      index++;
    });
  } else {
    // Detailed 24 trips
    tableRows = trips.map((t, idx) => {
      const amt = t.distanceKm * ratePerKm;
      return [
        (idx + 1).toString(),
        t.displayDate,
        t.route.replace(/->/g, '→'),
        t.distanceKm.toFixed(1),
        amt.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ];
    });
  }

  // 7. AutoTable Generation
  const tableStartY = billBoxY + billBoxH + 4;

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: margin, right: margin },
    head: [['#', 'Date', 'Route / Details of Journey', 'KM', 'Amount (R)']],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [0, 72, 144], // #004890
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 26 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Position after table
  // @ts-expect-error autoTable adds lastAutoTable property to doc
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 220;

  // Check if we need to add another page or if there is room for the summary
  if (finalY + 45 > pageHeight) {
    doc.addPage();
  }

  // Current Y on active page
  const summaryY = finalY + 45 > pageHeight ? 20 : finalY;

  // 8. Thank You script & Bank Details (Left side)
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(0, 84, 166);
  doc.text('Thank you for your business!', margin, summaryY + 6);

  // Underline flourish
  doc.setDrawColor(0, 84, 166);
  doc.setLineWidth(0.5);
  doc.line(margin, summaryY + 8, margin + 50, summaryY + 8);

  // Banking Remittance Box
  const bankY = summaryY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('BANKING REMITTANCE DETAILS:', margin, bankY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Bank: ${settings.contractorBank || 'First National Bank (FNB)'}`, margin, bankY + 4);
  doc.text(`Account No: ${settings.contractorAccountNo || '62849104829'}`, margin, bankY + 8);
  doc.text(`Branch Code: ${settings.contractorBranchCode || '250655'}`, margin, bankY + 12);

  // 9. Summary Card (Right side)
  const sumCardW = 78;
  const sumCardH = 26;
  const sumCardX = pageWidth - margin - sumCardW;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(sumCardX, summaryY, sumCardW, sumCardH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL BILLED KM:', sumCardX + 5, summaryY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalKm.toFixed(1)} km`, sumCardX + sumCardW - 5, summaryY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('RATE PER KM:', sumCardX + 5, summaryY + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 84, 166);
  doc.text(`R${ratePerKm.toFixed(2)}`, sumCardX + sumCardW - 5, summaryY + 11, { align: 'right' });

  // Total Due Solid Navy Bar inside card
  doc.setFillColor(0, 72, 144);
  doc.roundedRect(sumCardX + 2, summaryY + 14, sumCardW - 4, 10, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL DUE:', sumCardX + 6, summaryY + 20.5);

  doc.setFontSize(11);
  doc.text(
    `R ${totalDue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    sumCardX + sumCardW - 6,
    summaryY + 20.5,
    { align: 'right' }
  );

  // 10. Decorative Bottom Waves
  const bottomY = pageHeight - 8;
  doc.setFillColor(0, 84, 166);
  doc.rect(0, bottomY + 4, pageWidth, 4, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(0, bottomY + 6, pageWidth, 2, 'F');

  // Safe filename
  const safeNumber = (settings.invoiceNumber || 'INVOICE_NO_5').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeDate = (settings.invoiceDate || '25-09-2026').replace(/[^a-zA-Z0-9_-]/g, '-');
  const filename = `${safeNumber}_R${Math.round(totalDue)}_${safeDate}.pdf`;

  return { doc, filename, totalDue, totalKm };
}

/**
 * Generates a crisp, professional vector A4 PDF invoice directly in memory using jsPDF.
 */
export function generateInvoicePdf(
  settings: InvoiceSettings,
  trips: TripLogEntry[],
  pricingMode: InvoicePricingMode = 'exact_logbook',
  viewMode: 'detailed' | 'daily' = 'detailed'
): GeneratedPdfResult {
  const { doc, filename, totalDue, totalKm } = createInvoiceJsPdfDoc(
    settings,
    trips,
    pricingMode,
    viewMode
  );

  const blob = doc.output('blob');
  let url = '';
  try {
    url = URL.createObjectURL(blob);
  } catch (e) {
    console.warn('URL.createObjectURL failed:', e);
  }

  const dataUri = doc.output('datauristring');

  const save = () => {
    try {
      doc.save(filename);
    } catch (e) {
      console.warn('doc.save error:', e);
    }
  };

  return { doc, url, dataUri, blob, filename, totalDue, totalKm, save };
}

/**
 * Initiates direct download of the invoice PDF using multi-layer strategies:
 * 1. HTTP server download link (/api/download-invoice-pdf)
 * 2. jsPDF doc.save()
 * 3. Base64 data URI anchor download
 */
export function triggerDirectPdfDownload(
  pricingMode: InvoicePricingMode = 'raw_trips',
  viewMode: 'detailed' | 'daily' = 'detailed',
  pdfResult?: GeneratedPdfResult
) {
  const serverUrl = `/api/download-invoice-pdf?pricingMode=${encodeURIComponent(
    pricingMode
  )}&viewMode=${encodeURIComponent(viewMode)}&t=${Date.now()}`;

  // Strategy 1: Hidden iframe navigation (immune to sandboxing, transparently triggers browser download)
  try {
    let iframe = document.getElementById('pdf-download-iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'pdf-download-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    iframe.src = serverUrl;
  } catch (err) {
    console.warn('Iframe download trigger failed:', err);
  }

  // Strategy 2: Direct link click to server endpoint
  try {
    const link = document.createElement('a');
    link.href = serverUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {
        // ignore
      }
    }, 500);
  } catch (err) {
    console.warn('Direct link download trigger failed:', err);
  }

  // Strategy 3: Client-side doc.save() fallback
  if (pdfResult) {
    try {
      pdfResult.save();
    } catch (e) {
      console.warn('pdfResult.save() failed:', e);
    }
  }
}

/**
 * Generates and triggers automatic download of the invoice PDF with multi-layer fallback.
 */
export function downloadInvoicePdf(
  settings: InvoiceSettings,
  trips: TripLogEntry[],
  pricingMode: InvoicePricingMode = 'raw_trips',
  viewMode: 'detailed' | 'daily' = 'detailed'
): GeneratedPdfResult {
  const result = generateInvoicePdf(settings, trips, pricingMode, viewMode);
  triggerDirectPdfDownload(pricingMode, viewMode, result);
  return result;
}
