import type { CartItem, Product, PortOption, RfqCalculation, Currency, Incoterm } from '../types/index.ts';

export const USD_EXCHANGE_RATE = 86.5; // INR per USD
export const EUR_EXCHANGE_RATE = 93.2; // INR per EUR
export const FREE_SHIPPING_THRESHOLD_INR = 2499;
export const STANDARD_SHIPPING_FEE_INR = 250;
export const GST_RATE = 0.18; // 18% GST (CGST 9% + SGST 9% or IGST 18%)
export const RODTEP_EXPORT_DRAWBACK_RATE = 0.035; // 3.5% Export Drawback

export const AVAILABLE_PORTS: PortOption[] = [
  {
    id: 'mundra',
    name: 'Mundra Port (Gujarat)',
    country: 'India',
    type: 'Sea',
    baseFreightPerCbmInr: 2800,
    airRatePerKgInr: 120,
    transitDaysSea: '2-4 Days (Port Gate)',
    transitDaysAir: '1-2 Days',
  },
  {
    id: 'nhava_sheva',
    name: 'Nhava Sheva JNPT (Mumbai)',
    country: 'India',
    type: 'Sea',
    baseFreightPerCbmInr: 3200,
    airRatePerKgInr: 130,
    transitDaysSea: '3-5 Days (Port Gate)',
    transitDaysAir: '1-2 Days',
  },
  {
    id: 'dubai',
    name: 'Jebel Ali Port (Dubai, UAE)',
    country: 'UAE',
    type: 'Sea',
    baseFreightPerCbmInr: 8500,
    airRatePerKgInr: 320,
    transitDaysSea: '8-12 Days Sea',
    transitDaysAir: '2-3 Days Air',
  },
  {
    id: 'london',
    name: 'London Gateway Port (UK)',
    country: 'United Kingdom',
    type: 'Sea',
    baseFreightPerCbmInr: 14200,
    airRatePerKgInr: 580,
    transitDaysSea: '22-28 Days Sea',
    transitDaysAir: '4-5 Days Air',
  },
  {
    id: 'new_york',
    name: 'Port of New York & New Jersey (USA)',
    country: 'United States',
    type: 'Sea',
    baseFreightPerCbmInr: 18500,
    airRatePerKgInr: 690,
    transitDaysSea: '28-35 Days Sea',
    transitDaysAir: '4-6 Days Air',
  },
];

/**
 * Format currency amount cleanly (INR ₹, USD $, EUR €)
 */
