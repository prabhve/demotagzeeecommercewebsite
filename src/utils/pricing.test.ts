import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDiscountPercent,
  calculateB2CTotals,
  getB2BTierRate,
  calculateB2BRfq,
  validateGstin,
  estimatePincodeDelivery,
  formatCurrency,
  calculateBulkSheetSummary,
  AVAILABLE_PORTS,
} from './pricing.ts';
import type { Product, CartItem } from '../types/index.ts';

const mockProduct: Product = {
  id: 'urli-01',
  sku: 'TZ-URLI-01',
  name: 'Royal Hand-Hammered Brass Urli Bowl',
  category: 'Metal Handicrafts',
  mrp: 2499,
  offerPrice: 1850,
  b2bSlabs: {
    tier1: { min: 20, max: 49, price: 1150, discountPercent: 38 },
    tier2: { min: 50, max: 99, price: 950, discountPercent: 48 },
    tier3: { min: 100, max: 10000, price: 780, discountPercent: 58 },
  },
  pureBrassPurity: '99.8% Pure Virgin Brass',
  finish: 'Royal Mirror Brass Gold with Clear Antique Lacquer',
  weightKg: 2.4,
  grossWeightGrams: 1850,
  emotionalHook: 'The Conversation Starter of Your Living Room',
  dimensionsCm: { length: 32, width: 32, height: 12 },
  cbmPerUnit: 0.016,
  unitsPerMasterCarton: 10,
  stock: 45,
  inStock: true,
  hsnCode: '7418',
  description: 'Artisanal Moradabad urli bowl.',
  features: ['Hand-hammered', 'Virgin Brass'],
  careInstructions: 'Wipe with soft cotton cloth',
  artisanProvenance: 'Jigar Colony Atelier, Moradabad',
  artisanName: 'Master Zeefaham Rais',
  rating: 4.9,
  reviewCount: 142,
  imageAlt: 'Royal Brass Urli Bowl',
  tags: ['Brass', 'Urli', 'Pooja', 'Home Decor'],
};

test('calculateDiscountPercent returns correct percentage', () => {
  const discount = calculateDiscountPercent(2499, 1850);
  assert.equal(discount, 26);
  assert.equal(calculateDiscountPercent(1000, 1000), 0);
  assert.equal(calculateDiscountPercent(1000, 1200), 0);
});

test('calculateB2CTotals handles free shipping threshold and BRASS10 coupon', () => {
  const items: CartItem[] = [
    { product: mockProduct, quantity: 1 }, // 1850 (< 2499 threshold)
  ];

  const resultWithoutCoupon = calculateB2CTotals(items, '');
  assert.equal(resultWithoutCoupon.subtotal, 1850);
  assert.equal(resultWithoutCoupon.discount, 0);
  assert.equal(resultWithoutCoupon.shipping, 250);
  assert.equal(resultWithoutCoupon.total, 2100);
  assert.equal(resultWithoutCoupon.freeShippingGap, 649);

  // With 2 items: 3700 (> 2499 threshold)
  const items2: CartItem[] = [{ product: mockProduct, quantity: 2 }];
  const resultFreeShipping = calculateB2CTotals(items2, '');
  assert.equal(resultFreeShipping.subtotal, 3700);
  assert.equal(resultFreeShipping.shipping, 0);
  assert.equal(resultFreeShipping.total, 3700);

  // With BRASS10 coupon: 10% off
  const resultWithCoupon = calculateB2CTotals(items2, 'BRASS10');
  assert.equal(resultWithCoupon.discount, 370);
  assert.equal(resultWithCoupon.total, 3330);
});

test('getB2BTierRate enforces MOQ 20 and tiers correctly', () => {
  // Test tier 1 (20-49)
  const t1 = getB2BTierRate(mockProduct, 25);
  assert.equal(t1.unitPrice, 1150);
  assert.equal(t1.discountPercent, 38);

  // Test tier 2 (50-99)
  const t2 = getB2BTierRate(mockProduct, 60);
  assert.equal(t2.unitPrice, 950);
  assert.equal(t2.discountPercent, 48);

  // Test tier 3 (100+)
  const t3 = getB2BTierRate(mockProduct, 250);
  assert.equal(t3.unitPrice, 780);
  assert.equal(t3.discountPercent, 58);
});

test('calculateB2BRfq computes weight, cartons, CBM, and duty drawback', () => {
  const rfq = calculateB2BRfq(mockProduct, 100, 'mundra', 'FOB');
  assert.equal(rfq.quantity, 100);
  assert.equal(rfq.unitPrice, 780);
  assert.equal(rfq.subtotalInr, 78000);
  assert.equal(rfq.totalCartons, 10); // 100 units / 10 per carton
  assert.equal(rfq.totalCbm, 1.6); // 0.016 * 100
  assert.equal(rfq.dutyDrawbackInr, Math.round(78000 * 0.035)); // 2730
  assert.equal(rfq.port.id, 'mundra');
});

test('validateGstin checks 15-char Indian GSTIN correctly', () => {
  // Valid UP GSTIN (09 prefix)
  const validGstin = validateGstin('09AABCT1332L1Z5');
  assert.equal(validGstin.isValid, true);
  assert.equal(validGstin.stateCode, '09');
  assert.equal(validGstin.stateName, 'Uttar Pradesh');

  // Invalid GSTIN (too short)
  const invalidGstin = validateGstin('09AABCT1332');
  assert.equal(invalidGstin.isValid, false);
  assert.ok(invalidGstin.error);
});

test('estimatePincodeDelivery estimates accurately for Moradabad and regions', () => {
  // Moradabad pin 244001
  const moradabadEst = estimatePincodeDelivery('244001');
  assert.equal(moradabadEst.deliverable, true);
  assert.equal(moradabadEst.days, 1);

  // Delhi pin 110001
  const delhiEst = estimatePincodeDelivery('110001');
  assert.equal(delhiEst.deliverable, true);
  assert.equal(delhiEst.days, 2);

  // Invalid pin
  const invalidPin = estimatePincodeDelivery('123');
  assert.equal(invalidPin.deliverable, false);
});

test('formatCurrency formats INR, USD, and EUR correctly', () => {
  const inr = formatCurrency(1000, 'INR');
  assert.equal(inr, '₹1,000');

  const usd = formatCurrency(8650, 'USD');
  assert.equal(usd, '$100.00');

  const eur = formatCurrency(9320, 'EUR');
  assert.equal(eur, '€100.00');
});

test('calculateB2BRfq computes Incoterms, EUR subtotal, and Pallet counts', () => {
  const rfqFob = calculateB2BRfq(mockProduct, 100, 'dubai', 'FOB');
  assert.equal(rfqFob.incoterm, 'FOB');
  assert.ok(rfqFob.subtotalEur > 0);
  assert.equal(rfqFob.totalPallets, 1);

  const rfqExWorks = calculateB2BRfq(mockProduct, 100, 'dubai', 'Ex-Works');
  assert.ok(rfqExWorks.unitPrice < rfqFob.unitPrice); // Ex-Works discount
});

test('calculateBulkSheetSummary aggregates multi-SKU units, gross weight, and CBM', () => {
  const summary = calculateBulkSheetSummary({ 'urli-01': 50 }, [mockProduct]);
  assert.equal(summary.totalUnits, 50);
  assert.ok(summary.totalInr > 0);
  assert.ok(summary.totalGrossWeightKg > 0);
  assert.equal(summary.itemSummaries.length, 1);
});

