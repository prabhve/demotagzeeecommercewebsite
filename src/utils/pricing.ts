import type { CartItem, Product, PortOption, RfqCalculation } from '../types/index.ts';

export const USD_EXCHANGE_RATE = 86.5; // INR per USD
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
 * Format currency amount cleanly
 */
export function formatCurrency(amount: number, currency: 'INR' | 'USD'): string {
  if (currency === 'USD') {
    const usdVal = amount / USD_EXCHANGE_RATE;
    return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
 * Calculate full B2B bulk RFQ metrics
 */
export function calculateB2BRfq(
  product: Product,
  quantity: number,
  portId: string
): RfqCalculation {
  const q = Math.max(20, quantity);
  const tier = getB2BTierRate(product, q);
  const subtotalInr = tier.unitPrice * q;
  const subtotalUsd = +(subtotalInr / USD_EXCHANGE_RATE).toFixed(2);

  const totalGrossWeightKg = +(product.weightKg * q * 1.08).toFixed(1); // 8% packaging tare allowance
  const unitsPerCarton = product.unitsPerMasterCarton || 10;
  const totalCartons = Math.ceil(q / unitsPerCarton);
  const totalCbm = +(product.cbmPerUnit * q).toFixed(3);

  const dutyDrawbackInr = Math.round(subtotalInr * RODTEP_EXPORT_DRAWBACK_RATE);

  const port = AVAILABLE_PORTS.find((p) => p.id === portId) || AVAILABLE_PORTS[0];

  const estimatedSeaFreightInr = Math.round(Math.max(1, totalCbm) * port.baseFreightPerCbmInr);
  const estimatedAirFreightInr = Math.round(totalGrossWeightKg * port.airRatePerKgInr);

  return {
    product,
    quantity: q,
    unitPrice: tier.unitPrice,
    slabTier: tier.tierLabel,
    subtotalInr,
    subtotalUsd,
    totalGrossWeightKg,
    totalCartons,
    totalCbm,
    dutyDrawbackInr,
    estimatedSeaFreightInr,
    estimatedAirFreightInr,
    port,
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
 * Format: 2 digits (State Code) + 5 letters (PAN) + 4 digits + 1 letter + 1 digit/letter + Z + 1 check character
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
  const stateName = GST_STATE_MAP[stateCode] || 'Registered Indian State';

  return {
    isValid: true,
    stateCode,
    stateName,
  };
}

/**
 * Estimate delivery based on Indian Pincode
 */
export function estimatePincodeDelivery(pincode: string): {
  deliverable: boolean;
  days: number;
  deliveryDate: string;
  hub: string;
  freeEligible: boolean;
  error?: string;
} {
  const cleanPin = pincode.trim();
  if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return {
      deliverable: false,
      days: 0,
      deliveryDate: '',
      hub: '',
      freeEligible: false,
      error: 'Enter a valid 6-digit Indian Postal Pincode',
    };
  }

  const firstDigit = cleanPin.charAt(0);
  let days = 4;
  let hub = 'North India Regional Hub (Delhi-NCR)';

  if (cleanPin.startsWith('244')) {
    // Moradabad Local
    days = 1;
    hub = 'TAG ZEE Moradabad Atelier (Direct Same-Day / Next-Day Dispatch)';
  } else if (firstDigit === '1' || firstDigit === '2') {
    // Delhi, UP, Punjab, Haryana, HP
    days = 2;
    hub = 'North India Express Transit Hub (Delhi)';
  } else if (firstDigit === '3' || firstDigit === '4') {
    // West: Maharashtra, Gujarat, Rajasthan
    days = 3;
    hub = 'Western Logistics Hub (Bhiwandi / Mumbai)';
  } else if (firstDigit === '5' || firstDigit === '6') {
    // South: Karnataka, TN, Kerala, Telangana, AP
    days = 4;
    hub = 'Southern Air Hub (Bengaluru / Chennai)';
  } else {
    // East / North-East
    days = 5;
    hub = 'Eastern Transit Gateway (Kolkata)';
  }

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  const deliveryDate = targetDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return {
    deliverable: true,
    days,
    deliveryDate,
    hub,
    freeEligible: true,
  };
}
