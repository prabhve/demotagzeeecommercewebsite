import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Phone,
  ArrowRight,
  ZoomIn,
  Star,
  MapPin,
  Mail,
  ExternalLink,
  Flame,
  CheckCircle2,
  Heart,
  Building2,
} from 'lucide-react';
import type { Product, Currency } from '../types/index.ts';
import { BRAND_INFO, INITIAL_REVIEWS } from '../data/catalog.ts';
import { formatCurrency, calculateDiscountPercent } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface B2CStorefrontProps {
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onSwitchToB2B: () => void;
  searchQuery?: string;
  savedItemIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const B2CStorefront: React.FC<B2CStorefrontProps> = ({
  products,
  currency,
  onAddToCart,
  onSelectProduct,
  onSwitchToB2B,
  searchQuery = '',
  savedItemIds = [],
  onToggleWishlist = () => {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [heroZoom, setHeroZoom] = useState<boolean>(false);

  const categories = ['All', 'Metal Handicrafts', 'Home & Kitchen', 'Garden Decor', 'Ornaments'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const heroUrli = products[0] || {
    id: 'tag-urli-01',
    name: 'Royal Hand-Hammered Brass Urli Bowl',
    offerPrice: 1850,
    mrp: 2999,
    finish: 'Mirror Gold Hand-Chiseled with Clear High-Temp Protective Lacquer',
    pureBrassPurity: 'Certified 99.4% Metallurgical Purity',
    grossWeightGrams: 2450,
  };

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden selection:bg-[#DFBA73]/30">
      {/* HERO SECTION: EDITORIAL ATELIER GALLERY */}
      <section className="relative bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#FBF9F5] py-24 sm:py-32 border-b border-slate-200/60 overflow-hidden">
        {/* Subtle Watermark: Royal geometric mandala motif with 3% opacity */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035]"
        >
          <svg viewBox="0 0 800 800" className="w-[850px] h-[850px] text-[#C5A059]" fill="none" stroke="currentColor">
            <circle cx="400" cy="400" r="380" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="300" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="400" cy="400" r="220" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="140" strokeWidth="1" strokeDasharray="4 4" />
            <polygon points="400,20 440,260 680,120 540,340 780,400 540,460 680,680 440,540 400,780 360,540 120,680 260,460 20,400 260,340 120,120 360,260" strokeWidth="1" />
            <circle cx="400" cy="400" r="40" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Provenance & Headlines */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#C5A059]/40 shadow-[0_2px_10px_rgba(197,160,89,0.08)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span className="text-[10px] tracking-[0.22em] font-semibold uppercase text-[#846328]">
                    EST. MORADABAD • ROYAL BRASSFOUNDRY
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-950 leading-[1.12] tracking-tight">
                  Artisanal Brassware, <br className="hidden sm:inline" />
                  <span className="italic text-[#846328] font-normal">Cast for Generational Living.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-2xl pt-2">
                  Hand-hammered by 3rd-generation master artisans using 100% solid virgin brass and food-safe alloy purity. Experience sacred deepaks, banquet cutlery, fluted planters, and antique heirlooms directly from the historic crucible of Moradabad.
                </p>
              </div>

              {/* Action Buttons with Champagne Hairline Borders */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('curated-collection');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-4 rounded-full bg-slate-950 hover:bg-[#846328] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(15,23,42,0.15)] flex items-center gap-2.5 cursor-pointer group"
                >
                  <span>Explore Retail Atelier</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onSwitchToB2B}
                  className="px-7 py-4 rounded-full bg-white hover:bg-[#FFFDF8] text-slate-900 hover:text-[#846328] text-xs font-semibold tracking-wider uppercase border border-[#C5A059]/50 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#846328]" />
                  <span>Wholesale &amp; Export (MOQ 20+)</span>
                </button>
              </div>

              {/* Museum Credibility & Trust Markers Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/70 text-xs text-slate-600">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Award className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>100% Solid Brass</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal pl-6">
                    Virgin Ingot Metallurgy, Certified Lead-Free
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Anti-Tarnish Seal</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal pl-6">
                    5-Year Baked Radiant Protective Glow
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Direct Foundry</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal pl-6">
                    Jigar Colony Moradabad Artisans
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Museum Plinth Frame with Docked Purity Seal */}
            <div className="lg:col-span-5">
              <div className="space-y-4">
                {/* Museum Plinth Image Frame */}
                <div className="relative bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] group overflow-hidden">
                  {/* Live Zoom Toggle */}
                  <button
                    onClick={() => setHeroZoom(!heroZoom)}
                    aria-label="Toggle interactive zoom"
                    className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/90 text-slate-800 hover:text-[#846328] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/60 transition-transform active:scale-95 cursor-pointer"
                    title={heroZoom ? 'Reset Zoom' : 'Interactive 2X Zoom'}
                  >
                    <ZoomIn className={`w-4 h-4 ${heroZoom ? 'text-[#C5A059]' : ''}`} />
                  </button>

                  {/* Artwork Container */}
                  <div
                    onClick={() => onSelectProduct(heroUrli)}
                    className="w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center relative cursor-pointer"
                  >
                    <ProductArtwork productId={heroUrli.id} zoom={heroZoom} />
                  </div>

                  {/* Editorial Plinth Caption */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-slate-900 font-normal">{heroUrli.name}</h4>
                      <p className="text-xs text-slate-500 font-light mt-0.5">{heroUrli.finish}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-semibold text-slate-950 tabular-nums">
                        {formatCurrency(heroUrli.offerPrice, currency)}
                      </div>
                      <div className="text-xs text-slate-400 line-through tabular-nums">
                        {formatCurrency(heroUrli.mrp, currency)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Docked Purity Seal (Cleanly positioned below the frame without obstructing the piece) */}
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-medium text-slate-800">
                      {heroUrli.pureBrassPurity || '99.8% Pure Solid Moradabad Brass'}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectProduct(heroUrli)}
                    className="text-xs text-[#846328] hover:underline font-semibold cursor-pointer"
                  >
                    Inspect Artwork →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG & PRODUCT CARDS SECTION */}
      <section id="curated-collection" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header & Editorial Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-slate-200/60">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] tracking-[0.24em] font-semibold uppercase text-[#846328] block">
              CURATED ATELIER REPERTOIRE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-950 tracking-tight">
              Masterpiece Brass &amp; Metalware
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              Solid cast brass, hand-beaten copper, and heritage lacquered metal art direct from Moradabad foundries.
            </p>
          </div>

          {/* Minimalist Segmented Category Filters */}
          <div className="inline-flex items-center p-1 bg-[#FBF9F5] rounded-full border border-slate-200/70 overflow-x-auto scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: Uncompressed Gallery Layout */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#FBF9F5] rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm font-light">No artisanal pieces match your search or filter.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-6 py-2.5 bg-slate-950 text-white rounded-full text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {filteredProducts.map((product) => {
              const discountPercent = calculateDiscountPercent(product.mrp, product.offerPrice);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/60 hover:border-[#C5A059]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col group overflow-hidden"
                >
                  {/* Visual Museum Frame (with generous white border padding around artwork) */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-square w-full p-6 sm:p-8 bg-gradient-to-b from-white to-[#FBF9F5] flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
                      <ProductArtwork productId={product.id} />
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      aria-label="Save Piece"
                      className="absolute top-8 right-8 z-10 p-2.5 rounded-full bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md text-slate-700 hover:text-rose-600 transition-all active:scale-95 cursor-pointer border border-slate-200/70"
                      title={savedItemIds.includes(product.id) ? 'Saved' : 'Save Piece'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          savedItemIds.includes(product.id) ? 'text-rose-600 fill-rose-600' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      {/* Delicate Micro-Labels (Category & Weight) */}
                      <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-slate-500 font-medium">
                        <span className="text-[#846328] font-semibold">{product.category}</span>
                        <span>GROSS: {product.grossWeightGrams.toLocaleString('en-IN')}G · SOLID BRASS</span>
                      </div>

                      {/* Product Name in Cormorant Garamond */}
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-xl sm:text-2xl font-serif font-normal text-slate-900 group-hover:text-[#846328] transition-colors cursor-pointer leading-snug line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Emotional Artisan Hook */}
                      <p className="text-xs text-slate-500 font-light italic leading-relaxed line-clamp-2">
                        &ldquo;{product.emotionalHook}&rdquo;
                      </p>

                      {/* Delicate Hairline Trust Marker */}
                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
                          <span className="font-semibold text-slate-800">{product.rating}</span>
                          <span className="text-slate-400">({product.reviewCount} reviews)</span>
                        </div>
                        <span className="text-[#846328] font-medium">{product.pureBrassPurity}</span>
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-semibold text-slate-950 tabular-nums">
                            {formatCurrency(product.offerPrice, currency)}
                          </span>
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            {formatCurrency(product.mrp, currency)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                          Taxes included {discountPercent > 0 && `· Save ${discountPercent}%`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="px-4 py-2.5 rounded-full text-xs font-medium text-slate-700 hover:text-slate-950 border border-slate-200/80 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(product, 1)}
                          className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-slate-950 hover:bg-[#846328] transition-all duration-300 shadow-xs cursor-pointer"
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

      {/* SECTION: Connoisseur Testimonials & Ratings Showcase */}
      <section className="bg-[#FBF9F5] py-24 sm:py-32 border-t border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] tracking-[0.24em] font-semibold uppercase text-[#846328] block">
              PATRON TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-950 tracking-tight">
              Revered by Discerning Living Spaces
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
              From diplomatic embassies and heritage bungalows to modern luxury penthouses across New Delhi, Mumbai, London, and Dubai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_REVIEWS.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-current text-[#C5A059]' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <h4 className="font-serif text-lg text-slate-900 font-normal leading-snug">
                    &ldquo;{review.title}&rdquo;
                  </h4>

                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">{review.authorName}</span>
                    <span className="text-[11px] text-slate-400">{review.date}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                    Verified Connoisseur
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Artisanal Provenance & Foundry Story */}
      <section className="bg-[#0F172A] text-white py-24 sm:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#DFBA73] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C5A059]" />
                Direct From Moradabad Foundries
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal leading-tight text-white tracking-tight">
                Crafted in Jigar Colony, Moradabad: The Legendary Crucible of India.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                For over 400 years, Moradabad in Uttar Pradesh has been celebrated as &quot;Peetal Nagri&quot; (The Brass Capital). At <strong>TAG ZEE</strong>, founded by <strong>Zeefaham Rais</strong> &amp; <strong>Atir Rais</strong>, we preserve this royal metallurgical lineage. Our pieces are cast in traditional sand loam molds, lathed on balance benches, and hand-chiseled by generational ustads.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <div className="text-2xl font-serif text-[#DFBA73] font-normal">400+ Years</div>
                  <div className="text-xs text-slate-400 mt-1">Generational Metallurgy Legacy</div>
                </div>
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <div className="text-2xl font-serif text-[#DFBA73] font-normal">100% Virgin Brass</div>
                  <div className="text-xs text-slate-400 mt-1">Certified Lead-Free Ingot Casting</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onSwitchToB2B}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#DFBA73] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Looking for direct factory container exports? Visit B2B Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Foundry Workshop Pillars */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-[#C5A059] font-medium">01</span>
                <h4 className="font-serif text-lg text-white font-normal">Clay Sand Loam Casting</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Molten virgin brass poured at 1,020°C into hand-packed alluvial sand molds for solid acoustic density.
                </p>
              </div>

              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-[#C5A059] font-medium">02</span>
                <h4 className="font-serif text-lg text-white font-normal">Repoussé Hand-Chiseling</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Generational artisans hand-strike concentric ripples and motifs using hardened steel chisels.
                </p>
              </div>

              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-[#C5A059] font-medium">03</span>
                <h4 className="font-serif text-lg text-white font-normal">Lost-Wax Filigree</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Intricate peacock feathers and openwork jali mesh created using ancient cire-perdue technique.
                </p>
              </div>

              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-[#C5A059] font-medium">04</span>
                <h4 className="font-serif text-lg text-white font-normal">High-Bake Anti-Tarnish</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Dual electro-polishing followed by high-temperature baked organic lacquer sealing against humidity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Customer Experience Guarantees */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-20 border-b border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-slate-800">
          <div className="flex items-start gap-4">
            <Truck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-medium text-sm text-slate-950">Free Express Air Shipping</h5>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Complimentary door delivery across all Indian pincodes on orders over ₹2,499.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-medium text-sm text-slate-950">Authenticity Guarantee</h5>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Certified 99.8% virgin brass with official GI Moradabad hallmark seal.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <RotateCcw className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-medium text-sm text-slate-950">7-Day Transit Care</h5>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Zero-risk transit insurance. Immediate replacement if damaged during shipping.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-medium text-sm text-slate-950">Direct Concierge Help</h5>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Direct WhatsApp access to owners Zeefaham Rais &amp; Atir Rais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] text-slate-950 font-bold flex items-center justify-center font-serif">
                TZ
              </div>
              <span className="text-xl font-serif text-white tracking-wider">TAG ZEE</span>
            </div>
            <p className="text-slate-400 font-light leading-relaxed">
              Makers of distinguished Moradabad brassware, copper culinary art, and royal home decor. Bridging historic Indian metalwork with modern luxury interiors worldwide.
            </p>
            <div className="pt-2 text-slate-400 space-y-1 text-[11px]">
              <div>Founders: <strong className="text-slate-200">{BRAND_INFO.owners}</strong></div>
              <div>GSTIN: <span className="font-mono text-slate-300">{BRAND_INFO.gstin}</span></div>
            </div>
          </div>

          {/* Product Pillars */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-white font-medium text-xs tracking-wider uppercase">Artisanal Pillars</h5>
            <ul className="space-y-2 text-slate-400 font-light">
              <li>Metal Handicrafts &amp; Pure Brassware</li>
              <li>Home &amp; Kitchen (Ayurvedic Copper Dining)</li>
              <li>Garden Decor &amp; Bronze Planters</li>
              <li>Ornaments, Royal Mirrors &amp; Wall Art</li>
              <li>Moroccan &amp; Mughal Pierced Lanterns</li>
            </ul>
          </div>

          {/* Atelier & Factory Location */}
          <div className="md:col-span-5 space-y-3">
            <h5 className="text-white font-medium text-xs tracking-wider uppercase">Moradabad Atelier &amp; Contact</h5>
            <div className="space-y-2 text-slate-400 font-light">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{BRAND_INFO.email} / {BRAND_INFO.corporateEmail}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{BRAND_INFO.contacts.join(' / ')}</span>
              </p>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/917248257721?text=Hello%20TAG%20ZEE,%20I%20am%20interested%20in%20your%20Moradabad%20handicrafts`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-full text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <span>WhatsApp Zeefaham Rais</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://wa.me/917351366786?text=Hello%20TAG%20ZEE,%20I%20am%20inquiring%20about%20Wholesale%20Export`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-full text-xs font-medium flex items-center gap-2 transition-colors"
              >
                <span>WhatsApp Atir Rais</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
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
