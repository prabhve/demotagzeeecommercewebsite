import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  Truck,
  RotateCcw,
  Star,
  Flame,
  Award,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Heart,
  Building2,
} from 'lucide-react';
import type { Currency, Product } from '../types/index.ts';
import { BRAND_INFO } from '../data/catalog.ts';
import { formatCurrency, calculateDiscountPercent } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface B2CStorefrontProps {
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onSwitchToB2B: () => void;
  searchQuery: string;
  savedItemIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const B2CStorefront: React.FC<B2CStorefrontProps> = ({
  products,
  currency,
  onAddToCart,
  onSelectProduct,
  onSwitchToB2B,
  searchQuery,
  savedItemIds = [],
  onToggleWishlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [heroZoom, setHeroZoom] = useState(false);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Metal Handicrafts', 'Home & Kitchen', 'Garden Decor', 'Ornaments'];

  const heroUrli = products.find((p) => p.id.includes('urli')) || products[0];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* SECTION: Hero Banner (Editorial 2-Column Split) */}
      <section className="relative overflow-hidden bg-radial from-[#FFFDF7] via-[#FAF7F0] to-[#F5EFE0] border-b border-[#D4AF37]/25 py-8 sm:py-12 md:py-16">
        {/* Subtle Watermark Mandala Motif */}
        <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
          <svg viewBox="0 0 600 600" className="w-[800px] h-[800px] text-amber-900">
            <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="300" cy="300" r="220" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 8" />
            <circle cx="300" cy="300" r="150" fill="none" stroke="currentColor" strokeWidth="3" />
            <polygon points="300,50 350,250 550,300 350,350 300,550 250,350 50,300 250,250" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand Copy & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#8B6508] tracking-wider uppercase">
                <span className="w-5 h-px bg-[#D4AF37]" />
                <span>Royal Moradabad Heritage Atelier</span>
                <span className="w-5 h-px bg-[#D4AF37]" />
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-serif leading-[1.2]">
                The Grandeur of <span className="text-[#9E7A1C] underline decoration-[#D4AF37]/40">Moradabad Metal Craftsmanship</span> in Modern Living Spaces.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Hand-hammered by 3rd-generation master artisans using 100% solid virgin brass and food-safe alloy purity. Experience sacred deepaks, banquet cutlery, fluted planters, and antique heirlooms.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-6 py-3.5 bg-linear-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#E5C158] hover:to-[#D4AE6A] text-slate-950 font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer text-sm"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Shop Retail Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={onSwitchToB2B}
                  className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-50 border-2 border-[#D4AF37] rounded-lg font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#9E7A1C]" />
                  <span>B2B Wholesale Catalog</span>
                  <span className="text-xs font-semibold text-[#9E7A1C]">(MOQ 20+)</span>
                </button>
              </div>

              {/* Credibility & Trust Markers Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#D4AF37]/30 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#9E7A1C] shrink-0" />
                  <div>
                    <span className="font-bold block text-slate-900">100% Solid Brass</span>
                    <span className="text-slate-500">Virgin Ingot Metallurgy</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#9E7A1C] shrink-0" />
                  <div>
                    <span className="font-bold block text-slate-900">Anti-Tarnish Seal</span>
                    <span className="text-slate-500">5-Year Radiant Glow</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#9E7A1C] shrink-0" />
                  <div>
                    <span className="font-bold block text-slate-900">Direct Foundry</span>
                    <span className="text-slate-500">Jigar Colony Moradabad</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-Resolution Interactive Frame */}
            <div className="lg:col-span-5">
              <div className="relative bg-white p-3 rounded-2xl border border-[#D4AF37]/40 shadow-xl overflow-hidden group">
                {/* Brass Purity Badge */}
                <div className="absolute top-6 left-6 z-20 bg-slate-900/90 text-[#D4AF37] backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#D4AF37]/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{heroUrli.pureBrassPurity}</span>
                </div>

                {/* Live Zoom Affordance Toggle */}
                <button
                  onClick={() => setHeroZoom(!heroZoom)}
                  aria-label="Toggle interactive zoom"
                  className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/90 text-slate-800 hover:text-[#9E7A1C] shadow-md border border-slate-200 transition-transform active:scale-95 cursor-pointer"
                  title={heroZoom ? 'Reset Zoom' : 'Interactive 2X Zoom'}
                >
                  <ZoomIn className={`w-4 h-4 ${heroZoom ? 'text-[#9E7A1C]' : ''}`} />
                </button>

                {/* Hero Frame Vector Art Container */}
                <div className="w-full aspect-4/3 rounded-xl overflow-hidden flex items-center justify-center bg-radial from-[#FFFDF8] to-[#F1E8D2] relative cursor-pointer" onClick={() => onSelectProduct(heroUrli)}>
                  <ProductArtwork productId={heroUrli.id} zoom={heroUrli ? heroZoom : false} />
                  
                  {/* Subtle caption bottom */}
                  <div className="absolute bottom-3 left-4 right-4 bg-white/85 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{heroUrli.name}</span>
                      <span className="text-slate-500 block text-[11px]">{heroUrli.finish}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#9E7A1C] text-sm tabular-nums">
                        {formatCurrency(heroUrli.offerPrice, currency)}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through block tabular-nums">
                        {formatCurrency(heroUrli.mrp, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Inspection Ribbon */}
                <div className="mt-3 pt-2 px-1 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Hand-hammered ripple basin
                  </span>
                  <button
                    onClick={() => onSelectProduct(heroUrli)}
                    className="text-[#9E7A1C] font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Inspect Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Featured Artisanal Catalog Grid */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#9E7A1C] font-bold mb-1">
              Curated Royal Collection
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Masterpiece Brass &amp; Metalware
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Solid cast brass, hand-beaten copper, and heritage lacquered metal art direct from Moradabad foundries.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">No handicrafts match your search or filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const discountPercent = calculateDiscountPercent(product.mrp, product.offerPrice);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden"
                >
                  {/* Visual Frame */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-4/3 w-full overflow-hidden bg-radial from-[#FFFDF9] to-[#F3EDE0] cursor-pointer"
                  >
                    <ProductArtwork productId={product.id} />

                    {/* Subtle Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-[#111827] text-[#D4AF37] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs border border-[#D4AF37]/30">
                        {product.badge}
                      </div>
                    )}

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {discountPercent}% OFF
                      </div>
                    )}

                    {/* Wishlist Toggle Button */}
                    {onToggleWishlist && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        aria-label="Toggle Wishlist"
                        className="absolute bottom-2 right-3 z-10 p-1.5 rounded-full bg-white/90 shadow-xs hover:shadow-md text-slate-700 hover:text-rose-600 transition-all active:scale-95 cursor-pointer border border-slate-200"
                        title={savedItemIds.includes(product.id) ? 'Saved' : 'Save Piece'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            savedItemIds.includes(product.id) ? 'text-rose-600 fill-rose-600' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    )}

                    {/* Purity Floating Pill */}
                    <div className="absolute bottom-2 left-3 text-[10px] bg-white/90 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                      {product.pureBrassPurity}
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="uppercase tracking-wider font-semibold text-[#8B6508]">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-slate-700">{product.rating}</span>
                          <span className="text-slate-400">({product.reviewCount})</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-base font-bold text-slate-900 group-hover:text-[#9E7A1C] transition-colors cursor-pointer font-serif line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Emotional Hook */}
                      <p className="text-xs text-[#9E7A1C] italic font-serif mt-0.5 line-clamp-1">
                        &ldquo;{product.emotionalHook}&rdquo;
                      </p>

                      {/* Finish & Artisan Lead */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {product.finish}
                      </p>

                      {/* Prominent Gross Weight in Grams & Dimensions */}
                      <div className="mt-2.5 py-1.5 px-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-700 border border-slate-100 flex items-center justify-between flex-wrap gap-1">
                        <span className="font-semibold text-slate-900">
                          Gross Weight: <strong className="text-amber-900 font-bold">{product.grossWeightGrams.toLocaleString('en-IN')}g</strong> (Solid Brass)
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{product.dimensionsCm.length}×{product.dimensionsCm.height} cm</span>
                      </div>

                      {/* Golden 4-Badge Micro Trust Strip */}
                      <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-slate-600 bg-[#FFFDF7] p-1.5 rounded-md border border-[#D4AF37]/20">
                        <span className="flex items-center gap-1">
                          🏆 <strong>100% Solid Brass</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          🛡️ <strong>Anti-Tarnish Seal</strong> (5-Yr)
                        </span>
                        <span className="flex items-center gap-1">
                          📦 <strong>Shatter-Free Crate</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          🔄 <strong>7-Day Easy Return</strong>
                        </span>
                      </div>

                      {/* COD & Shipping Badge */}
                      <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-800">
                        <span className="flex items-center gap-1 font-semibold">
                          <Truck className="w-3 h-3 text-emerald-600" />
                          COD Available Across India
                        </span>
                        <span className="text-slate-400">Dispatch in 24h</span>
                      </div>
                    </div>

                    {/* Pricing & Add To Cart Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-900 tabular-nums">
                            {formatCurrency(product.offerPrice, currency)}
                          </span>
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            {formatCurrency(product.mrp, currency)}
                          </span>
                          {discountPercent > 0 && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                              Save {discountPercent}%
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block">
                          Inclusive of all taxes
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(product, 1)}
                          className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-linear-to-r from-[#F5D061] to-[#D4AF37] hover:from-[#FFE285] hover:to-[#DFB73E] rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION: Artisanal Provenance & Foundry Story */}
      <section className="bg-slate-900 text-white py-16 border-t border-b border-[#D4AF37]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                Direct From Moradabad Foundries
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif leading-tight">
                Crafted in Jigar Colony, Moradabad: The Legendary Brass Crucible of India
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                For over 400 years, Moradabad in Uttar Pradesh has been revered as &quot;Peetal Nagri&quot; (The Brass City). 
                At <strong>TAG ZEE</strong>, founded by <strong>Zeefaham Rais</strong> and <strong>Atir Rais</strong>, we safeguard this royal metallurgical legacy. 
                Our artisans do not mass-produce stamped tin; every vessel is cast in traditional clay-sand molds, turned on heavy lathes, and chiseled with master chisels.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-800/80 rounded-lg border border-[#D4AF37]/20">
                  <div className="text-xl font-bold text-[#D4AF37] font-serif">400+ Years</div>
                  <div className="text-xs text-slate-400">Generational Moradabad Metallurgy</div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-[#D4AF37]/20">
                  <div className="text-xl font-bold text-[#D4AF37] font-serif">100% Virgin Brass</div>
                  <div className="text-xs text-slate-400">Lead-Free &amp; Heavy-Gauge Ingot Cast</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onSwitchToB2B}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:text-white transition-colors"
                >
                  <span>Looking for direct factory container exports? Visit B2B Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Foundry Workshop Pillars */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h4 className="font-bold text-white text-sm">Clay Sand Casting</h4>
                <p className="text-xs text-slate-400">
                  Molten virgin brass poured at 1,020°C into hand-packed fine alluvial loam sand molds for solid acoustic density.
                </p>
              </div>

              <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h4 className="font-bold text-white text-sm">Repoussé Hand-Chiseling</h4>
                <p className="text-xs text-slate-400">
                  Skilled ustads hammer concentric ripples and floral borders using hardened steel chisels without mechanical stamping.
                </p>
              </div>

              <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h4 className="font-bold text-white text-sm">Lost-Wax Filigree</h4>
                <p className="text-xs text-slate-400">
                  Intricate peacock feathers and openwork jali mesh created using ancient cire-perdue casting for museum-grade delicacy.
                </p>
              </div>

              <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h4 className="font-bold text-white text-sm">High-Bake Anti-Tarnish</h4>
                <p className="text-xs text-slate-400">
                  Dual electro-polishing followed by high-temperature baked organic lacquer sealing against humidity and blackening.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Customer Experience Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-slate-800">
          <div className="flex items-start gap-3">
            <Truck className="w-6 h-6 text-[#9E7A1C] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm">Free Express Shipping</h5>
              <p className="text-xs text-slate-500 mt-0.5">Complimentary door delivery across all Indian pincodes over ₹2,499.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#9E7A1C] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm">Authenticity Guarantee</h5>
              <p className="text-xs text-slate-500 mt-0.5">Certified 99.8% virgin brass with official GI Moradabad hallmark seal.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-6 h-6 text-[#9E7A1C] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm">7-Day Transit Care</h5>
              <p className="text-xs text-slate-500 mt-0.5">Zero-risk transit insurance. Immediate replacement if damaged in transit.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-[#9E7A1C] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm">Artisan Direct Help</h5>
              <p className="text-xs text-slate-500 mt-0.5">Direct WhatsApp support with owners Zeefaham Rais &amp; Atir Rais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-[#D4AF37]/30 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-slate-950 font-bold flex items-center justify-center font-serif">
                TZ
              </div>
              <span className="text-lg font-bold text-white tracking-wider font-serif">TAG ZEE</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Makers of distinguished Moradabad brassware, copper culinary art, and royal home decor. 
              Bridging royal Indian metalwork with modern luxury interiors worldwide.
            </p>
            <div className="pt-2 text-slate-400 space-y-1">
              <div>Founders: <strong className="text-slate-200">{BRAND_INFO.owners}</strong></div>
              <div>GSTIN: <span className="font-mono text-slate-300">{BRAND_INFO.gstin}</span></div>
            </div>
          </div>

          {/* Product Pillars */}
          <div className="md:col-span-3 space-y-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">Product Pillars</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>Metal Handicrafts &amp; Pure Brassware</li>
              <li>Home &amp; Kitchen (Ayurvedic Copper Dining)</li>
              <li>Garden Decor &amp; Bronze Planters</li>
              <li>Ornaments, Royal Mirrors &amp; Wall Art</li>
              <li>Moroccan &amp; Mughal Pierced Lanterns</li>
            </ul>
          </div>

          {/* Atelier & Factory Location */}
          <div className="md:col-span-5 space-y-2">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">Moradabad Atelier &amp; Contact</h5>
            <div className="space-y-1.5 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{BRAND_INFO.email} / {BRAND_INFO.corporateEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{BRAND_INFO.contacts.join(' / ')}</span>
              </p>
            </div>

            <div className="pt-3 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/917248257721?text=Hello%20TAG%20ZEE,%20I%20am%20interested%20in%20your%20Moradabad%20handicrafts`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <span>WhatsApp Zeefaham Rais</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://wa.me/917351366786?text=Hello%20TAG%20ZEE,%20I%20am%20inquiring%20about%20Wholesale%20Export`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <span>WhatsApp Atir Rais</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © {new Date().getFullYear()} TAG ZEE Moradabad. All Rights Reserved. Pure Custom Architecture.
          </div>
          <div className="flex items-center gap-4">
            <span>Handcrafted in India</span>
            <span>·</span>
            <span>Peetal Nagri Heritage</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
