import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileWarning, Eye, ArrowRight, ShieldCheck } from 'lucide-react';
import { PhotoAuditItem } from '../types/invoice';

interface DuplicateAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditItems: PhotoAuditItem[];
}

export const DuplicateAuditModal: React.FC<DuplicateAuditModalProps> = ({
  isOpen,
  onClose,
  auditItems,
}) => {
  const [filter, setFilter] = useState<'all' | 'duplicates' | 'unique'>('all');

  if (!isOpen) return null;

  const filteredItems = auditItems.filter((item) => {
    if (filter === 'duplicates') {
      return item.status === 'duplicate_file' || item.status === 'page_overlap';
    }
    if (filter === 'unique') {
      return item.status === 'unique' || item.status === 'summary_sheet';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Logbook Photo Audit &amp; Duplicate Check
              </h2>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Detailed breakdown of all 21 uploaded items, checking for repeated images and overlapping pages.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Comparison Box */}
        <div className="p-6 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-3">
            Summary of Identified Repeat / Overlapping Items
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duplicate #1 */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-amber-300 dark:border-amber-800 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  Exact Duplicate File
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono">
                  Repeated 2x
                </span>
              </div>
              <p className="font-mono text-sm font-bold text-stone-800 dark:text-stone-100 mb-1">
                IMG-20260922-WA0005.jpg
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-2">
                <strong>Log Date:</strong> 01 September 2026 | <strong>Vehicle:</strong> KHF 235 MP | <strong>348.1 KM</strong>
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-xs text-amber-900 dark:text-amber-200">
                Uploaded as item #4 and item #17 in the upload batch. It contains the exact same photo. We have included this day only <strong>once</strong> in the invoice.
              </div>
            </div>

            {/* Overlap #2 */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-blue-300 dark:border-blue-800 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                  Page Overlap in Notebook
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                  Multi-Shot Capture
                </span>
              </div>
              <p className="font-mono text-sm font-bold text-stone-800 dark:text-stone-100 mb-1">
                IMG-20260922-WA0011 &amp; WA0013
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-2">
                <strong>Log Date:</strong> 09 September 2026 | <strong>Vehicle:</strong> KHF 235 MP | <strong>420.8 KM</strong>
              </p>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-xs text-blue-900 dark:text-blue-200">
                WA0011 is a close-up photo of 09/09/2026. WA0013 shows the whole open notebook with 08/09 on bottom and the same 09/09 on top. We resolved this so 09/09 is billed only once.
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/40">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
              }`}
            >
              All Items ({auditItems.length})
            </button>
            <button
              onClick={() => setFilter('duplicates')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                filter === 'duplicates'
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
              }`}
            >
              Duplicates &amp; Overlaps (3)
            </button>
            <button
              onClick={() => setFilter('unique')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                filter === 'unique'
                  ? 'bg-emerald-600 text-white'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
              }`}
            >
              Unique Days &amp; Summary (18)
            </button>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Total Working Days: <strong>19 Days</strong>
          </span>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredItems.map((item, idx) => {
            const isDuplicate = item.status === 'duplicate_file';
            const isOverlap = item.status === 'page_overlap';
            const isSummary = item.status === 'summary_sheet';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isDuplicate
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                    : isOverlap
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                    : isSummary
                    ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60'
                    : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                      #{idx + 1}
                    </span>
                    <span className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {item.fileName}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        isDuplicate
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                          : isOverlap
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                          : isSummary
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {item.dateReference}
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {item.distanceKm > 0 ? `${item.distanceKm} KM` : ''}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2">
                  {item.description}
                </p>

                <div className="mt-2 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800 font-mono">
                  {item.pageContent}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Verified with handwritten summary slip: <strong>19 Days reconciled</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-medium hover:opacity-90 active:scale-95 transition cursor-pointer"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
