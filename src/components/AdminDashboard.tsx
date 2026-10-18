import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  FileText,
  Barcode,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  ShieldCheck,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import type { Order, Product, Currency, B2BClientApplication } from '../types/index.ts';
import { BRAND_INFO, INITIAL_B2B_APPLICATIONS } from '../data/catalog.ts';
import { formatCurrency } from '../utils/pricing.ts';
import { ProductArtwork } from './ProductArtwork.tsx';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  currency: Currency;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onGenerateAwbAndDispatch: (orderId: string) => void;
  onViewInvoice: (order: Order) => void;
  onViewShippingLabel: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  currency,
  onUpdateProductStock,
  onGenerateAwbAndDispatch,
  onViewInvoice,
  onViewShippingLabel,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'inventory' | 'b2b-clients'>('orders');
  const [orderFilter, setOrderFilter] = useState<'All' | 'B2C' | 'B2B'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [b2bApplications, setB2bApplications] = useState<B2BClientApplication[]>(INITIAL_B2B_APPLICATIONS);

  // Calculations for Executive KPI Dashboard
  const b2cOrders = orders.filter((o) => o.type === 'B2C');
  const b2bOrders = orders.filter((o) => o.type === 'B2B');

  const actualB2cRev = b2cOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const actualB2bRev = b2bOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const b2cDisplayInr = Math.max(420000, actualB2cRev);
  const b2bDisplayInr = Math.max(1860000, actualB2bRev);
  const totalRevenueInr = b2cDisplayInr + b2bDisplayInr;

  const pendingDispatches = orders.filter(
    (o) => o.orderStatus === 'Ready for Dispatch' || o.orderStatus === 'Confirmed'
  ).length;

  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const rawBrassValuationInr = 1450000;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  const filteredOrders = orders.filter((o) => {
    const matchesType = orderFilter === 'All' || o.type === orderFilter;
    const matchesSearch =
      searchQuery === '' ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.companyName && o.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleApproveApplication = (appId: string) => {
    setB2bApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'Approved' } : app))
    );
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-slate-900 pb-28 selection:bg-[#DFBA73]/30">
      {/* Editorial Luxury Command Center Header */}
      <div className="bg-[#0F172A] text-white py-12 px-6 sm:px-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#DFBA73]">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              FOUNDRY OPERATIONS &amp; SHIPROCKET COMMAND CENTER
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-white tracking-tight">
              Artisanal Logistics &amp; Enterprise Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-2xl leading-relaxed">
              Real-time Moradabad foundry dispatch allocation, automated 1-click AWB thermal labels, GST tax invoices, and B2B credit approval.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Operating Foundry</span>
              <strong className="text-slate-200 font-serif">A 305 Jigar Colony, Civil Lines</strong>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Directors</span>
              <strong className="text-[#DFBA73] font-serif">{BRAND_INFO.owners}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-12">
        {/* SECTION 1: Executive KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Revenue Split */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#846328]">
                REVENUE REALIZATION
              </span>
              <div className="w-9 h-9 rounded-full bg-[#FBF9F5] text-[#846328] flex items-center justify-center border border-slate-200/60">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-slate-950 font-sans tabular-nums">
                {formatCurrency(totalRevenueInr, currency)}
              </div>
              <div className="text-[11px] text-slate-500 font-light mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-emerald-700 font-medium">₹4.2L Retail B2C</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-800 font-medium">₹18.6L Export B2B</span>
              </div>
            </div>
          </div>

          {/* Card 2: Shipments Awaiting Dispatch */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-700">
                LOGISTICS QUEUE
              </span>
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-slate-950 font-sans tabular-nums">
                {pendingDispatches} Orders Pending
              </div>
              <span className="text-[11px] text-blue-700 font-medium block mt-2 pt-2 border-t border-slate-100">
                Delhivery / BlueDart Air AWB ready
              </span>
            </div>
          </div>

          {/* Card 3: Raw Brass Reserves */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-600">
                FOUNDRY RESERVES
              </span>
              <div className="w-9 h-9 rounded-full bg-[#FBF9F5] text-[#C5A059] flex items-center justify-center border border-slate-200/60">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-slate-950 font-sans tabular-nums">
                {formatCurrency(rawBrassValuationInr, currency)}
              </div>
              <span className="text-[11px] text-slate-500 font-light block mt-2 pt-2 border-t border-slate-100">
                {totalInventoryUnits} Cast Finished Pieces in Stock
              </span>
            </div>
          </div>

          {/* Card 4: Low Stock Alert */}
          <div className="bg-white p-7 rounded-3xl border border-amber-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-800">
                FURNACE RUN ALERT
              </span>
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/60">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-950 line-clamp-1">
                {lowStockProducts.length > 0 ? `${lowStockProducts[0].name.split(' ')[0]} Low` : 'Inventory Balanced'}
              </div>
              <span className="text-[11px] text-amber-800 font-light block mt-2 pt-2 border-t border-amber-100">
                {lowStockProducts.length} SKUs require clay mold casting run
              </span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs: Unboxed Segmented Capsule */}
        <div className="inline-flex items-center p-1 bg-white rounded-full border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`py-2 px-5 rounded-full flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'bg-slate-950 text-[#DFBA73] shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shiprocket Orders &amp; Invoicing ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('b2b-clients')}
            className={`py-2 px-5 rounded-full flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
              activeAdminTab === 'b2b-clients'
                ? 'bg-slate-950 text-[#DFBA73] shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>B2B Client Audits ({b2bApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('inventory')}
            className={`py-2 px-5 rounded-full flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
              activeAdminTab === 'inventory'
                ? 'bg-slate-950 text-[#DFBA73] shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Foundry Stock Manager</span>
          </button>
        </div>

        {/* TAB 1: Orders Table with Generous Cell Padding (py-4 px-6) */}
        {activeAdminTab === 'orders' && (
          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#846328]">
                  FULFILLMENT &amp; TAXATION
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-slate-950 mt-1">
                  Shiprocket Logistics &amp; Invoicing Desk
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Channel Filter */}
                <div className="inline-flex items-center p-1 bg-slate-50 rounded-full border border-slate-200 text-xs">
                  {(['All', 'B2C', 'B2B'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrderFilter(t)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                        orderFilter === t ? 'bg-slate-950 text-white font-medium shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {t} Orders
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Order ID, Customer..."
                    className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#C5A059] text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-6">Order ID &amp; Date</th>
                    <th className="py-4 px-6">Channel</th>
                    <th className="py-4 px-6">Patron / Organization</th>
                    <th className="py-4 px-6">Artisanal SKUs</th>
                    <th className="py-4 px-6">Valuation</th>
                    <th className="py-4 px-6">Logistics Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 text-xs font-light">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isDispatched = order.orderStatus === 'Dispatched';
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Order ID */}
                          <td className="py-4 px-6">
                            <span className="font-mono font-semibold text-slate-950 block">{order.id}</span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">{order.date}</span>
                          </td>

                          {/* Channel Badge (Modern Status Pills) */}
                          <td className="py-4 px-6">
                            {order.type === 'B2B' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                                B2B Export
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                                B2C Retail
                              </span>
                            )}
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-6">
                            <div className="font-medium text-slate-900">{order.customerName}</div>
                            <span className="text-[11px] text-slate-500 font-light block">
                              {order.city}, {order.state} · {order.customerPhone}
                            </span>
                          </td>

                          {/* SKUs */}
                          <td className="py-4 px-6 text-slate-600">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="line-clamp-1 font-light">
                                <span className="font-medium text-slate-800">{i.quantity}×</span> {i.productName}
                              </div>
                            ))}
                          </td>

                          {/* Valuation */}
                          <td className="py-4 px-6 font-mono font-semibold text-slate-950">
                            {formatCurrency(order.grandTotal, currency)}
                          </td>

                          {/* Status Pill (Emerald for Dispatched, Amber for Pending) */}
                          <td className="py-4 px-6">
                            {isDispatched ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Dispatched ({order.courier})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>{order.orderStatus}</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!isDispatched ? (
                                <button
                                  onClick={() => onGenerateAwbAndDispatch(order.id)}
                                  className="px-3.5 py-2 bg-slate-950 hover:bg-[#846328] text-white font-medium rounded-full text-[11px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                                  title="Generate Shiprocket Barcode & Mark Dispatched"
                                >
                                  <Barcode className="w-3.5 h-3.5 text-[#DFBA73]" />
                                  <span>Generate AWB</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => onViewShippingLabel(order)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-[11px] font-medium flex items-center gap-1.5 cursor-pointer"
                                  title="View Barcode Shipping Label"
                                >
                                  <Barcode className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Label</span>
                                </button>
                              )}

                              <button
                                onClick={() => onViewInvoice(order)}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#C5A059] text-slate-800 rounded-full text-[11px] font-medium flex items-center gap-1.5 cursor-pointer"
                                title="View Indian GST Tax Invoice"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#846328]" />
                                <span>Tax Invoice</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: B2B Client Applications */}
        {activeAdminTab === 'b2b-clients' && (
          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#846328]">
                  CREDIT &amp; DUE DILIGENCE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-slate-950 mt-1">
                  B2B Wholesale Partner Applications
                </h3>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 font-medium px-3.5 py-1.5 rounded-full border border-amber-200">
                {b2bApplications.filter((a) => a.status === 'Pending Verification').length} Pending Review
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-6">App ID / Date</th>
                    <th className="py-4 px-6">Company &amp; Contact</th>
                    <th className="py-4 px-6">Jurisdiction</th>
                    <th className="py-4 px-6">GSTIN / Tax ID</th>
                    <th className="py-4 px-6">Requested Credit</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {b2bApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-800">{app.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">{app.companyName}</div>
                        <span className="text-[11px] text-slate-400 font-light">{app.contactPerson} · {app.email}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{app.country}</td>
                      <td className="py-4 px-6 font-mono font-medium text-slate-800">{app.gstinOrTaxId}</td>
                      <td className="py-4 px-6 font-mono text-slate-800">{formatCurrency(app.creditLimitInr, currency)}</td>
                      <td className="py-4 px-6">
                        {app.status === 'Approved' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            Pending Audit
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {app.status !== 'Approved' && (
                          <button
                            onClick={() => handleApproveApplication(app.id)}
                            className="px-3.5 py-1.5 rounded-full bg-slate-950 text-[#DFBA73] hover:bg-[#846328] text-xs font-medium cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: Inventory Management */}
        {activeAdminTab === 'inventory' && (
          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 space-y-6">
            <div className="pb-6 border-b border-slate-100">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#846328]">
                FOUNDRY BENCH INVENTORY
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-normal text-slate-950 mt-1">
                Brass Stock &amp; Lathe Production Manager
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => {
                const isLow = prod.stock < 15;
                return (
                  <div
                    key={prod.id}
                    className={`p-6 rounded-3xl border transition-all ${
                      isLow ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200/70 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-white overflow-hidden shrink-0">
                        <ProductArtwork productId={prod.id} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base text-slate-950 font-normal line-clamp-1">{prod.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block">{prod.sku}</span>
                        <span className="text-[11px] text-slate-500 font-light">Gross: {prod.grossWeightGrams}g</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateProductStock(prod.id, Math.max(0, prod.stock - 5))}
                          className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer text-xs"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateProductStock(prod.id, Math.max(0, prod.stock - 1))}
                          className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer text-xs"
                        >
                          -1
                        </button>
                      </div>

                      <div className="text-center font-mono">
                        <span className={`text-base font-semibold block ${isLow ? 'text-amber-800' : 'text-slate-900'}`}>
                          {prod.stock} units
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">
                          {isLow ? 'Cast Alert' : 'Stocked'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateProductStock(prod.id, prod.stock + 1)}
                          className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer text-xs"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateProductStock(prod.id, prod.stock + 10)}
                          className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-medium text-slate-700 cursor-pointer text-xs"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
