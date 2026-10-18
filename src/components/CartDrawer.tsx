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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#D4AF37]/40 relative">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-radial from-[#FFFDF8] to-[#FAF6ED]">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-slate-900">Your Shopping Bag</span>
            <span className="text-xs bg-[#D4AF37]/20 text-[#8B6508] font-bold px-2 py-0.5 rounded-full">
              {items.reduce((sum, i) => sum + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#FAF9F5] px-4 py-2.5 border-b border-slate-200 text-xs">
          {totals.freeShippingGap > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#9E7A1C]" />
                  Add <strong className="text-slate-950 font-bold">{formatCurrency(totals.freeShippingGap, currency)}</strong> more for Free Express Shipping
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#D4AF37] to-[#9E7A1C] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((FREE_SHIPPING_THRESHOLD_INR - totals.freeShippingGap) / FREE_SHIPPING_THRESHOLD_INR) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You have unlocked Complimentary Express Shipping!</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Sparkles className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Your shopping bag is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Discover Moradabad&apos;s royal hammered brassware and hand-forged copper dining pieces.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 relative group"
              >
                {/* Artwork Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#D4AF37]/30 bg-white">
                  <ProductArtwork productId={item.product.id} />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      {item.product.weightKg} kg · {item.product.pureBrassPurity}
                    </span>
                    <div className="font-bold text-slate-900 text-xs tabular-nums mt-1">
                      {formatCurrency(item.product.offerPrice, currency)}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-300 rounded bg-white text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 font-bold hover:bg-slate-100 text-slate-700"
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-semibold tabular-nums text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 font-bold hover:bg-slate-100 text-slate-700"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
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
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Shipping Details</span>
                <span className="text-[10px] text-[#9E7A1C] font-semibold">1-Click Dispatch Ready</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">Customer Name &amp; Phone</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#D4AF37] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">Delivery Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Street address, City, Pincode"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Payment Method Radio */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Razorpay UPI/Cards')}
                    className={`p-2 rounded border text-left text-[11px] transition-all cursor-pointer ${
                      paymentMethod === 'Razorpay UPI/Cards'
                        ? 'border-[#D4AF37] bg-white font-bold text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-slate-100/70 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#9E7A1C]" />
                      <span>Razorpay UPI</span>
                    </div>
                    <span className="text-[9px] text-emerald-700 block mt-0.5">Instant Confirmation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                    className={`p-2 rounded border text-left text-[11px] transition-all cursor-pointer ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-[#D4AF37] bg-white font-bold text-slate-900 shadow-xs'
                        : 'border-slate-200 bg-slate-100/70 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#9E7A1C]" />
                      <span>Cash on Delivery</span>
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Pay at Doorstep</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon (try BRASS10)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs uppercase font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-semibold"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && totals.discount > 0 && (
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
                <span>Code {appliedCoupon} active (10% Off)</span>
                <span>-{formatCurrency(totals.discount, currency)}</span>
              </div>
            )}
            {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {formatCurrency(totals.subtotal, currency)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Artisan Privilege Discount</span>
                  <span className="font-semibold tabular-nums">
                    -{formatCurrency(totals.discount, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Insured Shipping</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatCurrency(totals.shipping, currency)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Includes 18% GST (CGST + SGST)</span>
                <span className="tabular-nums">{formatCurrency(totals.gstAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-[#9E7A1C] tabular-nums font-sans font-extrabold">
                  {formatCurrency(totals.total, currency)}
                </span>
              </div>
            </div>

            {/* 1-Click Razorpay Checkout Button */}
            <button
              onClick={handleProcessCheckout}
              disabled={isCheckingOut}
              className="w-full py-3 px-4 bg-linear-to-r from-[#F5D061] via-[#D4AF37] to-[#C5A059] hover:from-[#FFE285] hover:to-[#DFB73E] text-slate-950 font-extrabold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {isCheckingOut ? (
                <span>Securing with Razorpay Gateway...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Pay {formatCurrency(totals.total, currency)} via Razorpay
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                256-Bit SSL Secured
              </span>
              <span>·</span>
              <span>Direct Moradabad Dispatch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
