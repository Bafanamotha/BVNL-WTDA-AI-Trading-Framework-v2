import React from 'react';
import {
  FileText,
  Table,
  ShieldAlert,
  Printer,
  Sliders,
  Users,
  CheckCircle,
  Download,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'invoice' | 'logbook' | 'trading-framework';
  onSelectTab: (tab: 'invoice' | 'logbook' | 'trading-framework') => void;
  onOpenAuditModal: () => void;
  onOpenEditorModal: () => void;
  onOpenManifestModal: () => void;
  onPrint: () => void;
  onDownloadPdf?: () => void;
  totalDue?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuditModal,
  onOpenEditorModal,
  onOpenManifestModal,
  onPrint,
  onDownloadPdf,
  totalDue = 81279.0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 print:hidden transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0054a6] text-white flex items-center justify-center font-black text-base shadow-xs">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm tracking-tight">
                Msebenzi &amp; Maria Transport
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Invoice R {Math.round(totalDue).toLocaleString('en-ZA')}
              </span>
            </div>
            <p className="text-[11px] text-stone-500">Transport &amp; Quantitative Trading Hub</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="hidden md:flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => onSelectTab('invoice')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'invoice'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tax Invoice</span>
            <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-500/20">
              R 81,279
            </span>
          </button>
          <button
            onClick={() => onSelectTab('logbook')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'logbook'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Logbook &amp; Manifest (24 Trips)
          </button>
          <button
            onClick={() => onSelectTab('trading-framework')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'trading-framework'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
            title="Open BVNL/WTDA AI Trading Framework"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-bold">BVNL/WTDA AI Trading</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 rounded font-mono">v2</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Duplicate check button */}
          <button
            onClick={onOpenAuditModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-500/20 transition cursor-pointer"
            title="Check repeated and duplicate photos"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Duplicates:</span>
            <span className="underline decoration-amber-400 underline-offset-2">1 Repeat</span>
          </button>

          {/* Passenger directory */}
          <button
            onClick={onOpenManifestModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            Passengers
          </button>

          {/* Rate Editor */}
          <button
            onClick={onOpenEditorModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Rates</span>
          </button>

          {/* Download PDF button */}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 transition shadow-xs cursor-pointer"
              title="Download invoice as an A4 PDF document"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          )}

          {/* Print button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 active:scale-95 transition shadow-xs cursor-pointer"
            title="Open browser print preview"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Mobile subtabs */}
      <div className="flex md:hidden border-t border-stone-200 dark:border-stone-800 px-4 py-2 bg-stone-50 dark:bg-stone-850 gap-2 text-xs">
        <button
          onClick={() => onSelectTab('invoice')}
          className={`flex-1 py-1.5 rounded-lg font-medium text-center ${
            activeTab === 'invoice'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
              : 'text-stone-600'
          }`}
        >
          Invoice (R 81k)
        </button>
        <button
          onClick={() => onSelectTab('logbook')}
          className={`flex-1 py-1.5 rounded-lg font-medium text-center ${
            activeTab === 'logbook'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
              : 'text-stone-600'
          }`}
        >
          Logbook
        </button>
        <button
          onClick={() => onSelectTab('trading-framework')}
          className={`flex-1 py-1.5 rounded-lg font-medium text-center ${
            activeTab === 'trading-framework'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-indigo-600 dark:text-indigo-400'
          }`}
        >
          AI Trading
        </button>
      </div>
    </header>
  );
};
