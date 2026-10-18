import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Check,
  Sparkles,
  Share2,
  ZoomIn,
  ZoomOut,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import type { Product, Currency, Review, User } from '../types/index.ts';
import { formatCurrency, calculateDiscountPercent } from '../utils/pricing.ts';
import { estimatePincodeDelivery } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';
import { ProductReviewsSection } from './ProductReviewsSection.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  isOpen?: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenB2BTabWithProduct?: (product: Product) => void;
  reviews?: Review[];
  onAddReview?: (newReview: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  currentUser?: User | null;
  onOpenAuth?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isOpen = true,
  onClose,
  onAddToCart,
  onOpenB2BTabWithProduct = () => {},
  reviews = [],
  onAddReview = () => {},
  currentUser = null,
  onOpenAuth = () => {},
  isWishlisted = false,
  onToggleWishlist = () => {},
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<ReturnType<typeof estimatePincodeDelivery> | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !product) return null;

  const discountPercent = calculateDiscountPercent(product.mrp, product.offerPrice);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) return;
    const result = estimatePincodeDelivery(pincode);
    setDeliveryResult(result);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-slate-200/80 flex flex-col">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product modal"
          className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Private Showroom Consultation Body */}
        <div className="p-8 sm:p-12 space-y-12">
          {/* Two-Column Layout with 40px Gap (gap-10) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Left Column: Visual Artwork Frame & Zoom */}
            <div className="md:col-span-6 flex flex-col space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-200/60 bg-gradient-to-b from-white to-[#FBF9F5] flex items-center justify-center p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <ProductArtwork productId={product.id} zoom={isZoomed} />

                {/* Zoom Button */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  aria-label="Toggle Zoom"
                  className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-800 hover:text-[#846328] border border-slate-200/60 transition-transform active:scale-95 cursor-pointer"
                  title={isZoomed ? 'Zoom Out' : 'Zoom In 2X'}
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                {/* Provenance Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/90 text-[#DFBA73] px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 shadow-sm border border-slate-800">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>{product.pureBrassPurity}</span>
                </div>
              </div>

              {/* Quick Spec Markers under photo */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-[#FBF9F5] rounded-xl border border-slate-200/50">
                  <span className="block text-slate-400 text-[10px] tracking-wider uppercase">Alloy Grade</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">Virgin Ingot</span>
                </div>
                <div className="p-3 bg-[#FBF9F5] rounded-xl border border-slate-200/50">
                  <span className="block text-slate-400 text-[10px] tracking-wider uppercase">Cast Density</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{product.grossWeightGrams}g Solid</span>
                </div>
                <div className="p-3 bg-[#FBF9F5] rounded-xl border border-slate-200/50">
                  <span className="block text-slate-400 text-[10px] tracking-wider uppercase">Origin</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">Moradabad, UP</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Details & Private Showroom Order Desk */}
            <div className="md:col-span-6 flex flex-col space-y-6">
              {/* Category, SKU, and Share */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-[#846328]">
                  {product.category} · SKU: {product.sku}
                </span>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-950 cursor-pointer"
                  title="Share link to this piece"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Piece'}</span>
                </button>
              </div>

              {/* Product Headline in Cormorant Garamond */}
              <div className="space-y-1.5">
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-950 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-[#846328] font-light italic">
                  &ldquo;{product.emotionalHook}&rdquo;
                </p>
              </div>

              {/* Star Rating Overview */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-[#C5A059]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold text-slate-900 text-sm">{product.rating}</span>
                </div>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-light">
                  {product.reviewCount} Connoisseur Reviews
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                  100% Verified Moradabad GI
                </span>
              </div>

              {/* Luxury Price Display */}
              <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-semibold text-slate-950 tabular-nums font-sans">
                      {formatCurrency(product.offerPrice, currency)}
                    </span>
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      {formatCurrency(product.mrp, currency)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs font-semibold bg-[#C5A059]/15 text-[#846328] px-2 py-0.5 rounded-full">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-light block mt-1">
                    Inclusive of GST &amp; Artisanal Surcharge · Free Express Door Delivery
                  </span>
                </div>
              </div>

              {/* Description & Finish */}
              <div className="space-y-2 text-xs text-slate-600 font-light leading-relaxed">
                <p>{product.description}</p>
                <div className="pt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-slate-700 font-normal">
                  <span><strong>Finish:</strong> {product.finish}</span>
                  <span><strong>Dimensions:</strong> {product.dimensionsCm.length} × {product.dimensionsCm.width} × {product.dimensionsCm.height} cm</span>
                </div>
              </div>

              {/* Golden 4-Badge Trust Strip (Styled with thin hairline dividers and soft icons) */}
              <div className="py-4 border-y border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="leading-tight">100% Solid Virgin Brass</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="leading-tight">5-Yr Anti-Tarnish Baked Lacquer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="leading-tight">Shatter-Proof Export Wooden Crate</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="leading-tight">7-Day Transit Replacement</span>
                </div>
              </div>

              {/* Delivery Estimation Form */}
              <div className="space-y-2">
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit delivery pincode (e.g. 110001, 244001)"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-full focus:outline-none focus:border-[#C5A059] focus:bg-white text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-medium cursor-pointer transition-colors shrink-0"
                  >
                    Check Speed
                  </button>
                </form>

                {deliveryResult && (
                  <div className="p-3 bg-[#FBF9F5] rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        Estimated Delivery: {deliveryResult.deliveryDate}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800">{deliveryResult.hub}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light">
                      Fulfilled via BlueDart / Delhivery Air Express from Moradabad Foundry. Cash on Delivery eligible.
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart Desk */}
              <div className="pt-2 flex items-center gap-4">
                <div className="flex items-center border border-slate-200/80 rounded-full bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-slate-700 font-semibold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-semibold text-xs text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-slate-700 font-semibold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3.5 px-6 rounded-full bg-slate-950 hover:bg-[#846328] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(15,23,42,0.15)] transition-all duration-300 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · {formatCurrency(product.offerPrice * quantity, currency)}</span>
                </button>
              </div>

              {/* COD & Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-[#C5A059]" />
                  Cash on Delivery &amp; UPI
                </span>
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  In Stock · Ready for Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Product Reviews & Star Ratings Section */}
          <div className="pt-10 border-t border-slate-200/60">
            <ProductReviewsSection
              productId={product.id}
              reviews={productReviews}
              onAddReview={onAddReview}
              currentUser={currentUser}
              onOpenAuthModal={onOpenAuth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
