import React, { useState } from 'react';
import {
  Building2,
  Ship,
  Plane,
  FileText,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  DollarSign,
  Package,
  ArrowRight,
  ExternalLink,
  Layers,
  Calculator,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { Currency, Product, RfqCalculation, Incoterm } from '../types/index.ts';
import { BRAND_INFO } from '../data/catalog.ts';
import {
  formatCurrency,
  AVAILABLE_PORTS,
  calculateB2BRfq,
  getB2BTierRate,
  validateGstin,
  calculateBulkSheetSummary,
} from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface B2BExportPortalProps {
  products: Product[];
  currency: Currency;
  onOpenProformaModal: (rfq: RfqCalculation, companyName: string, gstin: string) => void;
  initialSelectedProduct?: Product | null;
}

export const B2BExportPortal: React.FC<B2BExportPortalProps> = ({
  products,
  currency,
  onOpenProformaModal,
  initialSelectedProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialSelectedProduct || products[0]
  );
  const [quantity, setQuantity] = useState<number>(100);
  const [selectedPortId, setSelectedPortId] = useState<string>('mundra');
  const [incoterm, setIncoterm] = useState<Incoterm>('FOB');
  const [companyName, setCompanyName] = useState<string>('Regal Haven Living LLC');
  const [buyerGstin, setBuyerGstin] = useState<string>('09AABCT1332L1Z5');
  const [gstinFeedback, setGstinFeedback] = useState(() => validateGstin('09AABCT1332L1Z5'));

  // Quick Bulk Order Sheet Matrix state (quantities for all 6 SKUs)
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>({
    'tz-urli-royal-01': 50,
    'tz-peacock-lamp-02': 30,
    'tz-copper-cutlery-03': 20,
    'tz-moroccan-lantern-04': 40,
    'tz-brass-planter-05': 0,
    'tz-dhokra-statuette-06': 25,
  });

  const rfq = calculateB2BRfq(selectedProduct, quantity, selectedPortId, incoterm);
  const bulkSummary = calculateBulkSheetSummary(bulkQuantities, products);

  const handleGstinChange = (val: string) => {
    setBuyerGstin(val);
    setGstinFeedback(validateGstin(val));
  };

  const handleBulkQuantityChange = (productId: string, val: number) => {
    setBulkQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleTransmitWhatsApp = () => {
    const text = encodeURIComponent(
      `*TAG ZEE B2B WHOLESALE & EXPORT RFQ INQUIRY*\n` +
      `----------------------------------------\n` +
      `*Buyer / Company:* ${companyName || 'Export Buyer'}\n` +
      `*GSTIN / Tax ID:* ${buyerGstin || 'Export Registered'}\n` +
      `*SKU:* ${rfq.product.sku} - ${rfq.product.name}\n` +
      `*Order Quantity:* ${rfq.quantity} units (MOQ 20+)\n` +
      `*Incoterm:* ${rfq.incoterm}\n` +
      `*Unit Rate:* ₹${rfq.unitPrice} / pc (${rfq.slabTier})\n` +
      `*Total Value:* ₹${rfq.subtotalInr.toLocaleString('en-IN')} (~$${rfq.subtotalUsd} / €${rfq.subtotalEur})\n` +
      `*Volume:* ${rfq.totalCbm} CBM | ${rfq.totalGrossWeightKg} KG | ${rfq.totalCartons} Cartons | ${rfq.totalPallets} Pallets\n` +
      `*Discharge Port:* ${rfq.port.name} (${rfq.port.country})\n` +
      `*Duty Drawback Benefit:* ₹${rfq.dutyDrawbackInr}\n` +
      `----------------------------------------\n` +
      `Kindly confirm production schedule and factory gate readiness.`
    );
    window.open(`https://wa.me/917351366786?text=${text}`, '_blank');
  };

  const handleTransmitBulkSheetWhatsApp = () => {
    const itemsList = bulkSummary.itemSummaries
      .map((item) => `• ${item.product.name} (${item.product.sku}): ${item.quantity} pcs @ ₹${item.unitPrice}`)
      .join('\n');

    const text = encodeURIComponent(
      `*TAG ZEE B2B MULTI-SKU BULK MATRIX INQUIRY*\n` +
      `----------------------------------------\n` +
      `*Company:* ${companyName || 'Wholesale Buyer'}\n` +
      `*Tax ID / GSTIN:* ${buyerGstin || 'N/A'}\n` +
      `*Items Requested (${bulkSummary.totalUnits} units total):*\n${itemsList}\n\n` +
      `*Aggregate Valuation:* ₹${bulkSummary.totalInr.toLocaleString('en-IN')}\n` +
      `*Estimated Cargo Volume:* ${bulkSummary.totalCbm} m³ (${bulkSummary.totalPallets} Pallets, ${bulkSummary.totalGrossWeightKg} kg)\n` +
      `*Port of Export:* Mundra / Nhava Sheva (Incoterm: FOB)\n` +
      `----------------------------------------\n` +
      `Atir Rais / Zeefaham Rais, please verify production run slot.`
    );
    window.open(`https://wa.me/917351366786?text=${text}`, '_blank');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-slate-900 pb-16">
      {/* Golden B2B Wholesale Active Banner */}
      <div className="bg-linear-to-r from-[#111827] via-[#1F2937] to-[#111827] text-white border-b-2 border-[#D4AF37] py-4 px-4 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37] text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  B2B WHOLESALE &amp; BULK EXPORT ACTIVE
                </span>
                <span className="text-[10px] bg-amber-500/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/40 font-mono font-semibold">
                  Factory-Direct Ex-Moradabad Pricing
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Direct export container allocations from Moradabad Foundry. Strict MOQ 20 units per SKU.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-slate-400">Export Director Line:</span>
            <a
              href="https://wa.me/917351366786?text=Hello%20Atir%20Rais,%20inquiring%20about%20TAG%20ZEE%20B2B%20Wholesale%20Catalog"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct WhatsApp to Atir Rais</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* B2B Trust Points Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-[#D4AF37]/30 shadow-xs flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#9E7A1C] shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">AQL 2.5 Strict Quality Audit</span>
              <span className="text-[11px] text-slate-500">Dual stage metallurgical inspection before crate sealing.</span>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#D4AF37]/30 shadow-xs flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#9E7A1C] shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">Instant GST Input Tax Credit</span>
              <span className="text-[11px] text-slate-500">Automated HSN 7418 e-invoicing for 100% tax claim.</span>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#D4AF37]/30 shadow-xs flex items-center gap-3">
            <Ship className="w-6 h-6 text-[#9E7A1C] shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">FOB / CIF Export Ready</span>
              <span className="text-[11px] text-slate-500">Custom barcoded, sea-worthy fumigated palletization.</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Interactive Bulk RFQ & Proforma Generator Engine */}
        <section className="bg-white rounded-2xl border-2 border-[#D4AF37]/50 shadow-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-[#8B6508] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>The Exporter&apos;s Profit Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
                Interactive Export RFQ &amp; Proforma Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Configure real factory production batches, Incoterms, sea/air freight parameters, CBM load volumes, and RoDTEP export drawbacks.
              </p>
            </div>

            {/* Quick SKU Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Select Handicraft SKU:
              </label>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const p = products.find((item) => item.id === e.target.value);
                  if (p) setSelectedProduct(p);
                }}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-[#D4AF37]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Left Column: Sliders, Inputs & Logistics Selection */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Preview Card */}
              <div className="p-4 bg-radial from-[#FFFDF8] to-[#F8F4EA] rounded-xl border border-[#D4AF37]/30 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                  <ProductArtwork productId={selectedProduct.id} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-serif">{selectedProduct.name}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Unit Gross Weight: <strong className="text-slate-800">{selectedProduct.grossWeightGrams}g</strong> ({selectedProduct.weightKg} kg) · CBM: <strong className="text-slate-800">{selectedProduct.cbmPerUnit} m³</strong>
                  </div>
                  <div className="text-xs text-amber-900 font-semibold mt-1">
                    HSN: {selectedProduct.hsnCode} (Brass Artware) · Master Packaging: {selectedProduct.unitsPerMasterCarton} pcs/carton
                  </div>
                </div>
              </div>

              {/* Strict MOQ Quantity Slider (20 to 1,000 units) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#9E7A1C]" />
                      <span>Order Quantity (Strict MOQ: 20 Units)</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Drag slider or type exact batch size for automated slab discount.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={20}
                      max={2000}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(20, parseInt(e.target.value) || 20))}
                      className="w-24 px-2 py-1 text-center font-bold font-mono text-sm border-2 border-[#D4AF37] rounded-lg bg-white"
                    />
                    <span className="text-xs font-bold text-slate-700">Units</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />

                {/* Slab Indicators on Slider */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                  <div className={`p-1.5 rounded border ${quantity < 50 ? 'bg-[#D4AF37]/20 border-[#D4AF37] font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <span>Tier 1 (20 - 49 pcs)</span>
                    <strong className="block text-slate-800">₹{selectedProduct.b2bSlabs.tier1.price}/pc</strong>
                  </div>
                  <div className={`p-1.5 rounded border ${quantity >= 50 && quantity < 100 ? 'bg-[#D4AF37]/20 border-[#D4AF37] font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <span>Tier 2 (50 - 99 pcs)</span>
                    <strong className="block text-slate-800">₹{selectedProduct.b2bSlabs.tier2.price}/pc</strong>
                  </div>
                  <div className={`p-1.5 rounded border ${quantity >= 100 ? 'bg-[#D4AF37]/20 border-[#D4AF37] font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <span>Tier 3 (100+ pcs)</span>
                    <strong className="block text-slate-800">₹{selectedProduct.b2bSlabs.tier3.price}/pc (Direct Export)</strong>
                  </div>
                </div>
              </div>

              {/* Incoterms Selector */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#9E7A1C]" />
                  <span>International Commercial Terms (Incoterms 2026)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Ex-Works', 'FOB', 'CIF'] as Incoterm[]).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setIncoterm(term)}
                      className={`p-2.5 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                        incoterm === term
                          ? 'bg-[#111827] text-[#D4AF37] border-[#D4AF37] font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="font-bold">{term}</div>
                      <span className="text-[10px] block opacity-80">
                        {term === 'Ex-Works' && 'Factory Moradabad'}
                        {term === 'FOB' && 'Port Loaded'}
                        {term === 'CIF' && 'Freight & Insured'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Port Selection */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Ship className="w-4 h-4 text-[#9E7A1C]" />
                  <span>Destination Discharge Port / Terminal</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_PORTS.map((port) => (
                    <button
                      key={port.id}
                      type="button"
                      onClick={() => setSelectedPortId(port.id)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        selectedPortId === port.id
                          ? 'bg-white border-[#D4AF37] shadow-xs ring-1 ring-[#D4AF37]'
                          : 'bg-white/70 border-slate-200 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{port.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                        <span>Sea: {port.transitDaysSea}</span>
                        <span>Air: {port.transitDaysAir}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Indian GSTIN Auto-Validation Simulator */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    B2B Buyer Tax Profile (GSTIN Verification)
                  </label>
                  <span className="text-[10px] text-slate-500">100% Input Tax Credit</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Legal Entity Name"
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    maxLength={15}
                    value={buyerGstin}
                    onChange={(e) => handleGstinChange(e.target.value)}
                    placeholder="Enter 15-char GSTIN (e.g. 09AABCT1332L1Z5)"
                    className="px-3 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {gstinFeedback.isValid ? (
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong>GSTIN Verified:</strong> Registered in State Code {gstinFeedback.stateCode} ({gstinFeedback.stateName}). Eligible for CGST+SGST or IGST ITC claims.
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      {gstinFeedback.error || 'Enter a valid 15-character Indian GSTIN for tax invoice credit.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Instant Cost Ledger & Proforma Actions */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-[#111827] text-white p-6 rounded-2xl border border-[#D4AF37]/50 shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Instant RFQ Ledger ({rfq.incoterm})
                  </span>
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    Rate: ₹{rfq.unitPrice} / pc
                  </span>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Total Gross Weight</span>
                    <strong className="text-base text-white font-mono">{rfq.totalGrossWeightKg} KG</strong>
                    <span className="text-[10px] text-slate-400 block">incl. 8% crate tare</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">CBM Cargo Volume</span>
                    <strong className="text-base text-white font-mono">{rfq.totalCbm} m³</strong>
                    <span className="text-[10px] text-slate-400 block">in {rfq.totalCartons} master cartons</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Pallet Allocation</span>
                    <strong className="text-base text-white font-mono">{rfq.totalPallets} Pallets</strong>
                    <span className="text-[10px] text-slate-400 block">Euro-Standard 120x80cm</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">RoDTEP Duty Rebate</span>
                    <strong className="text-base text-emerald-400 font-mono">₹{rfq.dutyDrawbackInr.toLocaleString('en-IN')}</strong>
                    <span className="text-[10px] text-slate-400 block">~3.5% Export Rebate</span>
                  </div>
                </div>

                {/* Subtotal Total Summary */}
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Batch Quantity</span>
                    <span className="font-mono text-white">{rfq.quantity} Units</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Incoterm &amp; Port</span>
                    <span className="font-mono text-white">{rfq.incoterm} · {rfq.port.name.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Unit Rate</span>
                    <span className="font-mono text-white">₹{rfq.unitPrice} / pc</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300 pt-2 border-t border-slate-800">
                    <span>Total RFQ Value (INR)</span>
                    <span className="font-mono font-bold text-white text-base">
                      ₹{rfq.subtotalInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>USD Equivalent (@ 86.5)</span>
                    <span className="font-mono text-[#D4AF37] font-semibold">
                      ${rfq.subtotalUsd.toLocaleString('en-US')} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>EUR Equivalent (@ 93.2)</span>
                    <span className="font-mono text-amber-200 font-semibold">
                      €{rfq.subtotalEur.toLocaleString('en-US')} EUR
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Printable Proforma & WhatsApp to Atir Rais */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onOpenProformaModal(rfq, companyName, buyerGstin)}
                  className="w-full py-3 px-4 bg-linear-to-r from-[#F5D061] to-[#D4AF37] hover:from-[#FFE285] hover:to-[#DFB73E] text-slate-950 font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Instant PDF Proforma Invoice</span>
                </button>

                <button
                  onClick={handleTransmitWhatsApp}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Transmit RFQ to Atir Rais on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Quick Bulk Order Sheet (Matrix Grid) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-[#8B6508] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#D4AF37]" />
                <span>Single-Page Wholesale Matrix</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                Quick Bulk Order Sheet (Multi-SKU Aggregator)
              </h3>
              <p className="text-xs text-slate-500">
                Enter target unit quantities across multiple Moradabad SKUs to aggregate container loads and export valuations.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Total Active Bulk Units</span>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {bulkSummary.totalUnits} Units
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pt-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3">Item / SKU</th>
                  <th className="py-2.5 px-3">Unit Gross Wt.</th>
                  <th className="py-2.5 px-3">Tier 1 (20-49)</th>
                  <th className="py-2.5 px-3">Tier 2 (50-99)</th>
                  <th className="py-2.5 px-3">Tier 3 (100+)</th>
                  <th className="py-2.5 px-3 text-center">Batch Order Qty</th>
                  <th className="py-2.5 px-3 text-right">Line Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => {
                  const qty = bulkQuantities[prod.id] || 0;
                  const tier = getB2BTierRate(prod, qty);
                  const lineTotal = qty > 0 ? tier.unitPrice * qty : 0;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded border border-slate-200 bg-white overflow-hidden shrink-0">
                            <ProductArtwork productId={prod.id} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{prod.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{prod.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {prod.grossWeightGrams}g
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        ₹{prod.b2bSlabs.tier1.price}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        ₹{prod.b2bSlabs.tier2.price}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-900 bg-amber-50/50">
                        ₹{prod.b2bSlabs.tier3.price}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleBulkQuantityChange(prod.id, Math.max(0, qty - 10))}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            value={qty}
                            onChange={(e) =>
                              handleBulkQuantityChange(prod.id, parseInt(e.target.value) || 0)
                            }
                            className="w-16 text-center font-mono font-bold text-xs py-1 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleBulkQuantityChange(prod.id, qty + 10)}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {qty > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Matrix Aggregate Summary Bar */}
          <div className="mt-6 p-4 bg-slate-900 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs w-full md:w-auto">
              <div>
                <span className="text-slate-400 block text-[10px]">Total Order Units</span>
                <strong className="text-base font-mono text-[#D4AF37]">{bulkSummary.totalUnits} Units</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Gross Cargo Weight</span>
                <strong className="text-base font-mono text-white">{bulkSummary.totalGrossWeightKg} KG</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Container Load</span>
                <strong className="text-base font-mono text-white">{bulkSummary.totalCbm} m³ ({bulkSummary.totalPallets} Pallets)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Multi-SKU Valuation</span>
                <strong className="text-base font-mono text-emerald-400">₹{bulkSummary.totalInr.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleTransmitBulkSheetWhatsApp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Transmit Matrix to Atir Rais</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: Tiered Volume Pricing Matrix Cards (All SKUs) */}
        <section className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-[#8B6508]">
              Factory Rate Card
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Tiered Volume Pricing Matrix (All 6 Signature SKUs)
            </h3>
            <p className="text-xs text-slate-500">
              Clear wholesale slabs with transparent discounts from single-piece retail MRP. Minimum order 20 units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-3 items-center mb-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                      <ProductArtwork productId={product.id} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{product.sku}</span>
                      <div className="text-[10px] text-[#8B6508] font-semibold">Gross: {product.grossWeightGrams}g</div>
                    </div>
                  </div>

                  {/* 3 Tier Slabs Table */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-600 font-medium">Tier 1 (20 - 49 pcs)</span>
                      <div className="text-right">
                        <strong className="text-slate-900 font-mono">₹{product.b2bSlabs.tier1.price}</strong>
                        <span className="text-[10px] text-emerald-700 block font-semibold">
                          Save {product.b2bSlabs.tier1.discountPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-amber-50/60 rounded border border-amber-200/60">
                      <span className="text-amber-950 font-medium">Tier 2 (50 - 99 pcs)</span>
                      <div className="text-right">
                        <strong className="text-slate-900 font-mono">₹{product.b2bSlabs.tier2.price}</strong>
                        <span className="text-[10px] text-emerald-700 block font-semibold">
                          Save {product.b2bSlabs.tier2.discountPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-[#111827] text-white rounded">
                      <span className="text-[#D4AF37] font-bold">Tier 3 (100+ pcs Export)</span>
                      <div className="text-right">
                        <strong className="text-white font-mono">₹{product.b2bSlabs.tier3.price}</strong>
                        <span className="text-[10px] text-[#D4AF37] block font-semibold">
                          Direct Factory ({product.b2bSlabs.tier3.discountPercent}% Off)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Retail MRP: ₹{product.mrp}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setQuantity(100);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Configure RFQ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
