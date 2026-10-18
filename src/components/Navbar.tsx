import React from 'react';
import { ShoppingBag, Search, Sparkles, Building2, Store, ShieldCheck, Phone, Check } from 'lucide-react';
import type { Currency } from '../types/index.ts';
import { BRAND_INFO } from '../data/catalog.ts';

interface NavbarProps {
  activeTab: 'b2c' | 'b2b' | 'admin';
  setActiveTab: (tab: 'b2c' | 'b2b' | 'admin') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  cartCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  cartCount,
  openCart,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-xs">
      {/* Top Regal Ticker */}
      <div className="bg-[#111827] text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5 text-[#D4AF37] font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Moradabad Peetal Nagri (GI Heritage)
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            Free Express Shipping in India on orders over ₹2,499
          </span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {/* Direct WhatsApp Call Line */}
          <a
            href="https://wa.me/917248257721?text=Hello%20TAG%20ZEE%2C%20I%20am%20inquiring%20about%20Moradabad%20Handicrafts"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#D4AF37] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            <span>Atelier Line: +91 7248257721</span>
          </a>

          {/* Currency Selector */}
          <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                currency === 'INR' ? 'bg-[#D4AF37] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
              title="Indian Rupee"
            >
              INR ₹
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                currency === 'USD' ? 'bg-[#D4AF37] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
              title="US Dollar"
            >
              USD $
            </button>
          </div>
        </div>
      </div>

      {/* 3-Way Live Workspace Switcher Bar */}
      <div className="bg-[#FAF9F5] border-b border-[#D4AF37]/20 px-2 sm:px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto pb-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1.5 hidden md:inline shrink-0">
              Workspace:
            </span>
            <button
              onClick={() => setActiveTab('b2c')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'b2c'
                  ? 'bg-white text-slate-950 shadow-xs border border-[#D4AF37]/50 text-[#9E7A1C]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>B2C Retail</span>
              {activeTab === 'b2c' && <Check className="w-3 h-3 text-[#D4AF37] shrink-0" />}
            </button>

            <button
              onClick={() => setActiveTab('b2b')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'b2b'
                  ? 'bg-[#111827] text-[#D4AF37] shadow-xs border border-[#D4AF37]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>B2B Wholesale</span>
              <span className="text-[9px] bg-[#D4AF37] text-slate-950 px-1 py-0.2 rounded font-bold shrink-0">MOQ 20</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-900/90 text-amber-100 shadow-xs border border-amber-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Admin Console</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
            <span>Founders: {BRAND_INFO.owners}</span>
            <span>·</span>
            <span>Civil Lines, Moradabad</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Brand Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('b2c')}
            className="flex items-center gap-2.5 text-left group"
          >
            {/* Royal Mandala Emblem */}
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#FFF9E6] to-[#F3DF9A] border border-[#D4AF37] flex items-center justify-center shadow-xs group-hover:rotate-12 transition-transform duration-300">
              <svg viewBox="0 0 40 40" className="w-7 h-7 text-[#9E7A1C]" fill="currentColor">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                <polygon points="20,7 23,16 33,20 23,24 20,33 17,24 7,20 17,16" />
                <circle cx="20" cy="20" r="4" fill="#111827" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold tracking-wider text-slate-900 font-serif leading-none">
                TAG ZEE
              </div>
              <div className="text-[10px] tracking-widest uppercase text-[#9E7A1C] font-semibold mt-0.5">
                Moradabad Atelier
              </div>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brass urli, peacock lamps, copper cutlery, planters..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Nav & Cart Bag Action */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-700">
            <button
              onClick={() => setActiveTab('b2c')}
              className={`hover:text-[#9E7A1C] transition-colors ${activeTab === 'b2c' ? 'text-[#9E7A1C]' : ''}`}
            >
              Retail Catalog
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={`hover:text-[#9E7A1C] transition-colors ${activeTab === 'b2b' ? 'text-[#9E7A1C]' : ''}`}
            >
              Bulk RFQ Slabs
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`hover:text-[#9E7A1C] transition-colors ${activeTab === 'admin' ? 'text-[#9E7A1C]' : ''}`}
            >
              Order Management
            </button>
          </nav>

          {/* Cart Icon with Live Counter */}
          <button
            onClick={openCart}
            aria-label="View Shopping Bag"
            className="relative p-2.5 rounded-lg border border-[#D4AF37]/40 bg-linear-to-b from-white to-[#FDFBF7] hover:border-[#D4AF37] transition-all text-slate-800 flex items-center gap-2 group cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:text-[#9E7A1C] transition-colors" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-slate-950 bg-[#D4AF37] rounded-full shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
