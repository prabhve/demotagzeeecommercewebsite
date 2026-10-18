import React, { useState } from 'react';
import type { CartItem, Currency, Order, Product, RfqCalculation, Review, User } from './types/index.ts';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_USER } from './data/catalog.ts';
import { Navbar } from './components/Navbar.tsx';
import { B2CStorefront } from './components/B2CStorefront.tsx';
import { B2BExportPortal } from './components/B2BExportPortal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ShippingLabelModal } from './components/ShippingLabelModal.tsx';
import { TaxInvoiceModal } from './components/TaxInvoiceModal.tsx';
import { ProformaModal } from './components/ProformaModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { UserProfileDrawer } from './components/UserProfileDrawer.tsx';
import { ChatSupportWidget } from './components/ChatSupportWidget.tsx';
import { toggleWishlistItem } from './utils/authAndReviews.ts';
import { CheckCircle2, FileText, Barcode, ArrowRight, X } from 'lucide-react';

export default function App() {
  // 3-Way Live Workspace Switcher Tab
  const [activeTab, setActiveTab] = useState<'b2c' | 'b2b' | 'admin'>('b2c');
  const [currency, setCurrency] = useState<Currency>('INR');

  // Application Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Authenticated User State (defaults to Ananya Deshmukh for instantaneous testing and exploration)
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Cart State (Initialized with 1 Royal Urli item for instant interactive exploration)
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [activeShippingLabelOrder, setActiveShippingLabelOrder] = useState<Order | null>(null);
  const [activeTaxInvoiceOrder, setActiveTaxInvoiceOrder] = useState<Order | null>(null);
  const [activeProforma, setActiveProforma] = useState<{
    rfq: RfqCalculation;
    companyName: string;
    gstin: string;
  } | null>(null);

  // Success Notification Banner
  const [recentOrderSuccess, setRecentOrderSuccess] = useState<Order | null>(null);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist / Saved items toggle
  const handleToggleWishlist = (productId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const { updatedItemIds } = toggleWishlistItem(currentUser.savedItemIds, productId);
    setCurrentUser({
      ...currentUser,
      savedItemIds: updatedItemIds,
    });
  };

  // Add Product Review & live rating calculation
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      helpfulCount: 0,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update target product's average rating and reviewCount
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === newReviewData.productId) {
          const productReviews = [newReview, ...reviews.filter((r) => r.productId === prod.id)];
          const avg =
            Math.round(
              (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length) * 10
            ) / 10;
          return {
            ...prod,
            rating: avg,
            reviewCount: productReviews.length,
          };
        }
        return prod;
      })
    );

    // If modal is open, also sync the selectedProduct state
    if (selectedProductForModal && selectedProductForModal.id === newReviewData.productId) {
      const updatedReviews = [newReview, ...reviews.filter((r) => r.productId === selectedProductForModal.id)];
      const avg =
        Math.round(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length) * 10
        ) / 10;
      setSelectedProductForModal({
        ...selectedProductForModal,
        rating: avg,
        reviewCount: updatedReviews.length,
      });
    }
  };

  // Checkout submission
  const handleCheckoutSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Decrement stock for purchased items
    setProducts((prev) =>
      prev.map((prod) => {
        const purchased = newOrder.items.find((i) => i.sku === prod.sku);
        if (purchased) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - purchased.quantity),
          };
        }
        return prod;
      })
    );

    // Clear cart
    setCart([]);
    setRecentOrderSuccess(newOrder);
  };

  // Admin: Stock update
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  // Admin: 1-Click Shiprocket dispatch & AWB generation
  const handleGenerateAwbAndDispatch = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const generatedAwb = `DEL-AIR-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const updatedOrder: Order = {
      ...targetOrder,
      orderStatus: 'Dispatched',
      awbNumber: generatedAwb,
      courier: targetOrder.type === 'B2B' ? 'DHL Global Forwarding' : 'Delhivery Air',
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    // Instantly open the barcode label for preview
    setActiveShippingLabelOrder(updatedOrder);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-slate-950">
      {/* Sticky Navbar with 3-Way Live Workspace Switcher & User Account / Wishlist */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => {
          if (currentUser) {
            setIsProfileDrawerOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        wishlistCount={currentUser ? currentUser.savedItemIds.length : 0}
      />

      {/* Recent Order Toast Notification Bar */}
      {recentOrderSuccess && (
        <div className="bg-emerald-900 text-white px-4 py-3 border-b border-emerald-700 shadow-md animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Order <strong>{recentOrderSuccess.id}</strong> confirmed! Payment verified via {recentOrderSuccess.paymentMethod}.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTaxInvoiceOrder(recentOrderSuccess);
                }}
                className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 rounded font-semibold text-white flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>View Tax Invoice</span>
              </button>
              <button
                onClick={() => {
                  setActiveShippingLabelOrder(recentOrderSuccess);
                }}
                className="px-2.5 py-1 bg-[#D4AF37] hover:bg-amber-400 text-slate-950 rounded font-bold flex items-center gap-1 cursor-pointer"
              >
                <Barcode className="w-3.5 h-3.5" />
                <span>Print Shipping Label</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setRecentOrderSuccess(null);
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Admin</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setRecentOrderSuccess(null)}
                className="p-1 text-emerald-300 hover:text-white"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Body based on Active Switcher */}
      <main className="flex-1">
        {activeTab === 'b2c' && (
          <B2CStorefront
            products={products}
            currency={currency}
            onAddToCart={handleAddToCart}
            onSelectProduct={(product) => setSelectedProductForModal(product)}
            onSwitchToB2B={() => setActiveTab('b2b')}
            searchQuery={searchQuery}
            savedItemIds={currentUser?.savedItemIds || []}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === 'b2b' && (
          <B2BExportPortal
            products={products}
            currency={currency}
            onOpenProformaModal={(rfq, companyName, gstin) => {
              setActiveProforma({ rfq, companyName, gstin });
            }}
            initialSelectedProduct={selectedProductForModal}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            orders={orders}
            products={products}
            currency={currency}
            onUpdateProductStock={handleUpdateProductStock}
            onGenerateAwbAndDispatch={handleGenerateAwbAndDispatch}
            onViewInvoice={(order) => setActiveTaxInvoiceOrder(order)}
            onViewShippingLabel={(order) => setActiveShippingLabelOrder(order)}
          />
        )}
      </main>

      {/* Product Detail Modal (PDP) with Reviews & Wishlist */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          currency={currency}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={handleAddToCart}
          onOpenB2BTabWithProduct={(product) => {
            setActiveTab('b2b');
            setSelectedProductForModal(product);
          }}
          reviews={reviews.filter((r) => r.productId === selectedProductForModal.id)}
          currentUser={currentUser}
          onAddReview={handleAddReview}
          isWishlisted={currentUser ? currentUser.savedItemIds.includes(selectedProductForModal.id) : false}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* User Authentication Modal (Login / Register / Quick Switch) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* User Profile Drawer (Profile, Past Orders with Invoices & AWB, Saved Wishlist Items) */}
      <UserProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        user={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onLogout={() => {
          setCurrentUser(null);
          setIsProfileDrawerOpen(false);
        }}
        orders={orders}
        products={products}
        currency={currency}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleToggleWishlist}
        onViewInvoice={(order) => {
          setIsProfileDrawerOpen(false);
          setActiveTaxInvoiceOrder(order);
        }}
        onViewShippingLabel={(order) => {
          setIsProfileDrawerOpen(false);
          setActiveShippingLabelOrder(order);
        }}
        onOpenProductModal={(product) => {
          setIsProfileDrawerOpen(false);
          setSelectedProductForModal(product);
        }}
      />

      {/* Real-Time Atelier Concierge Chat Support Widget */}
      <ChatSupportWidget currentUserName={currentUser?.name} />

      {/* Modals for Document Generation */}
      {activeShippingLabelOrder && (
        <ShippingLabelModal
          order={activeShippingLabelOrder}
          onClose={() => setActiveShippingLabelOrder(null)}
        />
      )}

      {activeTaxInvoiceOrder && (
        <TaxInvoiceModal
          order={activeTaxInvoiceOrder}
          onClose={() => setActiveTaxInvoiceOrder(null)}
        />
      )}

      {activeProforma && (
        <ProformaModal
          rfq={activeProforma.rfq}
          companyName={activeProforma.companyName}
          gstin={activeProforma.gstin}
          onClose={() => setActiveProforma(null)}
        />
      )}
    </div>
  );
}
