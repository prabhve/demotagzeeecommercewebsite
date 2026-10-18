import React, { useState } from 'react';
import {
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  CreditCard,
  Truck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import type { CartItem, Currency, Order } from '../types/index.ts';
import { formatCurrency, calculateB2CTotals, FREE_SHIPPING_THRESHOLD_INR } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutSuccess: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess,
}) => {
  const [couponInput, setCouponInput] = useState('BRASS10');
  const [appliedCoupon, setAppliedCoupon] = useState('BRASS10');
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('Ananya Deshmukh');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 44521');
  const [customerAddress, setCustomerAddress] = useState('Flat 14B, Royal Palms Tower, Worli Sea Face, Mumbai - 400018');
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay UPI/Cards' | 'Cash on Delivery (COD)'>('Razorpay UPI/Cards');

  if (!isOpen) return null;

  const totals = calculateB2CTotals(items, appliedCoupon);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'BRASS10' || code === 'ROYAL500') {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try BRASS10 for 10% off.');
    }
  };

  const handleProcessCheckout = () => {
    setIsCheckingOut(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        customerName: customerName || 'Ananya Deshmukh',
        customerPhone: customerPhone || '+91 98201 44521',
        customerEmail: 'customer@tagzee-atelier.com',
        shippingAddress: customerAddress || 'Worli Sea Face, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400018',
        type: 'B2C',
        items: items.map((i) => ({
          productName: i.product.name,
          sku: i.product.sku,
          quantity: i.quantity,
          unitPrice: i.product.offerPrice,
          total: i.product.offerPrice * i.quantity,
          hsnCode: i.product.hsnCode,
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shippingFee: totals.shipping,
        gstAmount: totals.gstAmount,
        grandTotal: totals.total,
        paymentMethod,
        paymentStatus: paymentMethod === 'Razorpay UPI/Cards' ? 'Paid' : 'Pending Verification',
        orderStatus: 'Ready for Dispatch',
        awbNumber: `DEL-AIR-${Math.floor(10000000 + Math.random() * 90000000)}`,
        courier: 'Delhivery Air',
      };

      setIsCheckingOut(false);
      onCheckoutSuccess(newOrder);
      onClose();
    }, 900);
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FFFFFF] h-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-between border-l border-slate-200/80 relative">
        {/* Drawer Header */}
        <div className="p-6 sm:p-7 border-b border-slate-200/80 flex items-center justify-between bg-[#FBF9F5]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200/70 flex items-center justify-center text-[#846328] shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#846328] block">
                Atelier Selection
              </span>
              <h2 className="font-serif text-2xl text-slate-950 font-normal">
                Your Shopping Bag ({totalCount})
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart drawer"
            className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FAF8F3] px-6 sm:px-7 py-3.5 border-b border-slate-200/70 text-xs">
          {totals.freeShippingGap > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-[#846328]" />
                  Add <strong className="text-slate-950 font-bold">{formatCurrency(totals.freeShippingGap, currency)}</strong> for Complimentary Express Air Shipping
                </span>
              </div>
              <div className="w-full bg-slate-200/80 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#C5A059] to-[#DFBA73] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((FREE_SHIPPING_THRESHOLD_INR - totals.freeShippingGap) / FREE_SHIPPING_THRESHOLD_INR) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-800 font-medium text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complimentary insured air shipping unlocked across India &amp; global hubs</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F3] border border-slate-200/70 flex items-center justify-center mx-auto text-[#846328]">
                <Sparkles className="w-6 h-6 text-[#C5A059]" />
              </div>
              <h4 className="font-serif text-xl text-slate-950">Your shopping bag is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Discover Moradabad&apos;s royal hand-hammered brassware and hand-forged copper dining pieces.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-2.5 bg-slate-950 hover:bg-[#846328] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative group hover:border-[#C5A059]/40 transition-colors"
              >
                {/* Artwork Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200/60 bg-white">
                  <ProductArtwork productId={item.product.id} />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base text-slate-950 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 tracking-wider uppercase block mt-0.5">
                      {item.product.weightKg} kg · {item.product.pureBrassPurity}
                    </span>
                    <div className="font-semibold text-slate-950 text-sm tabular-nums mt-1.5 font-sans">
                      {formatCurrency(item.product.offerPrice, currency)}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <div className="inline-flex items-center border border-slate-200 rounded-full bg-[#FAF9F5] text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-6 flex items-center justify-center font-bold hover:bg-slate-200 text-slate-700 rounded-l-full cursor-pointer"
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-semibold tabular-nums text-slate-900 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-6 flex items-center justify-center font-bold hover:bg-slate-200 text-slate-700 rounded-r-full cursor-pointer"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Quick Delivery Customer Form (For 1-Click Razorpay) */}
          {items.length > 0 && (
            <div className="mt-6 p-5 bg-[#FAF8F3]/60 rounded-2xl border border-slate-200/80 text-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#846328]">
                  SHIPPING &amp; CONCIERGE DESTINATION
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Ready for Express Dispatch
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 block">Recipient Details</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#C5A059] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Mobile (+91)"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 block">Shipping Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Street address, City, Pincode"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              {/* Payment Method Radio */}
              <div className="pt-2">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1.5">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Razorpay UPI/Cards')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      paymentMethod === 'Razorpay UPI/Cards'
                        ? 'border-[#C5A059] bg-white font-semibold text-slate-950 shadow-xs'
                        : 'border-slate-200 bg-white/70 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#846328]" />
                      <span className="font-sans">Razorpay UPI</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 block mt-1">Instant Confirmation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-[#C5A059] bg-white font-semibold text-slate-950 shadow-xs'
                        : 'border-slate-200 bg-white/70 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#846328]" />
                      <span className="font-sans">Cash on Delivery</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">Pay upon inspection</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 sm:p-7 border-t border-slate-200 bg-white space-y-4">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon (try BRASS10)"
                  className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono bg-[#FAF8F3] border border-slate-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-950 hover:bg-[#846328] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && totals.discount > 0 && (
              <div className="text-[11px] text-emerald-800 font-medium flex items-center justify-between bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <span>Code {appliedCoupon} active (10% Atelier Discount)</span>
                <span className="font-semibold">-{formatCurrency(totals.discount, currency)}</span>
              </div>
            )}
            {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(totals.subtotal, currency)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Artisan Privilege Discount</span>
                  <span className="font-semibold tabular-nums">
                    -{formatCurrency(totals.discount, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Insured Shipping</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-800 font-semibold">Complimentary</span>
                  ) : (
                    formatCurrency(totals.shipping, currency)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Includes 18% GST (CGST + SGST)</span>
                <span className="tabular-nums">{formatCurrency(totals.gstAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-lg font-normal text-slate-950 pt-3 border-t border-slate-200 items-baseline">
                <span className="font-serif">Total Payable</span>
                <span className="text-slate-950 font-semibold tabular-nums font-sans">
                  {formatCurrency(totals.total, currency)}
                </span>
              </div>
            </div>

            {/* 1-Click Razorpay Checkout Button */}
            <button
              onClick={handleProcessCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 px-6 bg-slate-950 hover:bg-[#846328] text-white font-medium rounded-full shadow-[0_4px_20px_rgba(15,23,42,0.15)] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              {isCheckingOut ? (
                <span>Securing with Razorpay Gateway...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-[#DFBA73]" />
                  <span>
                    Pay {formatCurrency(totals.total, currency)} via Razorpay
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-4 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                256-Bit SSL Encrypted
              </span>
              <span>·</span>
              <span>Direct Moradabad Foundry Dispatch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
