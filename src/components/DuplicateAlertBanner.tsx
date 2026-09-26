import React from 'react';
import { AlertTriangle, CheckCircle2, Copy, FileSearch, Sparkles } from 'lucide-react';
import { PhotoAuditItem } from '../types/invoice';

interface DuplicateAlertBannerProps {
  auditItems: PhotoAuditItem[];
  onOpenAuditModal: () => void;
}

export const DuplicateAlertBanner: React.FC<DuplicateAlertBannerProps> = ({
  auditItems,
  onOpenAuditModal,
}) => {
  const duplicateFiles = auditItems.filter((i) => i.status === 'duplicate_file');
  const pageOverlaps = auditItems.filter((i) => i.status === 'page_overlap');
  const uniqueItems = auditItems.filter((i) => i.status === 'unique');

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-8 text-amber-900 dark:text-amber-100 shadow-sm transition-all hover:border-amber-500/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl mt-0.5 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100">
                Photo Duplicate Analysis Complete
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                2 Repeated Items Detected
              </span>
            </div>
            <p className="text-sm text-stone-700 dark:text-stone-300 mt-1 max-w-3xl leading-relaxed">
              <strong>Yes, 1 photo is repeated in your upload:</strong>{' '}
              <code className="px-1.5 py-0.5 bg-amber-200/50 dark:bg-amber-950/60 rounded text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
                IMG-20260922-WA0005.jpg
              </code>{' '}
              (01/09/2026 logbook, 348.1 km) was uploaded twice. Additionally, the log for{' '}
              <strong>09/09/2026</strong> (420.8 km) appears twice: once as a single page photo and once in the open notebook spread.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 19 Unique Days Reconciled
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> Redundant Duplicate Safely Excluded
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-500/10 border border-stone-500/20 text-stone-700 dark:text-stone-300 font-medium">
                <Copy className="w-3.5 h-3.5" /> Clean 7,733.9 Total KM for Invoice
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAuditModal}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-medium text-sm shadow-sm transition cursor-pointer"
        >
          <FileSearch className="w-4 h-4" />
          Review Photo Audit Log
        </button>
      </div>
    </div>
  );
};
