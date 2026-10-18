import type { Review, User } from '../types/index.ts';

/**
 * Calculate average rating, review count, and star distribution (1 to 5 stars)
 */
export function calculateReviewStats(reviews: Review[]): {
  averageRating: number;
  reviewCount: number;
  distribution: { [star: number]: { count: number; percentage: number } };
} {
  const distribution: { [star: number]: { count: number; percentage: number } } = {
    5: { count: 0, percentage: 0 },
    4: { count: 0, percentage: 0 },
    3: { count: 0, percentage: 0 },
    2: { count: 0, percentage: 0 },
    1: { count: 0, percentage: 0 },
  };

  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      reviewCount: 0,
      distribution,
    };
  }

  let totalScore = 0;
  reviews.forEach((r) => {
    totalScore += r.rating;
    const clampedRating = Math.max(1, Math.min(5, Math.round(r.rating)));
    if (distribution[clampedRating]) {
      distribution[clampedRating].count += 1;
    }
  });

  const reviewCount = reviews.length;
  const rawAvg = totalScore / reviewCount;
  const averageRating = Math.round(rawAvg * 10) / 10;

  for (let star = 1; star <= 5; star++) {
    distribution[star].percentage = Math.round((distribution[star].count / reviewCount) * 100);
  }

  return {
    averageRating,
    reviewCount,
    distribution,
  };
}

/**
 * Filter and sort reviews
 */
export function filterAndSortReviews(
  reviews: Review[],
  sortBy: 'recent' | 'highest' | 'lowest' | 'verified' = 'recent',
  filterRating?: number
): Review[] {
  let filtered = [...reviews];

  if (filterRating && filterRating >= 1 && filterRating <= 5) {
    filtered = filtered.filter((r) => Math.round(r.rating) === filterRating);
  }

  if (sortBy === 'verified') {
    filtered = filtered.filter((r) => r.verifiedPurchase);
  }

  return filtered.sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    // Default: recent (newest timestamp / id)
    return b.id.localeCompare(a.id);
  });
}

/**
 * Validate Registration Form
 */
export function validateRegistration(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): { isValid: boolean; error?: string } {
  if (!data.name.trim() || data.name.trim().length < 2) {
    return { isValid: false, error: 'Please enter your full name (at least 2 characters).' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  const cleanPhone = data.phone.replace(/[\s-]/g, '');
  if (cleanPhone.length < 10) {
    return { isValid: false, error: 'Please enter a valid 10-digit mobile number.' };
  }
  if (!data.password || data.password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
}

/**
 * Validate Login Form
 */
export function validateLogin(data: {
  email: string;
  password: string;
}): { isValid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  if (!data.password || data.password.trim().length === 0) {
    return { isValid: false, error: 'Password cannot be empty.' };
  }
  return { isValid: true };
}

/**
 * Toggle Wishlist item
 */
export function toggleWishlistItem(
  savedItemIds: string[],
  productId: string
): { updatedItemIds: string[]; isSaved: boolean } {
  const exists = savedItemIds.includes(productId);
  if (exists) {
    return {
      updatedItemIds: savedItemIds.filter((id) => id !== productId),
      isSaved: false,
    };
  }
  return {
    updatedItemIds: [...savedItemIds, productId],
    isSaved: true,
  };
}

/**
 * Automated Moradabad Atelier Concierge Responses for Live Chat
 */
export function generateConciergeReply(
  userQuery: string,
  context?: { activeProductName?: string }
): string {
  const q = userQuery.toLowerCase();

  if (q.includes('custom') || q.includes('dimension') || q.includes('size')) {
    return `Yes! At our Moradabad atelier in Jigar Colony, master artisans Zeefaham Rais and Atir Rais accommodate bespoke brass casting dimensions. For orders of 5+ pieces or architectural installations, we cast custom lathe molds. Would you like us to connect you on WhatsApp at +91 7351366786?`;
  }

  if (q.includes('purity') || q.includes('pure') || q.includes('lead') || q.includes('material') || q.includes('virgin')) {
    return `All TAG ZEE artware is poured from 99.8% pure virgin brass ingots. We do not use scrap metal. Each batch is 100% lead-free, non-toxic, and sealed with a baked transparent organic anti-tarnish nano-coating that lasts 5+ years without blackening.`;
  }

  if (q.includes('track') || q.includes('dispatch') || q.includes('awb') || q.includes('shipping')) {
    return `Domestic orders in India are dispatched within 24 hours via Delhivery Air or Blue Dart Express from Moradabad. You can track your AWB tracking code directly in your Profile > Past Orders tab, or WhatsApp our dispatch desk at +91 7248257721.`;
  }

  if (q.includes('export') || q.includes('b2b') || q.includes('wholesale') || q.includes('moq')) {
    return `Our B2B export desk is directly managed by director Atir Rais. Minimum export MOQ is 20 units per SKU with factory direct container rates starting at ₹780/pc. You can generate an instant PDF Proforma Invoice in the B2B tab or ping Atir Rais directly on WhatsApp (+91 7351366786).`;
  }

  if (q.includes('care') || q.includes('clean') || q.includes('wash')) {
    return `To clean your polished brass pieces, simply wipe with a soft dry microfiber cloth. Because our pieces have an organic protective lacquer, avoid harsh steel wool, lemon, or tamarind pastes unless restoring raw unlacquered copper.`;
  }

  return `Greetings from TAG ZEE Moradabad Atelier! Director Atir Rais and our master coppersmiths are currently on the foundry floor. We have noted your message: "${userQuery}". How else can we assist your decor curation today?`;
}
