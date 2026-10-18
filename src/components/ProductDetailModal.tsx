import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ShoppingBag,
  CreditCard,
  MapPin,
  Share2,
  Check,
} from 'lucide-react';
import type { Currency, Product, Review, User } from '../types/index.ts';
import { formatCurrency, calculateDiscountPercent, estimatePincodeDelivery } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';
import { ProductReviewsSection } from './ProductReviewsSection.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenB2BTabWithProduct?: (product: Product) => void;
  reviews?: Review[];
  currentUser?: User | null;
  onAddReview?: (newReview: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  onOpenB2BTabWithProduct,
  reviews = [],
  currentUser = null,
  onAddReview = () => {},
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pincode, setPincode] = useState('244001');
  const [deliveryResult, setDeliveryResult] = useState(() => estimatePincodeDelivery('244001'));
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const discountPercent = calculateDiscountPercent(product.mrp, product.offerPrice);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const result = estimatePincodeDelivery(pincode);
    setDeliveryResult(result);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/40 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product modal"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Visual Artwork Frame & Zoom */}
          <div className="md:col-span-6 flex flex-col">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-radial from-[#FFFDF8] to-[#F1E8D2] flex items-center justify-center">
              <ProductArtwork productId={product.id} zoom={isZoomed} />

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Toggle Zoom"
                className="absolute bottom-3 right-3 z-20 p-2 rounded-full bg-white/90 shadow-md text-slate-800 hover:text-[#9E7A1C] border border-slate-200 transition-transform active:scale-95 cursor-pointer"
                title={isZoomed ? 'Zoom Out' : 'Zoom In 2X'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              {/* Purity & Origin Floating Pill */}
              <div className="absolute top-3 left-3 bg-[#111827] text-[#D4AF37] px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs border border-[#D4AF37]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>{product.pureBrassPurity}</span>
              </div>
            </div>

            {/* Quick Spec Badges under photo */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="block text-slate-400 text-[10px]">Alloy Standard</span>
                <span className="font-bold text-slate-800">Virgin Ingot</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="block text-slate-400 text-[10px]">Net Weight</span>
                <span className="font-bold text-slate-800">{product.weightKg} kg</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="block text-slate-400 text-[10px]">HSN Code</span>
                <span className="font-bold text-slate-800">{product.hsnCode}</span>
              </div>
            </div>

            {/* Wholesale Callout */}
            {onOpenB2BTabWithProduct && (
              <div className="mt-4 p-3 bg-[#FFFDF0] rounded-xl border border-[#D4AF37]/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-950 block">Planning a commercial bulk order?</span>
                  <span className="text-amber-800">Export slab starts at ₹{product.b2bSlabs.tier3.price}/unit</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenB2BTabWithProduct(product);
                  }}
                  className="px-3 py-1.5 bg-[#111827] text-[#D4AF37] font-bold rounded-lg hover:bg-slate-800 transition-colors text-[11px] shrink-0"
                >
                  View B2B RFQ
                </button>
              </div>
            )}
          </div>

          {/* Right Column: PDP Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category, Rating & Share */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-[#8B6508] uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount} reviews)</span>
                  </div>
                  {onToggleWishlist && (
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-1 transition-colors cursor-pointer ${
                        isWishlisted ? 'text-rose-500 fill-current' : 'text-slate-400 hover:text-rose-500'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      aria-label="Wishlist"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                    title="Copy Link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Title & SKU */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
                {product.name}
              </h2>
              <div className="text-[11px] text-slate-400 mt-0.5">
                SKU: <span className="font-mono">{product.sku}</span> · Artisan: {product.artisanName}
              </div>

              {/* Pricing Block */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {formatCurrency(product.offerPrice, currency)}
                  </span>
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatCurrency(product.mrp, currency)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Price inclusive of all taxes (18% GST). Free shipping over ₹2,499.</span>
                </div>
              </div>

              {/* Short Description & Bullet Features */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                {product.description}
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Pincode Delivery Estimator */}
              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#9E7A1C]" />
                  <span>Check Delivery &amp; COD Availability</span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37] font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Check
                  </button>
                </form>

                {deliveryResult.deliverable ? (
                  <div className="mt-2 text-[11px] text-emerald-700 space-y-0.5">
                    <div className="font-semibold flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>Estimated Delivery by {deliveryResult.deliveryDate} ({deliveryResult.days} {deliveryResult.days === 1 ? 'day' : 'days'})</span>
                    </div>
                    <div className="text-slate-500">
                      Dispatched via {deliveryResult.hub} · Cash on Delivery available
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-[11px] text-red-600">
                    {deliveryResult.error || 'Please enter a valid 6-digit postal code.'}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Bar */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200/60 rounded-l-lg disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold tabular-nums text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200/60 rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 bg-linear-to-r from-[#F5D061] to-[#D4AF37] hover:from-[#FFE285] hover:to-[#DFB73E] text-slate-950 font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag ({formatCurrency(product.offerPrice * quantity, currency)})</span>
                </button>
              </div>

              {/* COD & Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Cash on Delivery (COD) Available
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9E7A1C]" />
                  Tamper-Proof Wooden Crate Packing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Customer Reviews & Ratings Section */}
        <div className="px-6 pb-8 border-t border-slate-200/80 bg-slate-50/40">
          <ProductReviewsSection
            productId={product.id}
            reviews={reviews}
            currentUser={currentUser}
            onAddReview={onAddReview}
          />
        </div>
      </div>
    </div>
  );
};
