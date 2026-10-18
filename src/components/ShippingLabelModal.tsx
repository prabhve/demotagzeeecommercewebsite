import React from 'react';
import { X, Printer, Package, Truck, ShieldCheck, Check } from 'lucide-react';
import type { Order } from '../types/index.ts';
import { BRAND_INFO } from '../data/catalog.ts';

interface ShippingLabelModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const awb = order.awbNumber || `DEL-AIR-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const courier = order.courier || 'Delhivery Air';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-slate-200/80 flex flex-col overflow-hidden text-slate-900">
        {/* Modal Controls Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-[#C5A059]" />
            <span className="font-semibold text-xs tracking-wider uppercase text-[#DFBA73]">
              Shiprocket Thermal Dispatch Label (4×6)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#DFBA73] text-slate-950 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close shipping label modal"
              className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Shipping Label Container (Exact Standard 4x6 / 6x4 Courier Format) */}
        <div className="p-6 sm:p-8 bg-white font-sans text-xs space-y-4 printable-label">
          {/* Header Strip */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-slate-900 text-[#DFBA73] flex items-center justify-center font-bold text-sm font-serif">
                TZ
              </div>
              <div>
                <div className="font-bold text-base text-slate-900 font-serif leading-none">TAG ZEE</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  Moradabad Metal Artisans
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wide bg-slate-900 text-white px-2 py-0.5 rounded">
                {courier}
              </span>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Routing: {order.state.substring(0, 3).toUpperCase()}/HUB-01
              </div>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="py-2 text-center bg-slate-50 border border-slate-200 rounded p-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
              AWB Air Waybill Number:
            </div>
            {/* SVG Barcode Simulation */}
            <div className="flex items-center justify-center py-1">
              <svg className="w-72 h-14" viewBox="0 0 280 60" xmlns="http://www.w3.org/2000/svg">
                {/* Simulated Code 128 bars */}
                <rect x="10" y="5" width="3" height="45" fill="#111827" />
                <rect x="16" y="5" width="2" height="45" fill="#111827" />
                <rect x="22" y="5" width="5" height="45" fill="#111827" />
                <rect x="30" y="5" width="2" height="45" fill="#111827" />
                <rect x="36" y="5" width="4" height="45" fill="#111827" />
                <rect x="44" y="5" width="2" height="45" fill="#111827" />
                <rect x="50" y="5" width="6" height="45" fill="#111827" />
                <rect x="60" y="5" width="3" height="45" fill="#111827" />
                <rect x="66" y="5" width="2" height="45" fill="#111827" />
                <rect x="72" y="5" width="4" height="45" fill="#111827" />
                <rect x="80" y="5" width="5" height="45" fill="#111827" />
                <rect x="88" y="5" width="2" height="45" fill="#111827" />
                <rect x="94" y="5" width="3" height="45" fill="#111827" />
                <rect x="102" y="5" width="6" height="45" fill="#111827" />
                <rect x="112" y="5" width="2" height="45" fill="#111827" />
                <rect x="118" y="5" width="4" height="45" fill="#111827" />
                <rect x="126" y="5" width="3" height="45" fill="#111827" />
                <rect x="132" y="5" width="5" height="45" fill="#111827" />
                <rect x="142" y="5" width="2" height="45" fill="#111827" />
                <rect x="148" y="5" width="4" height="45" fill="#111827" />
                <rect x="156" y="5" width="6" height="45" fill="#111827" />
                <rect x="166" y="5" width="2" height="45" fill="#111827" />
                <rect x="172" y="5" width="5" height="45" fill="#111827" />
                <rect x="180" y="5" width="3" height="45" fill="#111827" />
                <rect x="188" y="5" width="2" height="45" fill="#111827" />
                <rect x="194" y="5" width="4" height="45" fill="#111827" />
                <rect x="202" y="5" width="6" height="45" fill="#111827" />
                <rect x="212" y="5" width="2" height="45" fill="#111827" />
                <rect x="218" y="5" width="4" height="45" fill="#111827" />
                <rect x="226" y="5" width="5" height="45" fill="#111827" />
                <rect x="236" y="5" width="2" height="45" fill="#111827" />
                <rect x="242" y="5" width="3" height="45" fill="#111827" />
                <rect x="250" y="5" width="6" height="45" fill="#111827" />
                <rect x="260" y="5" width="3" height="45" fill="#111827" />
                <rect x="266" y="5" width="2" height="45" fill="#111827" />
              </svg>
            </div>
            <div className="font-mono font-bold text-sm text-slate-900 tracking-wider">
              {awb}
            </div>
          </div>

          {/* Consignee (Deliver To) and Consignor (Shipped From) */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded-lg p-3">
            {/* Deliver To */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                DELIVER TO (CONSIGNEE):
              </span>
              <div className="font-bold text-sm text-slate-900">
                {order.customerName}
              </div>
              {order.companyName && (
                <div className="font-semibold text-xs text-slate-700">{order.companyName}</div>
              )}
              <div className="text-slate-600 leading-snug">
                {order.shippingAddress}
              </div>
              <div className="font-semibold text-slate-800">
                {order.city}, {order.state} - <span className="font-bold text-slate-900 underline">{order.pincode}</span>
              </div>
              <div className="font-mono text-slate-700 pt-0.5">
                Contact: {order.customerPhone}
              </div>
            </div>

            {/* Shipped From */}
            <div className="space-y-1 border-l border-slate-200 pl-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                SHIPPED FROM (CONSIGNOR):
              </span>
              <div className="font-bold text-slate-900">
                TAG ZEE Atelier &amp; Foundry
              </div>
              <div className="text-slate-500 text-[11px] leading-snug">
                {BRAND_INFO.address}
              </div>
              <div className="text-[11px] text-slate-600 pt-1">
                GSTIN: <span className="font-mono">{BRAND_INFO.gstin}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Dispatch Desk: {BRAND_INFO.primaryPhone}
              </div>
            </div>
          </div>

          {/* Parcel & Payment Details */}
          <div className="grid grid-cols-3 gap-2 text-center border border-slate-200 rounded p-2.5 bg-slate-50 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Payment Type</span>
              <strong className="text-slate-900">{order.paymentMethod}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Invoice Value</span>
              <strong className="text-slate-900 font-mono">₹{order.grandTotal.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Contents / HSN</span>
              <strong className="text-slate-900">Handicrafts (HSN {BRAND_INFO.hsnDefault})</strong>
            </div>
          </div>

          {/* Fragile & Metal Care Warning Footer */}
          <div className="border-t-2 border-slate-900 pt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-bold text-red-700 tracking-wider">
              FRAGILE METAL ARTWARE — HANDLE WITH UTMOST CARE
            </span>
            <span>TAG ZEE Moradabad Authenticity Seal Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
