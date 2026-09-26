export interface Passenger {
  id: number;
  name: string;
}

export type InvoicePricingMode = 'exact_logbook' | 'summary_slip' | 'raw_trips';

export interface TripLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "24 August 2026"
  month: 'August' | 'September';
  vehiclePlate: string; // e.g. "KHF 235 MP", "JTT 374 MP", "LNL 926 MP"
  driverName?: string;
  route: string; // e.g. "Middelburg -> Training Center"
  distanceKm: number; // e.g. 294.0
  passengers: string[];
  passengerCount: number;
  photoSourceFile: string;
  isDuplicatePhoto?: boolean;
  notes?: string;
  ratePerKm?: number;
}

export interface PhotoAuditItem {
  fileName: string;
  dateReference: string;
  vehicle: string;
  distanceKm: number;
  status: 'unique' | 'duplicate_file' | 'page_overlap' | 'summary_sheet';
  statusLabel: string;
  duplicateOf?: string;
  description: string;
  includedInInvoice: boolean;
  pageContent: string;
}

export interface InvoiceSettings {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string; // 'ZAR' or 'R'
  rateModel: 'per_km' | 'per_day' | 'per_trip' | 'custom';
  ratePerKm: number;
  ratePerDay: number;
  ratePerTrip: number;
  vatRate: number; // 0 or 15%
  isVatRegistered: boolean;
  vatNumber?: string;
  discount: number;
  contractorName: string;
  contractorCompany: string;
  contractorPhone: string;
  contractorEmail: string;
  contractorAddress: string;
  contractorBank: string;
  contractorAccountNo: string;
  contractorBranchCode: string;
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientTaxNumber: string;
  purchaseOrderNo: string;
  notes: string;
}