export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    const usdVal = amount / USD_EXCHANGE_RATE;
    return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currency === 'EUR') {
    const eurVal = amount / EUR_EXCHANGE_RATE;
    return `€${eurVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Calculate retail discount percent
 */
export function calculateDiscountPercent(mrp: number, offerPrice: number): number {
  if (mrp <= 0 || offerPrice >= mrp) return 0;
  return Math.round(((mrp - offerPrice) / mrp) * 100);
}

/**
 * Calculate B2C cart totals
 */
export function calculateB2CTotals(
  items: CartItem[],
  couponCode: string = ''
): {
  subtotal: number;
  discount: number;
  shipping: number;
  gstAmount: number;
  total: number;
  freeShippingGap: number;
} {
  const subtotal = items.reduce((acc, item) => acc + item.product.offerPrice * item.quantity, 0);

  let discount = 0;
  const normalizedCoupon = couponCode.trim().toUpperCase();
  if (normalizedCoupon === 'BRASS10') {
    discount = Math.round(subtotal * 0.1);
  } else if (normalizedCoupon === 'ROYAL500' && subtotal >= 3000) {
    discount = 500;
  }

  const netSubtotal = Math.max(0, subtotal - discount);
  const shipping = netSubtotal >= FREE_SHIPPING_THRESHOLD_INR || items.length === 0 ? 0 : STANDARD_SHIPPING_FEE_INR;
  const freeShippingGap = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - netSubtotal);

  // Price includes 18% GST (back-calculated for transparency)
  const gstAmount = Math.round(netSubtotal - netSubtotal / (1 + GST_RATE));
  const total = netSubtotal + shipping;

  return {
    subtotal,
    discount,
    shipping,
    gstAmount,
    total,
    freeShippingGap,
  };
}

/**
 * Get B2B tier price based on quantity
 */
export function getB2BTierRate(
  product: Product,
  quantity: number
): {
  unitPrice: number;
  tierLabel: string;
  discountPercent: number;
} {
  const q = Math.max(20, quantity);
  if (q >= product.b2bSlabs.tier3.min) {
    return {
      unitPrice: product.b2bSlabs.tier3.price,
      tierLabel: 'Tier 3 (100+ pcs - Direct Factory Export Rate)',
      discountPercent: product.b2bSlabs.tier3.discountPercent,
    };
  }
  if (q >= product.b2bSlabs.tier2.min) {
    return {
      unitPrice: product.b2bSlabs.tier2.price,
      tierLabel: 'Tier 2 (50-99 pcs - Master Wholesale)',
      discountPercent: product.b2bSlabs.tier2.discountPercent,
    };
  }
  return {
    unitPrice: product.b2bSlabs.tier1.price,
    tierLabel: 'Tier 1 (20-49 pcs - Standard Bulk)',
    discountPercent: product.b2bSlabs.tier1.discountPercent,
  };
}

/**
 * Calculate full B2B bulk RFQ metrics with Incoterms & Pallets
 */
export function calculateB2BRfq(
  product: Product,
  quantity: number,
  portId: string,
  incoterm: Incoterm = 'FOB'
): RfqCalculation {
  const q = Math.max(20, quantity);
  const tier = getB2BTierRate(product, q);

  // Incoterm adjustment factor:
  // Ex-Works: baseline factory price
  // FOB: factory + export documentation, packaging & inland transport to port (+2.5%)
  // CIF: FOB + international ocean freight & cargo insurance (+7.5% approx)
  let unitPrice = tier.unitPrice;
  if (incoterm === 'Ex-Works') {
    unitPrice = Math.round(tier.unitPrice * 0.96); // 4% discount for ex-factory pickup
  } else if (incoterm === 'CIF') {
    unitPrice = Math.round(tier.unitPrice * 1.08); // freight + insurance incorporated
  }

  const subtotalInr = unitPrice * q;
  const subtotalUsd = +(subtotalInr / USD_EXCHANGE_RATE).toFixed(2);
  const subtotalEur = +(subtotalInr / EUR_EXCHANGE_RATE).toFixed(2);

  const totalGrossWeightKg = +(product.weightKg * q * 1.08).toFixed(1); // 8% packaging tare allowance
  const unitsPerCarton = product.unitsPerMasterCarton || 10;
  const totalCartons = Math.ceil(q / unitsPerCarton);
  const totalCbm = +(product.cbmPerUnit * q).toFixed(3);

  // 1 Euro-Pallet holds roughly 1.6 CBM / 500kg
  const totalPallets = Math.max(1, Math.ceil(totalCbm / 1.6));

  const dutyDrawbackInr = Math.round(subtotalInr * RODTEP_EXPORT_DRAWBACK_RATE);

  const port = AVAILABLE_PORTS.find((p) => p.id === portId) || AVAILABLE_PORTS[0];

  const estimatedSeaFreightInr = Math.round(Math.max(1, totalCbm) * port.baseFreightPerCbmInr);
  const estimatedAirFreightInr = Math.round(totalGrossWeightKg * port.airRatePerKgInr);

  return {
    product,
    quantity: q,
    unitPrice,
    slabTier: tier.tierLabel,
    incoterm,
    subtotalInr,
    subtotalUsd,
    subtotalEur,
    totalGrossWeightKg,
    totalCartons,
    totalCbm,
    totalPallets,
    dutyDrawbackInr,
    estimatedSeaFreightInr,
    estimatedAirFreightInr,
    port,
  };
}

/**
 * Quick Bulk Order Sheet Aggregator
 */
export function calculateBulkSheetSummary(
  quantities: Record<string, number>,
  products: Product[]
): {
  totalUnits: number;
  totalGrossWeightKg: number;
  totalCbm: number;
  totalPallets: number;
  totalInr: number;
  itemSummaries: Array<{
    product: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
} {
  let totalUnits = 0;
  let totalGrossWeightKg = 0;
  let totalCbm = 0;
  let totalInr = 0;
  const itemSummaries: Array<{
    product: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }> = [];

  products.forEach((prod) => {
    const qty = quantities[prod.id] || 0;
    if (qty > 0) {
      const tier = getB2BTierRate(prod, qty);
      const sub = tier.unitPrice * qty;
      totalUnits += qty;
      totalInr += sub;
      totalGrossWeightKg += prod.weightKg * qty * 1.08;
      totalCbm += prod.cbmPerUnit * qty;

      itemSummaries.push({
        product: prod,
        quantity: qty,
        unitPrice: tier.unitPrice,
        subtotal: sub,
      });
    }
  });

  const totalPallets = totalCbm > 0 ? Math.max(1, Math.ceil(totalCbm / 1.6)) : 0;

  return {
    totalUnits,
    totalGrossWeightKg: +totalGrossWeightKg.toFixed(1),
    totalCbm: +totalCbm.toFixed(3),
    totalPallets,
    totalInr,
    itemSummaries,
  };
}

/**
 * Indian State GST Codes mapping
 */
const GST_STATE_MAP: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '19': 'West Bengal',
  '24': 'Gujarat',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '36': 'Telangana',
};

/**
 * Validate 15-character Indian GSTIN
 */
export function validateGstin(gstinInput: string): {
  isValid: boolean;
  stateCode?: string;
  stateName?: string;
  error?: string;
} {
  const gstin = gstinInput.trim().toUpperCase();
  if (!gstin) {
    return { isValid: false, error: 'GSTIN cannot be empty' };
  }

  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(gstin)) {
    return {
      isValid: false,
      error: 'Invalid format. Expected 15 characters (e.g., 09AABCT1332L1Z5)',
    };
  }

  const stateCode = gstin.substring(0, 2);
  const stateName = GST_STATE_MAP[stateCode] || 'Other State / Union Territory';

  return {
    isValid: true,
    stateCode,
    stateName,
  };
}

/**
 * Pincode delivery estimator
 */
export function estimatePincodeDelivery(pincodeInput: string): {
  deliverable: boolean;
  days: number;
  deliveryDate: string;
  hub: string;
  error?: string;
} {
  const clean = pincodeInput.trim();
  if (!/^\d{6}$/.test(clean)) {
    return {
      deliverable: false,
      days: 0,
      deliveryDate: '',
      hub: '',
      error: 'Enter a valid 6-digit Indian postal pincode (e.g. 244001, 110001, 400001)',
    };
  }

  // Moradabad local (244xxx)
  if (clean.startsWith('244')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return {
      deliverable: true,
      days: 1,
      deliveryDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      hub: 'TAG ZEE Moradabad Atelier (Direct Same-Day / Next-Day Dispatch)',
    };
  }

  // Delhi NCR / UP / Haryana (11xxxx, 20xxxx, 12xxxx)
  if (clean.startsWith('11') || clean.startsWith('20') || clean.startsWith('12')) {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return {
      deliverable: true,
      days: 2,
      deliveryDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      hub: 'Delhivery NCR Air Cargo Hub',
    };
  }

  // Major Metros (Mumbai 400xxx, Bangalore 560xxx, Kolkata 700xxx, Chennai 600xxx)
  if (
    clean.startsWith('40') ||
    clean.startsWith('56') ||
    clean.startsWith('70') ||
    clean.startsWith('60')
  ) {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return {
      deliverable: true,
      days: 3,
      deliveryDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      hub: 'Blue Dart Express Super-Hub',
    };
  }

  // Rest of India
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return {
    deliverable: true,
    days: 4,
    deliveryDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    hub: 'National Air Express Logistics Network',
  };
}
