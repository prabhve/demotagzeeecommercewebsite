import React from 'react';
import { X, Printer, FileText, Download, Building2, Ship, Phone } from 'lucide-react';
import type { RfqCalculation } from '../types/index.ts';
import { BRAND_INFO } from '../data/catalog.ts';

interface ProformaModalProps {
  rfq: RfqCalculation | null;
  companyName: string;
  gstin: string;
  onClose: () => void;
}

export const ProformaModal: React.FC<ProformaModalProps> = ({
  rfq,
  companyName,
  gstin,
  onClose,
}) => {
  if (!rfq) return null;

  const handlePrint = () => {
    window.print();
  };

  const proformaNumber = `PI-TZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-slate-200/80 flex flex-col overflow-hidden text-slate-900">
        {/* Controls Bar */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-[#C5A059]" />
            <span className="font-semibold text-xs tracking-wider uppercase text-[#DFBA73]">
              Commercial Proforma Invoice &amp; Export Quotation
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#DFBA73] text-slate-950 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close proforma modal"
              className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 bg-white font-sans text-xs space-y-6 printable-proforma">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded bg-slate-900 text-[#DFBA73] flex items-center justify-center font-bold text-base font-serif">
                  TZ
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900 leading-none">TAG ZEE</h2>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mt-0.5">
                    Export Division — Moradabad Foundries (India)
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] mt-2 leading-relaxed">
                {BRAND_INFO.address}<br />
                EPC Reg No: {BRAND_INFO.exportCouncilReg} | GSTIN: {BRAND_INFO.gstin}
              </p>
            </div>

            <div className="text-right bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                PROFORMA INVOICE
              </span>
              <div className="text-sm font-extrabold font-mono text-slate-900 mt-0.5">
                {proformaNumber}
              </div>
              <div className="text-slate-500 text-[11px]">Date: <strong>{dateStr}</strong></div>
              <div className="text-[10px] text-slate-400">Validity: 30 Calendar Days</div>
            </div>
          </div>

          {/* Consignee & Port Routing */}
          <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                BUYER / APPLICANT:
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {companyName || 'Registered Export Partner'}
              </div>
              {gstin && <div className="text-slate-600 font-mono mt-0.5">Tax ID / GSTIN: {gstin}</div>}
              <div className="text-slate-500 text-[11px] mt-1">
                Commercial Procurement Entity
              </div>
            </div>

            <div className="border-l border-slate-200 pl-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                SHIPPING &amp; LOGISTICS PARAMETERS:
              </span>
              <div>Discharge Port: <strong>{rfq.port.name}</strong></div>
              <div>Estimated Transit: <strong>{rfq.port.transitDaysSea}</strong></div>
              <div>Terms: <strong>FOB Nhava Sheva / CIF {rfq.port.name}</strong></div>
            </div>
          </div>

          {/* SKU Specs Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Batch Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (INR)</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                  <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{rfq.product.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      SKU: {rfq.product.sku} · {rfq.product.pureBrassPurity}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Volume: {rfq.totalCbm} CBM · Gross Weight: {rfq.totalGrossWeightKg} KG ({rfq.totalCartons} Cartons)
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">{rfq.product.hsnCode}</td>
                  <td className="py-3 px-3 text-center font-bold font-mono">{rfq.quantity} pcs</td>
                  <td className="py-3 px-3 text-right font-mono">₹{rfq.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{rfq.subtotalInr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#8B6508]">
                    ${rfq.subtotalUsd.toLocaleString('en-US')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Export Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            <div className="sm:col-span-7 space-y-2 text-[11px] text-slate-600">
              <span className="font-bold text-slate-800 block">Export Payment &amp; Production Terms:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Production Lead Time: 18-24 Days from receipt of advance deposit.</li>
                <li>Payment: 30% Advance T/T Wire, 70% against Bill of Lading (B/L) copy.</li>
                <li>Packing: Individual bubble-wrap, corrugated inner box, 7-ply export master carton with poly strapping.</li>
                <li>RoDTEP / Duty Drawback: ~3.5% (approx ₹{rfq.dutyDrawbackInr}) applied on Indian customs export shipping bill.</li>
              </ul>
            </div>

            <div className="sm:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal (Ex-Works)</span>
                <span className="font-mono font-bold">₹{rfq.subtotalInr.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Sea Freight Estimate</span>
                <span className="font-mono">₹{rfq.estimatedSeaFreightInr.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t-2 border-slate-300">
                <span>Total Quotation</span>
                <span className="font-mono text-[#9E7A1C]">
                  ${rfq.subtotalUsd.toLocaleString('en-US')} USD
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="block text-slate-400 text-[10px]">Prepared by:</span>
              <strong className="text-slate-900">Atir Rais &amp; Zeefaham Rais</strong>
              <div className="text-[10px] text-slate-500">Executive Partners, TAG ZEE Moradabad</div>
            </div>
            <div className="text-right">
              <span className="block text-slate-400 text-[10px]">Accepted &amp; Confirmed by Buyer:</span>
              <div className="w-36 border-b border-slate-300 mt-4" />
              <span className="text-[10px] text-slate-400">Authorised Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
