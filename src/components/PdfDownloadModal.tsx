import React, { useState } from 'react';
import {
  Download,
  Printer,
  CheckCircle2,
  X,
  FileText,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { GeneratedPdfResult, triggerDirectPdfDownload } from '../utils/pdfGenerator';
import { InvoicePricingMode, InvoiceSettings } from '../types/invoice';

interface PdfDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfResult: GeneratedPdfResult | null;
  settings: InvoiceSettings;
  onPrint: () => void;
  totalDue?: number;
  totalKm?: number;
  pricingMode?: InvoicePricingMode;
}

export const PdfDownloadModal: React.FC<PdfDownloadModalProps> = ({
  isOpen,
  onClose,
  pdfResult,
  settings,
  onPrint,
  totalDue = 81279.0,
  totalKm = 8127.9,
  pricingMode = 'raw_trips',
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen || !pdfResult) return null;

  const serverDownloadUrl = `/api/download-invoice-pdf?pricingMode=${encodeURIComponent(
    pricingMode
  )}&viewMode=detailed&invoiceNumber=${encodeURIComponent(
    settings.invoiceNumber || 'INVOICE NO 5'
  )}&invoiceDate=${encodeURIComponent(settings.invoiceDate || '25/09/2026')}&t=${Date.now()}`;

  const handleDownloadClick = () => {
    setDownloadSuccess(true);
    // Multi-strategy trigger
    triggerDirectPdfDownload(pricingMode, 'detailed', pdfResult);

    // Also trigger form POST with base64 to ensure it reaches download manager
    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/download-pdf';
      form.target = '_blank';

      const inputBase64 = document.createElement('input');
      inputBase64.type = 'hidden';
      inputBase64.name = 'pdfBase64';
      inputBase64.value = pdfResult.dataUri;

      const inputFilename = document.createElement('input');
      inputFilename.type = 'hidden';
      inputFilename.name = 'filename';
      inputFilename.value = pdfResult.filename;

      form.appendChild(inputBase64);
      form.appendChild(inputFilename);
      document.body.appendChild(form);
      form.submit();
      setTimeout(() => {
        try {
          document.body.removeChild(form);
        } catch {
          // ignore
        }
      }, 1000);
    } catch (e) {
      console.warn('Form POST trigger failed:', e);
    }
  };

  const handleDownloadHtml = () => {
    try {
      const printableElem = document.getElementById('printable-invoice');
      if (!printableElem) return;

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${settings.invoiceNumber || 'INVOICE NO 5'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body class="bg-stone-100 p-8 flex justify-center">
  <div class="bg-white max-w-4xl w-full p-8 rounded-2xl shadow border">
    ${printableElem.innerHTML}
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdfResult.filename.replace(/\.pdf$/, '')}.html`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        try {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      }, 500);
    } catch (e) {
      console.warn('HTML download failed:', e);
    }
  };

  const handleCopySummary = () => {
    const text = `TAX INVOICE: ${settings.invoiceNumber || 'INVOICE NO 5'}
Contractor: ${settings.contractorCompany} (${settings.contractorPhone})
Client: ${settings.clientCompany} (${settings.clientTaxNumber})
Date: ${settings.invoiceDate || '25/09/2026'}
Total Billed Distance: ${totalKm.toFixed(1)} km
Agreed Rate: R${(settings.ratePerKm || 10).toFixed(2)} / km
TOTAL AMOUNT DUE: R ${totalDue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Banking: ${settings.contractorBank} | Acc: ${settings.contractorAccountNo} | Branch: ${settings.contractorBranchCode}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 print:hidden">
      <div
        className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full shadow-2xl overflow-hidden transition-all duration-200 flex flex-col ${
          isExpanded ? 'max-w-5xl h-[92vh]' : 'max-w-2xl max-h-[92vh]'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between gap-4 shrink-0 bg-stone-50/50 dark:bg-stone-850/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  Invoice Ready: R {totalDue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                  {totalKm.toFixed(1)} KM
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Official A4 document for {settings.invoiceNumber || 'INVOICE NO 5'} generated.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title={isExpanded ? 'Collapse preview' : 'Expand preview'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* File summary bar */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-3.5 border border-stone-200 dark:border-stone-700/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-mono font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                  {pdfResult.filename}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <span>{settings.contractorCompany}</span>
                  <span>•</span>
                  <span>Billed to: {settings.clientCompany}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-stone-500 font-medium">Total Amount Due:</div>
              <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                R {totalDue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Visual Invoice Preview Card (Rendered reliably without iframe sandbox restrictions) */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white text-stone-900 p-5 shadow-xs max-h-72 overflow-y-auto space-y-3">
            <div className="flex justify-between items-start pb-3 border-b border-stone-200">
              <div>
                <h4 className="font-extrabold text-[#0054a6] text-base">
                  {settings.contractorCompany}
                </h4>
                <p className="text-[11px] text-stone-600">{settings.contractorAddress}</p>
                <p className="text-[11px] text-stone-600">Phone: {settings.contractorPhone}</p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-[#004890] text-white font-black text-xs px-3 py-1 rounded uppercase tracking-wider">
                  {settings.invoiceNumber || 'INVOICE NO 5'}
                </div>
                <p className="text-[11px] text-stone-600 mt-1 font-bold">Date: {settings.invoiceDate}</p>
                <p className="text-[11px] text-[#0054a6] font-bold">R10.00 / km</p>
              </div>
            </div>

            <div className="bg-[#ebf4fb] p-3 rounded-xl border border-[#d3e5f5] text-xs">
              <span className="font-bold text-[#0054a6] uppercase text-[10px]">BILL TO:</span>
              <p className="font-bold text-stone-900">{settings.clientCompany}</p>
              <p className="text-stone-700 text-[11px]">{settings.clientAddress.replace(/\n/g, ', ')}</p>
            </div>

            <div className="flex justify-between items-center bg-[#004890] text-white p-3 rounded-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">TOTAL DUE ({totalKm.toFixed(1)} KM)</span>
                <p className="text-xs font-medium">Audited 19 Working Days</p>
              </div>
              <div className="text-lg font-black font-mono">
                R {totalDue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Primary Action 1: Direct Server Download */}
            <a
              href={serverDownloadUrl}
              download={pdfResult.filename}
              onClick={handleDownloadClick}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF File (.pdf)</span>
            </a>

            {/* Primary Action 2: Native Print / Save as PDF */}
            <button
              onClick={() => {
                onClose();
                onPrint();
              }}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#0054a6] hover:bg-[#004085] active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-900/15 transition cursor-pointer"
            >
              <Printer className="w-5 h-5" />
              <span>Print / Save as PDF (Instant)</span>
            </button>
          </div>

          {/* Secondary Action Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Standalone HTML */}
            <button
              onClick={handleDownloadHtml}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-semibold text-xs border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              title="Download standalone offline invoice file"
            >
              <FileCode className="w-4 h-4 text-amber-600" />
              <span>Save Offline HTML (.html)</span>
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopySummary}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-semibold text-xs border border-stone-200 dark:border-stone-700 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Copy Text Summary</span>
                </>
              )}
            </button>
          </div>

          {/* Download helper guidance */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-4 text-xs text-stone-700 dark:text-stone-300 space-y-1.5">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Two Guaranteed Ways to Save:</span>
            </div>
            <p>
              1. <strong>Direct Download:</strong> Click the green <strong>&quot;Download PDF File (.pdf)&quot;</strong> button. The file is sent directly by the server to your Downloads folder.
            </p>
            <p>
              2. <strong>Save as PDF (Instant):</strong> Click <strong>&quot;Print / Save as PDF&quot;</strong> and choose <em>&quot;Save as PDF&quot;</em> in your browser&apos;s printer list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
