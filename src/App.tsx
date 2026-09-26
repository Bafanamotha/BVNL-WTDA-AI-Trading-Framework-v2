/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DEFAULT_INVOICE_SETTINGS,
  INITIAL_PHOTO_AUDIT,
  INITIAL_TRIPS,
} from './data/logbookData';
import { InvoicePricingMode, InvoiceSettings, TripLogEntry } from './types/invoice';
import { Navbar } from './components/Navbar';
import { DuplicateAlertBanner } from './components/DuplicateAlertBanner';
import { ReconciliationCard } from './components/ReconciliationCard';
import { InvoiceView } from './components/InvoiceView';
import { LogbookTable } from './components/LogbookTable';
import { DuplicateAuditModal } from './components/DuplicateAuditModal';
import { InvoiceEditor } from './components/InvoiceEditor';
import { PassengerManifestModal } from './components/PassengerManifestModal';
import { downloadInvoicePdf, GeneratedPdfResult } from './utils/pdfGenerator';
import { PdfDownloadModal } from './components/PdfDownloadModal';
import { ArenaProjectView } from './components/ArenaProjectView';
import { TradingApp } from './trading/TradingApp';

export default function App() {
  const [appMode, setAppMode] = useState<'trading' | 'transport'>('trading');
  const [activeTab, setActiveTab] = useState<'invoice' | 'logbook' | 'trading-framework'>('invoice');
  const [settings, setSettings] = useState<InvoiceSettings>(DEFAULT_INVOICE_SETTINGS);
  const [trips, setTrips] = useState<TripLogEntry[]>(INITIAL_TRIPS);
  const [pricingMode, setPricingMode] = useState<InvoicePricingMode>('raw_trips');

  // Modals
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState<boolean>(false);
  const [pdfResult, setPdfResult] = useState<GeneratedPdfResult | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const ratePerKm = settings.ratePerKm || 10.0;
  const rawSubtotalKm = trips.reduce((sum, t) => sum + t.distanceKm, 0);

  let currentTotalKm = rawSubtotalKm; // 8,127.9 km -> R 81,279.00
  if (pricingMode === 'summary_slip') {
    currentTotalKm = 7723.0;
  } else if (pricingMode === 'exact_logbook') {
    currentTotalKm = 7733.9;
  }
  const currentTotalDue = currentTotalKm * ratePerKm;

  const handlePrint = () => {
    setActiveTab('invoice');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadPdf = () => {
    setActiveTab('invoice');
    try {
      const result = downloadInvoicePdf(settings, trips, pricingMode, 'detailed');
      setPdfResult(result);
      setIsPdfModalOpen(true);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    }
  };

  // If in Trading mode, render the native, fully editable BVNL/WTDA Trading Framework
  if (appMode === 'trading') {
    return <TradingApp onSwitchToInvoice={() => setAppMode('transport')} />;
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-200 dark:selection:bg-amber-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'trading-framework') {
            setAppMode('trading');
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenEditorModal={() => setIsEditorModalOpen(true)}
        onOpenManifestModal={() => setIsManifestModalOpen(true)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        totalDue={currentTotalDue}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Printable Tax Invoice */}
        {activeTab === 'invoice' && (
          <div className="space-y-6">
            <div className="print:hidden">
              <ReconciliationCard
                trips={trips}
                pricingMode={pricingMode}
                onSelectPricingMode={setPricingMode}
                onOpenManifestModal={() => setIsManifestModalOpen(true)}
              />
            </div>
            <InvoiceView
              settings={settings}
              trips={trips}
              pricingMode={pricingMode}
              onSelectPricingMode={setPricingMode}
              onEditSettings={() => setIsEditorModalOpen(true)}
              onUpdateSettings={setSettings}
              onDownloadPdf={handleDownloadPdf}
            />
          </div>
        )}

        {/* Tab 2: Full Logbook Inspector */}
        {activeTab === 'logbook' && (
          <div className="space-y-6">
            <DuplicateAlertBanner
              auditItems={INITIAL_PHOTO_AUDIT}
              onOpenAuditModal={() => setIsAuditModalOpen(true)}
            />
            <LogbookTable
              trips={trips}
              onOpenAuditModal={() => setIsAuditModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: BVNL/WTDA AI Trading Framework */}
        {activeTab === 'trading-framework' && (
          <ArenaProjectView onBackToInvoice={() => setActiveTab('invoice')} />
        )}
      </main>

      {/* Footer */}
      <footer className="print:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Contract Transport Logbook &amp; Invoice Auditor • Middelburg, Mpumalanga
          </div>
          <div className="font-mono text-[11px]">
            19 Working Days Reconciled • Active Invoice: R {currentTotalDue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DuplicateAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditItems={INITIAL_PHOTO_AUDIT}
      />

      <InvoiceEditor
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <PassengerManifestModal
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
        trips={trips}
      />

      <PdfDownloadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfResult={pdfResult}
        settings={settings}
        onPrint={handlePrint}
        totalDue={currentTotalDue}
        totalKm={currentTotalKm}
        pricingMode={pricingMode}
      />
    </div>
  );
}
