import React from 'react';
import { X, Check, Calculator, Building, CreditCard, Receipt, Sparkles, MapPin } from 'lucide-react';
import { InvoiceSettings } from '../types/invoice';

interface InvoiceEditorProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InvoiceSettings;
  onUpdateSettings: (newSettings: InvoiceSettings) => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof InvoiceSettings, value: any) => {
    onUpdateSettings({
      ...settings,
      [field]: value,
    });
  };

  const applyTemplatePreset = (contractor: 'bafana' | 'msebenzi') => {
    if (contractor === 'msebenzi') {
      onUpdateSettings({
        ...settings,
        contractorCompany: 'Msebenzi and Maria Transport',
        contractorName: 'Geelbooi Skosana',
        contractorAddress: '2028 Rockdale, Middelburg, 1053',
        contractorPhone: '060 773 8333',
        contractorEmail: 'geelbooiskosana@yahoo.com',
        clientCompany: 'AlageIndustrial (PTY) LTD',
        clientAddress: 'Stand No 9166 Ext16\nMiddelburg, Mhluzi',
        clientName: 'Contact: Mr Xolani Silinda',
        clientTaxNumber: '2022/553989/07',
        ratePerKm: 10.00,
        rateModel: 'per_km',
        invoiceNumber: 'INVOICE NO 5',
        invoiceDate: '25/09/2026',
      });
    } else {
      onUpdateSettings({
        ...settings,
        contractorCompany: 'Msebenzi and Maria Transport',
        contractorName: 'Geelbooi Skosana',
        contractorAddress: '2028 Rockdale, Middelburg, 1053',
        contractorPhone: '060 773 8333',
        contractorEmail: 'geelbooiskosana@yahoo.com',
        clientCompany: 'AlageIndustrial (PTY) LTD',
        clientAddress: 'Stand No 9166 Ext16\nMiddelburg, Mhluzi',
        clientName: 'Contact: Mr Xolani Silinda',
        clientTaxNumber: '2022/553989/07',
        ratePerKm: 10.00,
        rateModel: 'per_km',
        invoiceNumber: 'INVOICE NO 5',
        invoiceDate: '25/09/2026',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0054a6] text-white rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Invoice &amp; Tariff Configuration
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Configure rates, client billing address, and company header details.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Preset Buttons */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#0054a6] dark:text-blue-300">
                <Sparkles className="w-4 h-4" /> Quick Invoice Presets
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Automatically loads addresses and R10.00/km rate from your sample invoice.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => applyTemplatePreset('msebenzi')}
                className="px-3.5 py-1.5 rounded-xl bg-[#0054a6] text-white font-semibold hover:bg-[#004085] transition cursor-pointer shadow-xs"
              >
                Reset to Template (Msebenzi &amp; Maria)
              </button>
            </div>
          </div>

          {/* Rate Model & Tariffs */}
          <div className="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-200 dark:border-stone-700/60 space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#0054a6]" /> Billing Rate
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Rate Per KM (ZAR / R)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-500 font-bold">R</span>
                  <input
                    type="number"
                    step="0.50"
                    value={settings.ratePerKm}
                    onChange={(e) => handleChange('ratePerKm', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-mono text-sm focus:ring-2 focus:ring-[#0054a6] focus:outline-none font-bold"
                  />
                </div>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                  ✓ Configured to R10.00 per km as requested
                </span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Customer ID / Tax Reference
                </label>
                <input
                  type="text"
                  value={settings.clientTaxNumber}
                  onChange={(e) => handleChange('clientTaxNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-mono text-sm"
                  placeholder="2022/553989/07"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Matches customer ID in sample invoice header
                </span>
              </div>
            </div>
          </div>

          {/* Client Details (BILL TO) */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#0054a6]" /> BILL TO (Client Address from Invoice)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.clientCompany}
                  onChange={(e) => handleChange('clientCompany', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={settings.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Physical Address
                </label>
                <textarea
                  rows={2}
                  value={settings.clientAddress}
                  onChange={(e) => handleChange('clientAddress', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>

          {/* Contractor Details (Top Header) */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0054a6]" /> Contractor Header Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Company / Trading Name
                </label>
                <input
                  type="text"
                  value={settings.contractorCompany}
                  onChange={(e) => handleChange('contractorCompany', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  value={settings.contractorAddress}
                  onChange={(e) => handleChange('contractorAddress', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={settings.contractorPhone}
                  onChange={(e) => handleChange('contractorPhone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.contractorEmail}
                  onChange={(e) => handleChange('contractorEmail', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Invoice Number & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Invoice Number Title
              </label>
              <input
                type="text"
                value={settings.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-bold font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Invoice Date
              </label>
              <input
                type="text"
                value={settings.invoiceDate}
                onChange={(e) => handleChange('invoiceDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900"
                placeholder="24/08/2026"
              />
            </div>
          </div>

          {/* Banking Details */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#0054a6]" /> Banking Remittance Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-500 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={settings.contractorBank}
                  onChange={(e) => handleChange('contractorBank', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">Account Number</label>
                <input
                  type="text"
                  value={settings.contractorAccountNo}
                  onChange={(e) => handleChange('contractorAccountNo', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">Branch Code</label>
                <input
                  type="text"
                  value={settings.contractorBranchCode}
                  onChange={(e) => handleChange('contractorBranchCode', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0054a6] hover:bg-[#004085] text-white text-xs font-semibold active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Check className="w-4 h-4" /> Save &amp; Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
