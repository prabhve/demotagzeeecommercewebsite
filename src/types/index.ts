export type Currency = 'INR' | 'USD' | 'EUR';

export type Incoterm = 'Ex-Works' | 'FOB' | 'CIF';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Metal Handicrafts' | 'Home & Kitchen' | 'Garden Decor' | 'Ornaments';
  mrp: number;
  offerPrice: number;
  b2bSlabs: {
    tier1: { min: number; max: number; price: number; discountPercent: number };
    tier2: { min: number; max: number; price: number; discountPercent: number };
    tier3: { min: number; max: number; price: number; discountPercent: number };
  };
  pureBrassPurity: string; // e.g. "Certified 99.4% Metallurgical Purity | Lab-Tested Anti-Tarnish Lacquer"
  finish: string;
  weightKg: number;
  grossWeightGrams: number; // e.g. 1850 for 1,850g
  emotionalHook: string; // e.g. "The Conversation Starter of Your Living Room"
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
  incoterm: Incoterm;
  subtotalInr: number;
  subtotalUsd: number;
  subtotalEur: number;
  totalGrossWeightKg: number;
  totalCartons: number;
  totalCbm: number;
  totalPallets: number;
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

export interface B2BClientApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  gstinOrTaxId: string;
  annualVolumeEstimate: string;
  appliedDate: string;
  status: 'Pending Verification' | 'Approved' | 'Requires Documentation';
  creditLimitInr: number;
  certificateFileName: string;
}
