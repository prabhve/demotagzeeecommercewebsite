import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Package,
  Heart,
  Save,
  CheckCircle2,
  FileText,
  Truck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Trash2,
  ShoppingBag,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import type { User, Order, Product, Currency } from '../types/index.ts';
import { formatCurrency } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  orders: Order[];
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onViewInvoice: (order: Order) => void;
  onViewShippingLabel: (order: Order) => void;
  onOpenProductModal: (product: Product) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  orders,
  products,
  currency,
  onAddToCart,
  onRemoveFromWishlist,
  onViewInvoice,
  onViewShippingLabel,
  onOpenProductModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('orders');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.shippingAddress || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [gstin, setGstin] = useState(user?.gstin || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !user) return null;

  // Filter orders made by this user (by email or customer name)
  const userOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      o.customerName.toLowerCase() === user.name.toLowerCase()
  );

  // Saved Wishlist products
  const savedProducts = products.filter((p) => user.savedItemIds.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name,
      phone,
      shippingAddress: address,
      city,
      state,
      pincode,
      companyName: companyName || undefined,
      gstin: gstin || undefined,
    };
    onUpdateUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#D4AF37]/40 relative">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-radial from-[#FFFDF8] via-[#FAF6ED] to-[#F5EFE0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#111827] text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center font-bold font-serif text-sm shadow-xs">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-serif">{user.name}</h3>
                <span className="text-[11px] text-slate-500 font-mono block">{user.email}</span>
                <span className="text-[10px] text-amber-800 font-semibold">
                  Member since {user.createdAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close user profile drawer"
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3 Navigation Tabs */}
          <div className="flex items-center gap-1 mt-4 bg-white/80 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Past Orders ({userOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Saved Items ({user.savedItemIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Shipping &amp; GST</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: PAST ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800">Your Order History</span>
                <span>{userOrders.length} Completed / In-Transit Orders</span>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-400 text-xs">
                  <Package className="w-10 h-10 mx-auto text-slate-300" />
                  <p>You haven&apos;t placed any orders yet.</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-900 block">
                          {ord.id}
                        </span>
                        <span className="text-[10px] text-slate-400">{ord.date}</span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-[#9E7A1C]">
                        {formatCurrency(ord.grandTotal, currency)}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 text-xs text-slate-700">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {it.quantity}x {it.productName}
                          </span>
                          <span className="font-mono text-slate-500">
                            {formatCurrency(it.total, currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Status & Courier */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ord.orderStatus}</span>
                      </span>
                      {ord.awbNumber && (
                        <span className="text-slate-500 font-mono text-[10px]">
                          AWB: {ord.awbNumber}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onViewInvoice(ord)}
                        className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>View GST Invoice</span>
                      </button>

                      {ord.awbNumber && (
                        <button
                          onClick={() => onViewShippingLabel(ord)}
                          className="py-1.5 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          title="View Shipping Label"
                        >
                          <Truck className="w-3.5 h-3.5 text-slate-600" />
                          <span>Dispatch Label</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SAVED ITEMS / WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800">Curated Saved Pieces</span>
                <span>{savedProducts.length} Items</span>
              </div>

              {savedProducts.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-400 text-xs">
                  <Heart className="w-10 h-10 mx-auto text-slate-300" />
                  <p>Your wishlist is empty. Save royal pieces by clicking the heart icon on any card.</p>
                </div>
              ) : (
                savedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 items-center justify-between"
                  >
                    <div
                      onClick={() => onOpenProductModal(prod)}
                      className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white cursor-pointer"
                    >
                      <ProductArtwork productId={prod.id} />
                    </div>

                    <div className="flex-1 px-1">
                      <h4
                        onClick={() => onOpenProductModal(prod)}
                        className="font-bold text-slate-900 text-xs cursor-pointer hover:text-[#9E7A1C] transition-colors line-clamp-1"
                      >
                        {prod.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 block">
                        {prod.weightKg} kg · {prod.pureBrassPurity}
                      </span>
                      <div className="font-bold text-slate-900 text-xs tabular-nums mt-0.5">
                        {formatCurrency(prod.offerPrice, currency)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => onAddToCart(prod, 1)}
                        className="px-2.5 py-1.5 bg-[#D4AF37] hover:bg-amber-400 text-slate-950 rounded text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(prod.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors self-center"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SHIPPING ADDRESS & TAX PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Mobile Number (for Courier Dispatch OTP)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Delivery Street Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-800 block">
                  B2B Tax Profile (For Input Tax Credit)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Registered Firm / LLC"
                    className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="GSTIN (15-char)"
                    className="px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile &amp; Delivery Address updated securely.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
