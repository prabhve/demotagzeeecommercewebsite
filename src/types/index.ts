export type Currency = 'INR' | 'USD';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Metal Handicrafts' | 'Home & Kitchen' | 'Garden Decor' | 'Ornaments';
  mrp: number;
  offerPrice: number;
  b2bSlabs: {
    tier1: { min: 20; max: 49; price: number; discountPercent: number };
    tier2: { min: 50; max: 99; price: number; discountPercent: number };
    tier3: { min: 100; max: 10000; price: number; discountPercent: number };
  };
  pureBrassPurity: string; // e.g. "99.8% Pure Virgin Brass"
  finish: string;
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  cbmPerUnit: number;
  unitsPerMasterCarton: number;
  stock: number;
  inStock: boolean;
  hsnCode: string; // 7418 for Brass Artware
  description: string;
  features: string[];
  careInstructions: string;
  artisanProvenance: string;
  artisanName: string;
  rating: number;
  reviewCount: number;
  imageAlt: string;
  badge?: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  isB2B?: boolean;
}

export interface PortOption {
  id: string;
  name: string;
  country: string;
  type: 'Sea' | 'Air';
  baseFreightPerCbmInr: number;
  airRatePerKgInr: number;
  transitDaysSea: string;
  transitDaysAir: string;
}

export interface RfqCalculation {
  product: Product;
  quantity: number;
  unitPrice: number;
  slabTier: string;
  subtotalInr: number;
  subtotalUsd: number;
  totalGrossWeightKg: number;
  totalCartons: number;
  totalCbm: number;
  dutyDrawbackInr: number; // RoDTEP export drawback 3.5%
  estimatedSeaFreightInr: number;
  estimatedAirFreightInr: number;
  port: PortOption;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  type: 'B2C' | 'B2B';
  items: {
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    hsnCode: string;
  }[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'Razorpay UPI/Cards' | 'NEFT/RTGS Transfer' | 'Cash on Delivery (COD)';
  paymentStatus: 'Paid' | 'Pending Verification';
  orderStatus: 'Confirmed' | 'Processing' | 'Ready for Dispatch' | 'Dispatched' | 'Delivered';
  awbNumber?: string;
  courier?: 'Delhivery Air' | 'Blue Dart Express' | 'DHL Global Forwarding';
  gstin?: string;
  companyName?: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorEmail: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  companyName?: string;
  gstin?: string;
  savedItemIds: string[]; // Wishlist product IDs
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  quickAction?: string;
}

export interface AgentInfo {
  name: string;
  role: string;
  avatarInitials: string;
  status: 'Online' | 'In Foundry Workshop' | 'Away';
  typicalResponseTime: string;
}
