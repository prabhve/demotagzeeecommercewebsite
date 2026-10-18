import React, { useState, useMemo } from 'react';
import {
  Ship,
  FileText,
  Sliders,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type { Product, Currency, Incoterm, RfqCalculation, PortOption } from '../types/index.ts';
import { calculateB2BRfq, validateGstin, calculateBulkSheetSummary, AVAILABLE_PORTS } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface B2BExportPortalProps {
  products: Product[];
  currency: Currency;
  onOpenProformaModal: (rfq: RfqCalculation, companyName: string, gstin: string) => void;
  initialSelectedProduct?: Product | null;
}

export const B2BExportPortal: React.FC<B2BExportPortalProps> = ({
  products,
  currency: _currency,
  onOpenProformaModal,
  initialSelectedProduct = null,
}) => {
  // RFQ Active Configuration State
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialSelectedProduct || products[0]
  );
  const [quantity, setQuantity] = useState<number>(100);
  const [incoterm, setIncoterm] = useState<Incoterm>('FOB');
  const [selectedPortId, setSelectedPortId] = useState<string>('port-mundra');

  // Buyer Organization Profile & GSTIN verification
  const [companyName, setCompanyName] = useState<string>('');
  const [buyerGstin, setBuyerGstin] = useState<string>('');
  const [gstinFeedback, setGstinFeedback] = useState<{
    isValid: boolean;
    stateCode?: string;
    stateName?: string;
    error?: string;
  }>({ isValid: false });

  // Multi-SKU Bulk Matrix order state
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>({});

  // Compute live single-SKU RFQ
  const rfq: RfqCalculation = useMemo(() => {
    return calculateB2BRfq(selectedProduct, quantity, selectedPortId, incoterm);
  }, [selectedProduct, quantity, selectedPortId, incoterm]);

  // Compute multi-SKU bulk procurement matrix
  const bulkSummary = useMemo(() => {
    return calculateBulkSheetSummary(bulkQuantities, products);
  }, [bulkQuantities, products]);

  const handleGstinChange = (val: string) => {
    const clean = val.toUpperCase().trim();
    setBuyerGstin(clean);
    if (clean.length === 15) {
      const res = validateGstin(clean);
      setGstinFeedback(res);
    } else {
      setGstinFeedback({
        isValid: false,
        error: clean.length > 0 ? `Incomplete GSTIN (${clean.length}/15 chars)` : undefined,
      });
    }
  };

  const handleBulkQuantityChange = (productId: string, qty: number) => {
    setBulkQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, qty),
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

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-slate-900 pb-28 selection:bg-[#DFBA73]/30">
      {/* Editorial Luxury Header Banner */}
      <div className="bg-[#0F172A] text-white py-12 px-6 sm:px-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#DFBA73]">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              INSTITUTIONAL PROCUREMENT &amp; BULK EXPORT SUITE
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-white tracking-tight">
              Direct Foundry Allocations &amp; Global Logistics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-2xl leading-relaxed">
              Ex-factory Moradabad container pricing, automated Incoterms 2026 calculations, RoDTEP duty drawback tracking, and instant proforma generation.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-xs text-slate-300">
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Strict MOQ</span>
              <strong className="text-[#DFBA73] font-mono text-sm">20 Units / SKU</strong>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">IEC License</span>
              <strong className="text-slate-200 font-mono text-sm">Govt. Certified</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-20">
        {/* INSTITUTIONAL PROCUREMENT SUITE: RFQ & PROFORMA CALCULATOR */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/70 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] tracking-[0.24em] font-semibold uppercase text-[#846328] block">
                ENGINEERED EXPORT VALUATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-950 mt-1">
                Institutional RFQ Configurator
              </h2>
            </div>

            {/* SKU Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-600 whitespace-nowrap">
                Handicraft SKU:
              </label>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const p = products.find((item) => item.id === e.target.value);
                  if (p) setSelectedProduct(p);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-full px-4 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#C5A059] cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Slider, Incoterms & Tax Input */}
            <div className="lg:col-span-7 space-y-8">
              {/* Product Preview Card */}
              <div className="p-5 bg-gradient-to-b from-[#FFFDF9] to-[#FBF9F5] rounded-2xl border border-slate-200/70 flex items-center gap-5">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 bg-white">
                  <ProductArtwork productId={selectedProduct.id} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-slate-950 font-normal">{selectedProduct.name}</h4>
                  <div className="text-xs text-slate-500 font-light">
                    Gross: <strong className="text-slate-800 font-medium">{selectedProduct.grossWeightGrams}g</strong> ({selectedProduct.weightKg} kg) · Volume: <strong className="text-slate-800 font-medium">{selectedProduct.cbmPerUnit} m³</strong>
                  </div>
                  <div className="text-[11px] text-[#846328] font-medium">
                    HSN: {selectedProduct.hsnCode} (Cast Brass Artware) · Packaging: {selectedProduct.unitsPerMasterCarton} pcs/master carton
                  </div>
                </div>
              </div>

              {/* Slider with custom gold thumb */}
              <div className="p-6 bg-[#FBF9F5] rounded-2xl border border-slate-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#C5A059]" />
                      <span>Order Quantity (Strict MOQ: 20 Units)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-light block">
                      Drag slider or specify exact quantity for automated volume tiers.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={20}
                      max={2000}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(20, parseInt(e.target.value) || 20))}
                      className="w-24 px-3 py-1.5 text-center font-semibold font-mono text-xs border border-slate-300 rounded-full bg-white focus:outline-none focus:border-[#C5A059]"
                    />
                    <span className="text-xs text-slate-600 font-medium">Units</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full gold-slider cursor-pointer"
                />

                {/* Minimalist 3-Column Pill Comparison Bar */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-[11px]">
                  <div
                    className={`py-2 px-3 rounded-full border transition-all ${
                      quantity < 50
                        ? 'bg-slate-950 text-[#DFBA73] border-slate-950 font-medium shadow-xs'
                        : 'bg-white border-slate-200/80 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-wider">Tier 1 · 20+ pcs</span>
                    <strong className="font-mono text-xs">₹{selectedProduct.b2bSlabs.tier1.price} / pc</strong>
                  </div>

                  <div
                    className={`py-2 px-3 rounded-full border transition-all ${
                      quantity >= 50 && quantity < 100
                        ? 'bg-slate-950 text-[#DFBA73] border-slate-950 font-medium shadow-xs'
                        : 'bg-white border-slate-200/80 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-wider">Tier 2 · 50+ pcs</span>
                    <strong className="font-mono text-xs">₹{selectedProduct.b2bSlabs.tier2.price} / pc</strong>
                  </div>

                  <div
                    className={`py-2 px-3 rounded-full border transition-all ${
                      quantity >= 100
                        ? 'bg-slate-950 text-[#DFBA73] border-slate-950 font-medium shadow-xs'
                        : 'bg-white border-slate-200/80 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-wider">Tier 3 · 100+ pcs</span>
                    <strong className="font-mono text-xs">₹{selectedProduct.b2bSlabs.tier3.price} / pc</strong>
                  </div>
                </div>
              </div>

              {/* Incoterms Selector */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C5A059]" />
                  <span>Incoterms 2026 Commercial Standard</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Ex-Works', 'FOB', 'CIF'] as Incoterm[]).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setIncoterm(term)}
                      className={`p-3 rounded-2xl border text-center text-xs transition-all cursor-pointer ${
                        incoterm === term
                          ? 'bg-slate-950 text-[#DFBA73] border-slate-950 shadow-xs'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-medium text-xs">{term}</div>
                      <span className="text-[10px] block opacity-75 mt-0.5">
                        {term === 'Ex-Works' && 'Factory Moradabad'}
                        {term === 'FOB' && 'Nhava Sheva / Mundra'}
                        {term === 'CIF' && 'Ocean Freight + Insurance'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Port Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Ship className="w-4 h-4 text-[#C5A059]" />
                  <span>Destination Discharge Port / Terminal</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_PORTS.map((port: PortOption) => (
                    <button
                      key={port.id}
                      type="button"
                      onClick={() => setSelectedPortId(port.id)}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                        selectedPortId === port.id
                          ? 'bg-white border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-medium text-slate-900">{port.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                        <span>Sea Transit: {port.transitDaysSea}</span>
                        <span>Air Cargo: {port.transitDaysAir}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tax Profile / GSTIN Verification */}
              <div className="p-5 bg-[#FBF9F5] rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    Buyer Tax Profile (GSTIN Verification)
                  </label>
                  <span className="text-[10px] text-slate-500 font-light">100% Eligible ITC</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Buyer Legal Business Name"
                    className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:border-[#C5A059]"
                  />
                  <input
                    type="text"
                    maxLength={15}
                    value={buyerGstin}
                    onChange={(e) => handleGstinChange(e.target.value)}
                    placeholder="Enter 15-char Indian GSTIN"
                    className="px-3.5 py-2 text-xs font-mono uppercase bg-white border border-slate-200 rounded-full focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {gstinFeedback.isValid ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong>GSTIN Verified:</strong> Registered in {gstinFeedback.stateName} (Code {gstinFeedback.stateCode}). Fully eligible for Input Tax Credit claims.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      {gstinFeedback.error || 'Enter a valid 15-character Indian GSTIN for tax invoice credit.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Clean Summary Card in Neat Two-Column Rows */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0F172A] text-white p-8 rounded-3xl border border-slate-800 shadow-[0_12px_36px_rgba(15,23,42,0.18)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DFBA73]">
                    INSTITUTIONAL RFQ LEDGER ({rfq.incoterm})
                  </span>
                  <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-mono border border-slate-800">
                    Rate: ₹{rfq.unitPrice} / pc
                  </span>
                </div>

                {/* Logistics Metrics 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px] tracking-wider uppercase">Gross Cargo Weight</span>
                    <strong className="text-lg text-white font-mono">{rfq.totalGrossWeightKg} KG</strong>
                    <span className="text-[10px] text-slate-500 block">incl. 8% wooden crate tare</span>
                  </div>

                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px] tracking-wider uppercase">CBM Cargo Volume</span>
                    <strong className="text-lg text-white font-mono">{rfq.totalCbm} m³</strong>
                    <span className="text-[10px] text-slate-500 block">{rfq.totalCartons} master cartons</span>
                  </div>

                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px] tracking-wider uppercase">Pallet Allocation</span>
                    <strong className="text-lg text-white font-mono">{rfq.totalPallets} Pallets</strong>
                    <span className="text-[10px] text-slate-500 block">Euro-Standard 120×80cm</span>
                  </div>

                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px] tracking-wider uppercase">RoDTEP Rebate</span>
                    <strong className="text-lg text-emerald-400 font-mono">₹{rfq.dutyDrawbackInr.toLocaleString('en-IN')}</strong>
                    <span className="text-[10px] text-slate-500 block">~3.5% Duty Drawback</span>
                  </div>
                </div>

                {/* Neat Two-Column Valuation Rows */}
                <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Batch Quantity</span>
                    <span className="font-mono text-white">{rfq.quantity} Units</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Incoterm &amp; Port</span>
                    <span className="font-mono text-white">{rfq.incoterm} · {rfq.port.name.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Unit Slab Rate</span>
                    <span className="font-mono text-white">₹{rfq.unitPrice} / pc</span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-300 pt-3 border-t border-slate-800">
                    <span>Total Valuation (INR)</span>
                    <span className="font-mono font-semibold text-white text-lg">
                      ₹{rfq.subtotalInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>USD Equivalent (@ 86.5)</span>
                    <span className="font-mono text-[#DFBA73] font-medium">
                      ${rfq.subtotalUsd.toLocaleString('en-US')} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>EUR Equivalent (@ 93.2)</span>
                    <span className="font-mono text-amber-200 font-medium">
                      €{rfq.subtotalEur.toLocaleString('en-US')} EUR
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Printable Proforma & Direct WhatsApp */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onOpenProformaModal(rfq, companyName, buyerGstin)}
                  className="w-full py-4 px-6 bg-slate-950 hover:bg-[#846328] text-white font-medium rounded-full shadow-[0_4px_20px_rgba(15,23,42,0.15)] transition-all flex items-center justify-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <FileText className="w-4 h-4 text-[#DFBA73]" />
                  <span>Generate Instant PDF Proforma Invoice</span>
                </button>

                <button
                  onClick={handleTransmitWhatsApp}
                  className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-700 text-white font-medium rounded-full shadow-[0_4px_20px_rgba(6,78,59,0.15)] transition-all flex items-center justify-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Direct Export Desk (WhatsApp Atir Rais)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Multi-SKU Bulk Procurement Matrix */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/70 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-8">
          <div>
            <span className="text-[10px] tracking-[0.24em] font-semibold uppercase text-[#846328] block">
              MULTI-PRODUCT PROCUREMENT
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-slate-950 mt-1">
              Consolidated Container Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
              Assemble multiple artisanal SKUs into a single combined ocean container or air shipment.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Artisanal SKU</th>
                  <th className="py-3 px-4">HSN Code</th>
                  <th className="py-3 px-4">Gross Wt.</th>
                  <th className="py-3 px-4">Single MRP</th>
                  <th className="py-3 px-4 text-center">Batch Quantity</th>
                  <th className="py-3 px-4 text-right">Applicable Slab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const qty = bulkQuantities[p.id] || 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded border border-slate-200 bg-white overflow-hidden shrink-0">
                          <ProductArtwork productId={p.id} />
                        </div>
                        <div>
                          <div>{p.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{p.hsnCode}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{p.grossWeightGrams}g</td>
                      <td className="py-3.5 px-4 text-slate-400 line-through">₹{p.mrp}</td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          min={0}
                          step={10}
                          value={qty || ''}
                          placeholder="0"
                          onChange={(e) =>
                            handleBulkQuantityChange(p.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center font-mono border border-slate-200 rounded-full bg-white text-slate-900 focus:outline-none focus:border-[#C5A059]"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                        {qty >= 20 ? (
                          <span className="text-emerald-700">Active Wholesale</span>
                        ) : qty > 0 ? (
                          <span className="text-amber-700">Below MOQ (20)</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {bulkSummary.totalUnits > 0 && (
            <div className="p-6 bg-[#FBF9F5] rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold text-slate-900">
                  Consolidated Total: {bulkSummary.totalUnits} Units
                </span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Gross Cargo Weight: <strong>{bulkSummary.totalGrossWeightKg} kg</strong> · Volume: <strong>{bulkSummary.totalCbm} m³</strong> ({bulkSummary.totalPallets} Pallets)
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-mono font-semibold text-slate-950 block">
                  ₹{bulkSummary.totalInr.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500">Ex-factory Moradabad valuation</span>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: Minimalist 3-Column Pill Comparison Bar Rate Card */}
        <section className="space-y-8">
          <div>
            <span className="text-[10px] tracking-[0.24em] font-semibold uppercase text-[#846328] block">
              FACTORY RATE CARD
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-slate-950 mt-1">
              Tiered Volume Pricing Matrix (All Signature SKUs)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
              Transparent wholesale slabs with progressive discounts. Minimum order 20 units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/70 hover:border-[#C5A059]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-white">
                      <ProductArtwork productId={product.id} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-normal text-slate-950 line-clamp-1">{product.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block">{product.sku}</span>
                      <div className="text-[10px] tracking-wider uppercase text-[#846328] font-semibold mt-0.5">
                        Gross: {product.grossWeightGrams}g Solid
                      </div>
                    </div>
                  </div>

                  {/* Clean Minimalist 3-Column Pill Comparison Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                    <div className="py-2 px-1.5 rounded-2xl bg-[#FBF9F5] border border-slate-200/80">
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider">20+ pcs</span>
                      <strong className="text-slate-900 font-mono block text-xs mt-0.5">₹{product.b2bSlabs.tier1.price}</strong>
                      <span className="text-emerald-700 text-[9px] block">-{product.b2bSlabs.tier1.discountPercent}%</span>
                    </div>

                    <div className="py-2 px-1.5 rounded-2xl bg-[#FBF9F5] border border-slate-200/80">
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider">50+ pcs</span>
                      <strong className="text-slate-900 font-mono block text-xs mt-0.5">₹{product.b2bSlabs.tier2.price}</strong>
                      <span className="text-emerald-700 text-[9px] block">-{product.b2bSlabs.tier2.discountPercent}%</span>
                    </div>

                    <div className="py-2 px-1.5 rounded-2xl bg-slate-950 text-[#DFBA73] border border-slate-950">
                      <span className="text-[#DFBA73] block text-[9px] uppercase tracking-wider">100+ pcs</span>
                      <strong className="text-white font-mono block text-xs mt-0.5">₹{product.b2bSlabs.tier3.price}</strong>
                      <span className="text-[#DFBA73] text-[9px] block">Direct</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Retail MRP: ₹{product.mrp}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setQuantity(100);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
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
