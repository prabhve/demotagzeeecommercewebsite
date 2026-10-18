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
} from 'lucide-react';
import type { Order, Product, Currency } from '../types/index.ts';
import { BRAND_INFO } from '../data/catalog.ts';
import { formatCurrency } from '../utils/pricing.ts';

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
  const [orderFilter, setOrderFilter] = useState<'All' | 'B2C' | 'B2B'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations for Executive KPI Dashboard
  const b2cOrders = orders.filter((o) => o.type === 'B2C');
  const b2bOrders = orders.filter((o) => o.type === 'B2B');

  const b2cRevenue = b2cOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const b2bRevenue = b2bOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalRevenue = b2cRevenue + b2bRevenue;

  const pendingDispatches = orders.filter(
    (o) => o.orderStatus === 'Ready for Dispatch' || o.orderStatus === 'Confirmed'
  ).length;

  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const inventoryValuation = products.reduce((sum, p) => sum + p.stock * p.offerPrice, 0);

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

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-slate-900 pb-16">
      {/* Admin Top Header */}
      <div className="bg-[#111827] text-white border-b-2 border-amber-600 px-4 sm:px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                TAG ZEE Enterprise Operations
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                Foundry Node: Moradabad (244001)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5">
              Executive KPI &amp; Dispatch Console
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Operating Directors: <strong>{BRAND_INFO.owners}</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* SECTION 1: Executive KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: B2C Revenue */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Retail B2C Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatCurrency(b2cRevenue, currency)}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                {b2cOrders.length} Completed Retail Orders
              </span>
            </div>
          </div>

          {/* Card 2: B2B Wholesale & Export Inquiries */}
          <div className="bg-white p-5 rounded-xl border border-[#D4AF37]/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                B2B Export Value
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-amber-950 font-mono">
                {formatCurrency(b2bRevenue, currency)}
              </div>
              <span className="text-[11px] text-amber-800 font-semibold block mt-1">
                {b2bOrders.length} Container Lots Transacted
              </span>
            </div>
          </div>

          {/* Card 3: Pending Shipments */}
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
                {pendingDispatches} Parcels
              </div>
              <span className="text-[11px] text-blue-700 font-semibold block mt-1">
                Shiprocket 1-Click Dispatch Ready
              </span>
            </div>
          </div>

          {/* Card 4: Inventory Valuation & Low Brass Count */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Foundry Stock Valuation
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatCurrency(inventoryValuation, currency)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-slate-500">
                  {totalInventoryUnits} units on floor
                </span>
                {lowStockProducts.length > 0 && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                    {lowStockProducts.length} Low Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Product & Stock Manager (With Low Brass Alert Badges) */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Product &amp; Foundry Stock Manager
              </h2>
              <p className="text-xs text-slate-500">
                Real-time brass inventory replenishment. Automated alert triggers on stock under 15 units.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Threshold:</span>
              <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200">
                Low Brass Alert (&lt; 15 units)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">SKU &amp; Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Unit Weight</th>
                  <th className="py-2.5 px-3">Retail Price</th>
                  <th className="py-2.5 px-3">Live Stock</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const isLow = product.stock < 15;
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{product.sku}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{product.category}</td>
                      <td className="py-3 px-3 text-slate-600 font-mono">{product.weightKg} kg</td>
                      <td className="py-3 px-3 font-semibold text-slate-800 font-mono">
                        {formatCurrency(product.offerPrice, currency)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {product.stock} pcs
                      </td>
                      <td className="py-3 px-3">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Brass ({product.stock} units)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Optimal Stock</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onUpdateProductStock(product.id, Math.max(0, product.stock - 5))}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Decrease 5 units"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onUpdateProductStock(product.id, product.stock + 10)}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                            title="Restock 10 units"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: Shiprocket 1-Click Dispatch Engine & Orders Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#9E7A1C]" />
                <h2 className="text-lg font-bold text-slate-900 font-serif">
                  Shiprocket 1-Click Dispatch &amp; Tax Invoice Engine
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate scannable AWB barcode labels (Delhivery / Blue Dart / DHL) and official Indian GST Tax Invoices.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                {(['All', 'B2C', 'B2B'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOrderFilter(tab)}
                    className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                      orderFilter === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID or buyer..."
                  className="pl-7 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Order ID &amp; Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Customer / Organization</th>
                  <th className="py-2.5 px-3">Items Summary</th>
                  <th className="py-2.5 px-3">Grand Total</th>
                  <th className="py-2.5 px-3">Dispatch Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isDispatched = order.orderStatus === 'Dispatched';
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold font-mono text-slate-900">{order.id}</div>
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
                              {i.quantity}x {i.productName}
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
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center gap-1"
                                title="View Barcode Shipping Label"
                              >
                                <Barcode className="w-3.5 h-3.5 text-slate-600" />
                                <span>Label</span>
                              </button>
                            )}

                            {/* View Tax Invoice Button */}
                            <button
                              onClick={() => onViewInvoice(order)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-semibold flex items-center gap-1"
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
      </div>
    </div>
  );
};
