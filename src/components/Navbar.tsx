import React from 'react';
import { ShoppingBag, Search, Sparkles, Building2, Store, ShieldCheck, Phone, Heart, User as UserIcon, Check } from 'lucide-react';
import type { Currency, User } from '../types/index.ts';
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
  currentUser?: User | null;
  onOpenAuthModal?: () => void;
  onOpenProfile?: () => void;
  wishlistCount?: number;
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
  currentUser = null,
  onOpenAuthModal = () => {},
  onOpenProfile = () => {},
  wishlistCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
      {/* Top Editorial Ticker */}
      <div className="bg-[#0F172A] text-slate-300 text-xs px-6 sm:px-10 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[#DFBA73] font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Moradabad Artisanal Heritage • Worldwide Air &amp; Sea Cargo
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 font-normal">
            Complimentary white-glove express shipping in India over ₹2,499
          </span>
        </div>

        <div className="flex items-center gap-5 ml-auto">
          {/* Direct WhatsApp Concierge */}
          <a
            href="https://wa.me/917248257721?text=Hello%20TAG%20ZEE%2C%20I%20am%20inquiring%20about%20Moradabad%20Handicrafts"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#DFBA73] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#C5A059]" />
            <span className="tracking-wide">Concierge: +91 7248257721</span>
          </a>

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-full p-0.5 border border-slate-800">
            {(['INR', 'USD', 'EUR'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  currency === c
                    ? 'bg-[#C5A059] text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Switch currency to ${c}`}
              >
                {c === 'INR' ? 'INR ₹' : c === 'USD' ? 'USD $' : 'EUR €'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Atelier Perspective Bar (Floating Pill Capsule) */}
      <div className="bg-[#FBF9F5] border-b border-slate-200/50 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Frosted Glass Perspective Capsule */}
          <div className="mx-auto sm:mx-0 inline-flex items-center p-1 bg-white/85 backdrop-blur-md rounded-full border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => setActiveTab('b2c')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-full font-medium transition-all cursor-pointer ${
                activeTab === 'b2c'
                  ? 'bg-slate-950 text-[#DFBA73] shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Retail Connoisseur (B2C)</span>
              {activeTab === 'b2c' && <Check className="w-3 h-3 text-[#DFBA73] ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTab('b2b')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-full font-medium transition-all cursor-pointer ${
                activeTab === 'b2b'
                  ? 'bg-slate-950 text-[#DFBA73] shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Wholesale &amp; Export Desk (B2B)</span>
              <span className="text-[9px] bg-[#C5A059]/20 text-[#846328] px-1.5 py-0.2 rounded-full font-semibold">
                MOQ 20
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-full font-medium transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-950 text-[#DFBA73] shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Foundry Operations (Admin)</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-500 font-normal">
            <span>Founders: {BRAND_INFO.owners}</span>
            <span>·</span>
            <span>Civil Lines, Moradabad (UP)</span>
          </div>
        </div>
      </div>

      {/* Main Luxury Atelier Navbar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('b2c')}
            className="flex items-center gap-3.5 text-left group cursor-pointer"
          >
            {/* Royal Mandala Emblem */}
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#FFFBF0] via-[#F8EED4] to-[#DFBA73] border border-[#C5A059]/60 flex items-center justify-center shadow-[0_2px_8px_rgba(197,160,89,0.2)] group-hover:rotate-12 transition-transform duration-500">
              <svg viewBox="0 0 40 40" className="w-7 h-7 text-[#846328]" fill="currentColor">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 2" />
                <polygon points="20,7 23,16 33,20 23,24 20,33 17,24 7,20 17,16" />
                <circle cx="20" cy="20" r="3.5" fill="#0F172A" />
              </svg>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-normal tracking-[0.06em] text-slate-950 leading-none">
                TAG ZEE
              </div>
              <div className="text-[9px] tracking-[0.24em] uppercase text-[#846328] font-semibold mt-1">
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
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/70 border border-slate-200/70 rounded-full focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Nav & Cart Bag Action */}
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-700">
            <button
              onClick={() => setActiveTab('b2c')}
              className={`hover:text-[#846328] transition-colors cursor-pointer py-1 ${
                activeTab === 'b2c' ? 'text-[#846328] border-b-2 border-[#C5A059]' : ''
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab('b2c')}
              className="hover:text-[#846328] transition-colors cursor-pointer py-1"
            >
              Metal Artefacts
            </button>
            <button
              onClick={() => setActiveTab('b2c')}
              className="hover:text-[#846328] transition-colors cursor-pointer py-1"
            >
              Home &amp; Kitchen
            </button>
            <button
              onClick={() => setActiveTab('b2c')}
              className="hover:text-[#846328] transition-colors cursor-pointer py-1"
            >
              Garden Decor
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={`hover:text-[#846328] transition-colors px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#FFFDF8] text-[#846328] font-semibold cursor-pointer ${
                activeTab === 'b2b' ? 'bg-slate-950 text-[#DFBA73] border-slate-950' : ''
              }`}
            >
              B2B Wholesale Desk
            </button>
          </nav>

          {/* Wishlist Button */}
          <button
            onClick={onOpenProfile}
            aria-label="View Saved Items"
            className="relative p-2.5 rounded-full border border-slate-200/70 hover:border-[#C5A059] bg-white transition-all text-slate-700 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            title="Saved Items / Wishlist"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="hidden xl:inline text-xs font-medium">Saved</span>
            {wishlistCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Account / Sign In Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200/70 bg-[#FFFDF8] hover:border-[#C5A059] text-slate-900 flex items-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              title="Manage Profile & Past Orders"
            >
              <div className="w-6 h-6 rounded-full bg-slate-950 text-[#DFBA73] text-[10px] font-bold flex items-center justify-center font-serif">
                {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-xs font-semibold line-clamp-1 max-w-[100px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-full border border-slate-200/70 hover:border-[#C5A059] bg-white text-slate-800 flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <UserIcon className="w-4 h-4 text-[#846328]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Cart Icon with Live Counter */}
          <button
            onClick={openCart}
            aria-label="View Shopping Bag"
            className="relative px-3.5 py-2 rounded-full border border-[#C5A059]/40 bg-linear-to-b from-white to-[#FDFBF7] hover:border-[#C5A059] transition-all text-slate-800 flex items-center gap-2 group cursor-pointer shadow-[0_2px_10px_rgba(197,160,89,0.12)]"
          >
            <ShoppingBag className="w-4 h-4 text-slate-800 group-hover:text-[#846328] transition-colors" />
            <span className="hidden sm:inline text-xs font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold text-slate-950 bg-[#C5A059] rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
