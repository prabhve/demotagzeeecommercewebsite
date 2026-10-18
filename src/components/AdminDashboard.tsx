import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  FileText,
  Printer,
  Barcode,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  UserCheck,
  Download,
  Eye,
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

  // Baseline simulated figures matching user prompt:
  // ₹4.2 Lakh B2C Retail | ₹18.6 Lakh B2B Wholesale Export (Total ₹22.8 Lakh)
  const actualB2cRev = b2cOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const actualB2bRev = b2bOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const b2cDisplayInr = Math.max(420000, actualB2cRev);
  const b2bDisplayInr = Math.max(1860000, actualB2bRev);
  const totalRevenueInr = b2cDisplayInr + b2bDisplayInr;

  const pendingDispatches = orders.filter(
    (o) => o.orderStatus === 'Ready for Dispatch' || o.orderStatus === 'Confirmed'
  ).length;

  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const rawBrassValuationInr = 1450000; // Raw metal ingot reserves

  // Low brass stock filter: under 15 units
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
      prev.map((app) =>
        app.id === appId
          ? { ...app, status: 'Approved' }
          : app
      )
    );
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-slate-900 pb-16">
      {/* Admin Top Header */}
      <div className="bg-[#111827] text-white border-b-2 border-[#D4AF37] px-4 sm:px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                TAG ZEE Enterprise Command Center
              </span>
              <span className="text-[10px] bg-amber-500/20 text-[#D4AF37] px-2 py-0.5 rounded font-mono">
                Foundry Node: Moradabad (244001)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5">
              Operations, Logistics &amp; Invoicing Console
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span>Operating Directors: <strong>{BRAND_INFO.owners}</strong></span>
            <span className="text-slate-600">|</span>
            <span>A 305 Jigar Colony, Civil Lines</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* SECTION 1: Executive KPI Metrics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Revenue Split */}
          <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/40 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Revenue Split
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#8B6508] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatCurrency(totalRevenueInr, currency)}
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-1.5 flex items-center justify-between border-t border-slate-100 pt-1.5">
                <span className="text-emerald-700 font-bold">₹4.2L B2C Retail</span>
                <span className="text-slate-300">|</span>
                <span className="text-amber-800 font-bold">₹18.6L B2B Wholesale</span>
              </div>
            </div>
          </div>

          {/* Card 2: Active Orders & Pending Dispatches */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Shipments
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {pendingDispatches} Orders Awaiting Dispatch
              </div>
              <span className="text-[11px] text-blue-700 font-semibold block mt-1">
                Shiprocket 1-Click AWB ready
              </span>
            </div>
          </div>

          {/* Card 3: Raw Metal Valuation */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Raw Brass Reserves
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D4AF37] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatCurrency(rawBrassValuationInr, currency)}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                {totalInventoryUnits} Cast Finished Pieces in Stock
              </span>
            </div>
          </div>

          {/* Card 4: Low Brass Stock Alert */}
          <div className="bg-white p-5 rounded-xl border border-amber-300 bg-linear-to-b from-white to-amber-50/40 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Low Brass Casting Alert
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-amber-950">
                {lowStockProducts.length > 0 ? (
                  <span>{lowStockProducts[0].name.split(' ')[0]} Castings under 15 units!</span>
                ) : (
                  <span>Inventory Optimal</span>
                )}
              </div>
              <span className="text-[11px] text-amber-800 block mt-1">
                {lowStockProducts.length} SKUs require immediate foundry furnace run
              </span>
            </div>
          </div>
        </div>

        {/* Section Navigation Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs text-xs font-semibold">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            <span>Shiprocket Dispatch &amp; Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('b2b-clients')}
            className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'b2b-clients'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>B2B Client Approval Desk ({b2bApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('inventory')}
            className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeAdminTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>Brass Inventory &amp; Stock Manager</span>
          </button>
        </div>

        {/* TAB 1: Shiprocket 1-Click Dispatch & Invoicing Orders Desk */}
        {activeAdminTab === 'orders' && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Shiprocket Logistics &amp; GST Invoicing Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Generate instant scannable Delhivery / BlueDart AWB shipping labels and print official Indian GST invoices.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                  {(['All', 'B2C', 'B2B'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrderFilter(t)}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        orderFilter === t ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {t} Orders
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Order ID, Customer..."
                    className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="py-3 px-3">Order ID / Date</th>
                    <th className="py-3 px-3">Channel</th>
                    <th className="py-3 px-3">Customer &amp; Destination</th>
                    <th className="py-3 px-3">SKU &amp; Quantity</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Dispatch Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isDispatched = order.orderStatus === 'Dispatched';
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-900 block">{order.id}</span>
                            <span className="text-[10px] text-slate-400">{order.date}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.type === 'B2B'
                                  ? 'bg-[#111827] text-[#D4AF37]'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {order.type}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">{order.customerName}</div>
                            <span className="text-[10px] text-slate-500 block">
                              {order.city}, {order.state} · {order.customerPhone}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="line-clamp-1">
                                {i.quantity}x {i.productName} ({i.sku})
                              </div>
                            ))}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {formatCurrency(order.grandTotal, currency)}
                          </td>
                          <td className="py-3 px-3">
                            {isDispatched ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Dispatched ({order.courier})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{order.orderStatus}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Generate AWB & Dispatch Button */}
                              {!isDispatched ? (
                                <button
                                  onClick={() => onGenerateAwbAndDispatch(order.id)}
                                  className="px-2.5 py-1.5 bg-linear-to-r from-[#F5D061] to-[#D4AF37] hover:from-[#FFE285] hover:to-[#DFB73E] text-slate-950 font-bold rounded text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                  title="Generate Shiprocket Barcode & Mark Dispatched"
                                >
                                  <Barcode className="w-3.5 h-3.5" />
                                  <span>Generate AWB &amp; Dispatch</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => onViewShippingLabel(order)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                  title="View Barcode Shipping Label"
                                >
                                  <Barcode className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Label</span>
                                </button>
                              )}

                              {/* View Tax Invoice Button */}
                              <button
                                onClick={() => onViewInvoice(order)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                title="Render Indian GST Tax Invoice"
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-300" />
                                <span>View Tax Invoice</span>
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

        {/* TAB 2: B2B Client Approval Desk */}
        {activeAdminTab === 'b2b-clients' && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#9E7A1C]" />
                  <span>B2B Wholesale Client Approval &amp; Credit Desk</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review international and domestic wholesale applications, verified GSTIN certificates, and allocate credit lines.
                </p>
              </div>

              <span className="text-xs bg-amber-50 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-200">
                {b2bApplications.filter((a) => a.status === 'Pending Verification').length} Pending Audits
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="py-2.5 px-3">App ID / Date</th>
                    <th className="py-2.5 px-3">Company &amp; Contact</th>
                    <th className="py-2.5 px-3">Country / Jurisdiction</th>
                    <th className="py-2.5 px-3">Tax ID / GSTIN</th>
                    <th className="py-2.5 px-3">Annual Volume Estimate</th>
                    <th className="py-2.5 px-3">Attached Document</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {b2bApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{app.id}</span>
                        <span className="text-[10px] text-slate-400">{app.appliedDate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{app.companyName}</strong>
                        <span className="text-slate-500 text-[11px]">{app.contactPerson}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{app.email}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {app.country}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                        {app.gstinOrTaxId}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {app.annualVolumeEstimate}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-blue-700 font-semibold cursor-pointer hover:underline text-[11px]">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{app.certificateFileName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {app.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Approved (₹{(app.creditLimitInr / 100000).toFixed(1)}L Credit)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Audit
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {app.status !== 'Approved' ? (
                          <button
                            type="button"
                            onClick={() => handleApproveApplication(app.id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer ml-auto"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>1-Click Approve</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-semibold">Active Tier 3 Access</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: Inventory Stock Manager */}
        {activeAdminTab === 'inventory' && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Moradabad Brass Inventory &amp; Stock Manager
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust active warehouse inventory quantities. Items below 15 units trigger automated low-brass replenishment flags.
                </p>
              </div>

              <div className="text-xs text-slate-600">
                Total Stock: <strong className="text-slate-900">{totalInventoryUnits} pieces</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => {
                const isLow = prod.stock < 15;
                return (
                  <div
                    key={prod.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isLow ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded border border-slate-200 bg-white overflow-hidden shrink-0">
                        <ProductArtwork productId={prod.id} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block">{prod.sku}</span>
                        <span className="text-[10px] text-slate-500">Gross: {prod.grossWeightGrams}g</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateProductStock(prod.id, Math.max(0, prod.stock - 5))}
                          className="w-7 h-7 rounded border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                        >
                          -5
                        </button>
                        <span className="w-12 text-center font-bold font-mono text-sm text-slate-900">
                          {prod.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateProductStock(prod.id, prod.stock + 10)}
                          className="w-7 h-7 rounded border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                        >
                          +10
                        </button>
                      </div>

                      {isLow ? (
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                          Low Stock!
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Optimal Stock
                        </span>
                      )}
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
