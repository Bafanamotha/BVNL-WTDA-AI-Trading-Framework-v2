import React, { useState } from 'react';
import {
  Printer,
  FileCheck,
  MapPin,
  Phone,
  Mail,
  Sliders,
  Calendar,
  Check,
  Download,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { InvoicePricingMode, InvoiceSettings, TripLogEntry } from '../types/invoice';
import { TransportTruckLogo } from './TransportTruckLogo';
import { downloadInvoicePdf, GeneratedPdfResult } from '../utils/pdfGenerator';
import { PdfDownloadModal } from './PdfDownloadModal';

interface InvoiceViewProps {
  settings: InvoiceSettings;
  trips: TripLogEntry[];
  pricingMode: InvoicePricingMode;
  onSelectPricingMode: (mode: InvoicePricingMode) => void;
  onEditSettings: () => void;
  onUpdateSettings?: (settings: InvoiceSettings) => void;
  onDownloadPdf?: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  settings,
  trips,
  pricingMode,
  onSelectPricingMode,
  onEditSettings,
  onUpdateSettings,
  onDownloadPdf,
}) => {
  const [viewMode, setViewMode] = useState<'detailed' | 'daily'>('detailed');
  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);
  const [tempDate, setTempDate] = useState<string>(settings.invoiceDate || '25/09/2026');
  const [isEditingNumber, setIsEditingNumber] = useState<boolean>(false);
  const [tempNumber, setTempNumber] = useState<string>(settings.invoiceNumber || 'INVOICE NO 5');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfResult, setPdfResult] = useState<GeneratedPdfResult | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const ratePerKm = settings.ratePerKm || 10.0;
  const rawSubtotalKm = trips.reduce((sum, t) => sum + t.distanceKm, 0); // 8,127.9 km

  let totalKm = rawSubtotalKm; // 8,127.9 km -> R 81,279.00
  if (pricingMode === 'summary_slip') {
    totalKm = 7723.0;
  } else if (pricingMode === 'exact_logbook') {
    totalKm = 7733.9;
  }

  const totalDue = totalKm * ratePerKm;

  // 19 Daily Aggregation
  const dailyGroups: {
    date: string;
    displayDate: string;
    route: string;
    km: number;
    amount: number;
  }[] = [];

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

  groupedMap.forEach((val, dateKey) => {
    dailyGroups.push({
      date: dateKey,
      displayDate: val.displayDate,
      route: val.routes.join(' & '),
      km: val.km,
      amount: val.km * ratePerKm,
    });
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDate = (newDate: string) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        invoiceDate: newDate,
      });
    }
    setIsEditingDate(false);
  };

  const handleSaveNumber = (newNumber: string) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        invoiceNumber: newNumber,
      });
    }
    setIsEditingNumber(false);
  };

  const handleDownloadPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const result = downloadInvoicePdf(settings, trips, pricingMode, viewMode);
      setPdfResult(result);
      setIsPdfModalOpen(true);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Invoice Controls (Hidden during print) */}
      <div className="print:hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 sm:p-5 rounded-3xl space-y-4 shadow-xs">
        {/* Main Bar: Price highlights & switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                  Tax Invoice: <span className="font-mono text-emerald-600 dark:text-emerald-400">R {totalDue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                  Rate: R10.00 / km
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                  {totalKm.toFixed(1)} KM
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Billed to AlageIndustrial (PTY) LTD • 19 Working Days Audited
              </p>
            </div>
          </div>

          {/* Quick Price Selector Buttons */}
          <div className="flex items-center gap-2 flex-wrap bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-2xl text-xs">
            <span className="font-bold text-stone-500 ml-1 text-[11px]">Select Price:</span>
            <button
              type="button"
              onClick={() => onSelectPricingMode('exact_logbook')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                pricingMode === 'exact_logbook'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exact: R 77,339.00</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPricingMode('summary_slip')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                pricingMode === 'summary_slip'
                  ? 'bg-[#0054a6] text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              Slip: R 77,230.00
            </button>
            <button
              type="button"
              onClick={() => onSelectPricingMode('raw_trips')}
              className={`px-2.5 py-1.5 rounded-xl font-medium transition cursor-pointer text-[11px] ${
                pricingMode === 'raw_trips'
                  ? 'bg-stone-800 text-white shadow-xs font-bold dark:bg-stone-700'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              Raw: R 81,279
            </button>
          </div>
        </div>

        {/* Change Invoice Number & Date & Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Invoice Number Control */}
            <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300">Inv No:</span>
              <input
                type="text"
                value={settings.invoiceNumber}
                onChange={(e) => {
                  if (onUpdateSettings) {
                    onUpdateSettings({ ...settings, invoiceNumber: e.target.value });
                  }
                }}
                placeholder="INVOICE NO 5"
                className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-0.5 text-xs font-mono font-black text-[#004890] dark:text-blue-400 w-32 focus:outline-none focus:ring-1 focus:ring-[#0054a6] uppercase"
              />
              <button
                type="button"
                onClick={() => handleSaveNumber('INVOICE NO 5')}
                className={`px-1.5 py-0.5 text-[10px] rounded border cursor-pointer font-bold transition ${
                  settings.invoiceNumber === 'INVOICE NO 5'
                    ? 'bg-[#004890] text-white border-[#004890]'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border-stone-200 dark:border-stone-700'
                }`}
                title="Set to INVOICE NO 5"
              >
                No 5
              </button>
            </div>

            {/* Date Control */}
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-3 py-1.5 rounded-xl text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#0054a6]" />
              <span className="font-bold text-stone-700 dark:text-stone-300">Date:</span>
              <input
                type="text"
                value={settings.invoiceDate}
                onChange={(e) => {
                  if (onUpdateSettings) {
                    onUpdateSettings({ ...settings, invoiceDate: e.target.value });
                  }
                }}
                placeholder="DD/MM/YYYY"
                className="bg-white dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 w-28 focus:outline-none focus:ring-1 focus:ring-[#0054a6]"
              />
              <button
                type="button"
                onClick={() => handleSaveDate('25/09/2026')}
                className={`px-1.5 py-0.5 text-[10px] rounded border cursor-pointer font-bold transition ${
                  settings.invoiceDate === '25/09/2026'
                    ? 'bg-[#0054a6] text-white border-[#0054a6]'
                    : 'bg-white dark:bg-stone-800 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-200'
                }`}
                title="Today's date"
              >
                Today
              </button>
            </div>

            {/* View mode toggle */}
            <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  viewMode === 'detailed'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                All 24 Trip Rows
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  viewMode === 'daily'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                19 Daily Summary Rows
              </button>
            </div>

            <button
              onClick={onEditSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              Edit Info
            </button>
          </div>

          {/* Action buttons: Download & Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white active:scale-95 shadow-md shadow-emerald-600/20 transition cursor-pointer"
              title="Download invoice as an A4 PDF document"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#0054a6] hover:bg-[#004085] text-white active:scale-95 shadow-md shadow-blue-900/10 transition cursor-pointer"
              title="Print or view print preview (Save as PDF)"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* THE PRINTABLE INVOICE SHEET (Exact Match to uploaded invoice.png) */}
      <div
        id="printable-invoice"
        className="bg-white text-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-lg max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:text-black relative overflow-hidden"
      >
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-4">
          {/* Left: Vector Truck Logo + Contractor Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="shrink-0 w-24 h-20 flex items-center justify-center">
              <TransportTruckLogo className="w-24 h-20 drop-shadow-xs" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0054a6] tracking-tight">
                {settings.contractorCompany}
              </h1>

              <div className="space-y-0.5 text-xs text-stone-800">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0054a6] shrink-0" />
                  <span className="font-medium">{settings.contractorAddress}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0054a6] shrink-0" />
                  <span>
                    Phone: <strong className="font-semibold">{settings.contractorPhone}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0054a6] shrink-0" />
                  <span>
                    Email: <strong className="font-semibold">{settings.contractorEmail}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Navy Box with Invoice Number & Meta */}
          <div className="w-full sm:w-auto text-left sm:text-right space-y-1">
            {isEditingNumber ? (
              <div className="inline-flex items-center gap-1.5 bg-[#004890] text-white px-3 py-1.5 rounded-lg shadow-xs">
                <input
                  type="text"
                  value={tempNumber}
                  onChange={(e) => setTempNumber(e.target.value)}
                  className="bg-white text-stone-900 font-black text-sm px-2 py-0.5 rounded border-none w-36 uppercase tracking-wider focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleSaveNumber(tempNumber)}
                  className="p-1 bg-white/20 hover:bg-white/30 text-white rounded cursor-pointer transition"
                  title="Save Invoice Number"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setTempNumber(settings.invoiceNumber);
                  setIsEditingNumber(true);
                }}
                className="inline-block bg-[#004890] text-white font-black text-sm sm:text-base px-5 py-2 rounded-xl shadow-xs uppercase tracking-wider cursor-pointer hover:bg-[#003870] transition"
                title="Click to edit Invoice Number"
              >
                {settings.invoiceNumber || 'INVOICE NO 5'}
              </div>
            )}

            <div className="text-xs text-stone-800 space-y-1 pt-1 font-sans">
              <div className="flex items-center sm:justify-end gap-1.5">
                <span className="font-bold text-stone-900">Date:</span>
                {isEditingDate ? (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="border border-[#0054a6] rounded px-1.5 py-0.5 font-bold text-xs bg-white text-stone-900 w-28 text-center"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveDate(tempDate)}
                      className="p-1 bg-[#0054a6] text-white rounded text-xs cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => {
                      setTempDate(settings.invoiceDate);
                      setIsEditingDate(true);
                    }}
                    className="font-bold text-stone-900 cursor-pointer hover:underline hover:text-[#0054a6]"
                    title="Click to edit date"
                  >
                    {settings.invoiceDate}
                  </span>
                )}
              </div>
              <div>
                <span className="font-bold text-stone-900">Customer ID:</span>{' '}
                <span className="font-mono">{settings.clientTaxNumber || '2022/553989/07'}</span>
              </div>
              <div>
                <span className="font-bold text-stone-900">Rate:</span>{' '}
                <strong className="text-[#0054a6]">
                  R{ratePerKm.toFixed(2)} per kilometre
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Solid Blue Horizontal Bar */}
        <div className="w-full h-1 bg-[#0054a6] my-4 rounded-full" />

        {/* BILL TO Box */}
        <div className="mb-6 bg-[#ebf4fb] rounded-xl p-4 sm:p-5 border border-[#d3e5f5]">
          <h3 className="text-xs font-black text-[#0054a6] uppercase tracking-wider mb-1.5">
            BILL TO
          </h3>
          <div className="text-sm sm:text-base font-black text-stone-900">
            {settings.clientCompany}
          </div>
          <div className="text-xs text-stone-700 whitespace-pre-line mt-1 leading-relaxed font-medium">
            {settings.clientAddress}
          </div>
          <div className="text-xs text-stone-800 font-semibold mt-1.5">
            {settings.clientName}
          </div>
        </div>

        {/* The Itemized Table */}
        <div className="overflow-x-auto border border-[#0054a6] rounded-xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0054a6] text-white font-bold uppercase text-[11px] tracking-wide">
                <th className="py-2.5 px-3 text-center w-12 border-r border-[#004085]">#</th>
                <th className="py-2.5 px-3 w-28 border-r border-[#004085]">Date</th>
                <th className="py-2.5 px-4 border-r border-[#004085]">
                  Route / Details of Journey
                </th>
                <th className="py-2.5 px-4 text-right w-24 border-r border-[#004085]">KM</th>
                <th className="py-2.5 px-4 text-right w-32">Amount (R)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0054a6]/20 bg-white">
              {viewMode === 'detailed' &&
                trips.map((trip, idx) => {
                  const lineAmount = trip.distanceKm * ratePerKm;
                  const formattedRoute = trip.route.replace(/->/g, '→');

                  return (
                    <tr
                      key={trip.id}
                      className={idx % 2 === 1 ? 'bg-[#f7fafe]' : 'bg-white'}
                    >
                      <td className="py-2 px-3 text-center font-bold text-stone-700 border-r border-[#0054a6]/15">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-medium text-stone-800 whitespace-nowrap border-r border-[#0054a6]/15">
                        {trip.displayDate}
                      </td>
                      <td className="py-2 px-4 text-stone-800 border-r border-[#0054a6]/15">
                        <span className="font-medium">{formattedRoute}</span>
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-medium text-stone-900 border-r border-[#0054a6]/15">
                        {trip.distanceKm.toFixed(1)}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-bold text-stone-900">
                        {lineAmount.toLocaleString('en-ZA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  );
                })}

              {viewMode === 'daily' &&
                dailyGroups.map((day, idx) => (
                  <tr
                    key={day.date}
                    className={idx % 2 === 1 ? 'bg-[#f7fafe]' : 'bg-white'}
                  >
                    <td className="py-2 px-3 text-center font-bold text-stone-700 border-r border-[#0054a6]/15">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-medium text-stone-800 whitespace-nowrap border-r border-[#0054a6]/15">
                      {day.displayDate}
                    </td>
                    <td className="py-2 px-4 text-stone-800 border-r border-[#0054a6]/15">
                      <span className="font-medium">{day.route}</span>
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-medium text-stone-900 border-r border-[#0054a6]/15">
                      {day.km.toFixed(1)}
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-stone-900">
                      {day.amount.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Lower Section: Thank You Script + Summary Total Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2 pb-10">
          {/* Left: Thank You Calligraphy Style */}
          <div className="relative text-left">
            <div
              className="text-[#0054a6] text-2xl sm:text-3xl italic font-bold tracking-tight font-serif"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Thank you for your business!
            </div>
            {/* Dynamic underline swoosh matching invoice.png */}
            <svg
              className="w-48 h-4 text-[#0054a6] mt-1"
              viewBox="0 0 200 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5,6 Q 100,16 195,4"
                stroke="#0054a6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Right: 3-Tier Summary Card */}
          <div className="w-full sm:w-72 border-2 border-[#0054a6] rounded-xl overflow-hidden shadow-xs">
            {/* Row 1: TOTAL KM */}
            <div className="grid grid-cols-2 border-b border-[#0054a6]">
              <div className="bg-[#ebf4fb] px-3.5 py-2 text-xs font-black text-[#0054a6] uppercase tracking-wide flex items-center">
                TOTAL KM
              </div>
              <div className="bg-white px-3.5 py-2 text-right text-xs font-black font-mono text-stone-900 flex items-center justify-end">
                {totalKm.toLocaleString('en-ZA', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{' '}
                km
              </div>
            </div>

            {/* Row 2: RATE */}
            <div className="grid grid-cols-2 border-b border-[#0054a6]">
              <div className="bg-[#ebf4fb] px-3.5 py-2 text-xs font-black text-[#0054a6] uppercase tracking-wide flex items-center">
                RATE
              </div>
              <div className="bg-white px-3.5 py-2 text-right text-xs font-black font-mono text-stone-900 flex items-center justify-end">
                R{ratePerKm.toFixed(2)} per km
              </div>
            </div>

            {/* Row 3: TOTAL DUE (Solid Navy Banner) */}
            <div className="grid grid-cols-2 bg-[#004890] text-white">
              <div className="px-3.5 py-3 text-xs font-black uppercase tracking-wider flex items-center">
                TOTAL DUE
              </div>
              <div className="px-3.5 py-3 text-right text-base font-black font-mono flex items-center justify-end">
                R{' '}
                {totalDue.toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Banking Remittance Note */}
        <div className="pt-3 pb-8 text-[11px] text-stone-500 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Banking Details:</strong> {settings.contractorBank} • Account:{' '}
            <span className="font-mono font-bold text-stone-700">
              {settings.contractorAccountNo}
            </span>{' '}
            • Branch: {settings.contractorBranchCode} • Ref:{' '}
            <span className="font-bold text-stone-700">{settings.invoiceNumber}</span>
          </div>
          <div className="font-mono text-[10px]">
            Contract Transport Logbook • 19 Working Days (August &amp; September 2026)
          </div>
        </div>

        {/* Bottom Graphic Blue Swoop Waves matching invoice.png */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            className="w-full h-14 sm:h-20"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lighter cyan background wave */}
            <path
              d="M 0,60 C 200,10 400,90 700,40 C 850,15 950,50 1000,30 L 1000,120 L 0,120 Z"
              fill="#0072ce"
            />
            {/* Dark royal blue foreground wave */}
            <path
              d="M 0,85 C 250,30 500,110 800,45 C 900,20 960,60 1000,40 L 1000,120 L 0,120 Z"
              fill="#004890"
            />
          </svg>
        </div>
      </div>

      {/* PDF Ready Download Modal with embedded viewer */}
      <PdfDownloadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfResult={pdfResult}
        settings={settings}
        onPrint={handlePrint}
        totalDue={totalDue}
        totalKm={totalKm}
        pricingMode={pricingMode}
      />
    </div>
  );
};
