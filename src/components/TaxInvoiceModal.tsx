import React from 'react';
import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';
import type { Order } from '../types/index.ts';
import { BRAND_INFO } from '../data/catalog.ts';

interface TaxInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Determine whether intra-state (UP to UP = CGST 9% + SGST 9%) or inter-state (IGST 18%)
  const isUttarPradesh = order.state.toLowerCase().includes('uttar pradesh') || order.pincode.startsWith('244');
  const isExport = order.type === 'B2B' && (order.city.toLowerCase().includes('dubai') || order.city.toLowerCase().includes('new york') || order.city.toLowerCase().includes('london'));

  const taxableAmount = Math.round(order.subtotal - order.discount);
  const totalGst = isExport ? 0 : Math.round(taxableAmount * 0.18);
  const cgst = isUttarPradesh && !isExport ? Math.round(totalGst / 2) : 0;
  const sgst = isUttarPradesh && !isExport ? Math.round(totalGst / 2) : 0;
  const igst = !isUttarPradesh && !isExport ? totalGst : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-slate-300 flex flex-col overflow-hidden text-slate-900">
        {/* Controls Header */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
              Official Indian GST Tax Invoice (Form GST INV-1)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-amber-400 text-slate-950 rounded font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close invoice modal"
              className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Indian GST Invoice Document */}
        <div className="p-6 sm:p-10 bg-white font-sans text-xs space-y-6 printable-invoice">
          {/* Top Invoice Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded bg-slate-900 text-[#D4AF37] flex items-center justify-center font-bold text-base font-serif">
                  TZ
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 font-serif leading-none">
                    TAG ZEE
                  </h1>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mt-0.5">
                    Moradabad Metal Handicrafts &amp; Luxury Decor
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] mt-2 leading-relaxed">
                {BRAND_INFO.address}<br />
                Email: {BRAND_INFO.corporateEmail} | Contact: {BRAND_INFO.contacts.join(' / ')}
              </p>
              <div className="text-[11px] text-slate-800 font-mono mt-1 space-x-3">
                <span>GSTIN: <strong>{BRAND_INFO.gstin}</strong></span>
                <span>PAN: <strong>AABCT1332L</strong></span>
                <span>State Code: <strong>09 (Uttar Pradesh)</strong></span>
              </div>
            </div>

            <div className="sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B6508] block">
                {isExport ? 'EXPORT TAX INVOICE (LUT)' : 'TAX INVOICE'}
              </span>
              <div className="text-base font-extrabold font-mono text-slate-900 mt-1">
                INV-{order.id.replace('ORD-', '').replace('EXP-B2B-', 'B2B-')}
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Date: <strong>{order.date}</strong>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Place of Supply: <strong>{order.state}</strong>
              </div>
            </div>
          </div>

          {/* Bill To & Ship To Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                DETAILS OF RECEIVER / BILLED TO:
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {order.customerName}
              </div>
              {order.companyName && (
                <div className="text-xs font-semibold text-slate-700">{order.companyName}</div>
              )}
              <div className="text-slate-600 mt-0.5">
                {order.shippingAddress}
              </div>
              <div className="text-slate-700 font-medium">
                {order.city}, {order.state} - {order.pincode}
              </div>
              <div className="text-slate-600 font-mono mt-1">
                Phone: {order.customerPhone}
              </div>
              {order.gstin && (
                <div className="text-slate-900 font-mono text-[11px] font-bold mt-1">
                  Buyer GSTIN: {order.gstin}
                </div>
              )}
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                DISPATCH &amp; PAYMENT PARTICULARS:
              </span>
              <div className="text-slate-700 space-y-1">
                <div>Transport Carrier: <strong>{order.courier || 'Delhivery Express Air'}</strong></div>
                <div>AWB Docket: <strong className="font-mono">{order.awbNumber || 'PENDING'}</strong></div>
                <div>Mode of Payment: <strong>{order.paymentMethod}</strong></div>
                <div>Status: <span className="text-emerald-700 font-bold">{order.paymentStatus}</span></div>
                {isExport && <div>Export Status: <strong>Supply Meant for Export Under LUT Without Payment of IGST</strong></div>}
              </div>
            </div>
          </div>

          {/* Line Items Table with HSN Code 7418 */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description of Goods</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Taxable Val</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{index + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <span className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                      {item.hsnCode || BRAND_INFO.hsnDefault}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{item.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Company Seal Section */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
            {/* Digital Company Seal & Bank Details */}
            <div className="sm:col-span-7 space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <span className="font-bold text-slate-800 block">Bank Remittance Details:</span>
                <div>Bank: <strong>HDFC Bank, Civil Lines Branch, Moradabad</strong></div>
                <div>Account Name: <strong>TAG ZEE ATELIER</strong></div>
                <div>A/C No: <strong>50200084928172</strong> | IFSC: <strong>HDFC0000341</strong></div>
              </div>

              {/* Official Digital Seal & Signature Imprint */}
              <div className="flex items-center gap-4 pt-2">
                {/* Circular Brass Digital Seal */}
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#D4AF37] p-1 flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full border border-[#D4AF37] flex flex-col items-center justify-center text-center p-1 bg-amber-50/50">
                    <span className="text-[8px] font-bold text-[#8B6508] tracking-widest uppercase">
                      TAG ZEE
                    </span>
                    <span className="text-[7px] text-slate-600 uppercase">
                      MORADABAD
                    </span>
                    <div className="w-4 h-0.5 bg-[#D4AF37] my-0.5" />
                    <span className="text-[6px] text-slate-500 font-mono">SEAL 244001</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900 block">For TAG ZEE</span>
                  <div className="font-serif italic text-base text-slate-800 my-0.5">
                    Zeefaham Rais / Atir Rais
                  </div>
                  <span className="text-[10px] text-slate-400 block">Authorised Foundry Signatories</span>
                </div>
              </div>
            </div>

            {/* Calculations & GST Subtotals */}
            <div className="sm:col-span-5 space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span>Gross Taxable Subtotal</span>
                <span className="font-mono font-semibold">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {isUttarPradesh && !isExport && (
                <>
                  <div className="flex justify-between">
                    <span>CGST (9.0%)</span>
                    <span className="font-mono">₹{cgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (9.0%)</span>
                    <span className="font-mono">₹{sgst.toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              {!isUttarPradesh && !isExport && (
                <div className="flex justify-between">
                  <span>IGST (18.0%)</span>
                  <span className="font-mono">₹{igst.toLocaleString('en-IN')}</span>
                </div>
              )}
              {order.shippingFee > 0 && (
                <div className="flex justify-between">
                  <span>Freight / Logistics</span>
                  <span className="font-mono">₹{order.shippingFee.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t-2 border-slate-300">
                <span>Grand Total (INR)</span>
                <span className="font-mono text-[#9E7A1C]">
                  ₹{order.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Terms Footer */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 leading-normal">
            <strong>Declarations:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Subject to Moradabad Jurisdiction only.
          </div>
        </div>
      </div>
    </div>
  );
};
