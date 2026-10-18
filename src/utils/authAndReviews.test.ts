import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateReviewStats,
  filterAndSortReviews,
  validateRegistration,
  validateLogin,
  toggleWishlistItem,
  generateConciergeReply,
} from './authAndReviews.ts';
import type { Review } from '../types/index.ts';

const mockReviews: Review[] = [
  {
    id: 'rev-01',
    productId: 'tz-urli-royal-01',
    authorName: 'Ananya Deshmukh',
    authorEmail: 'ananya@example.com',
    rating: 5,
    title: 'Exquisite royal craftsmanship',
    comment: 'The water ripples and brass luster transformed my Diwali living room.',
    date: '14 Oct 2026',
    verifiedPurchase: true,
    helpfulCount: 18,
  },
  {
    id: 'rev-02',
    productId: 'tz-urli-royal-01',
    authorName: 'Vikramaditya Oberoi',
    authorEmail: 'vikram@example.com',
    rating: 4,
    title: 'Heavy and authentic solid brass',
    comment: 'Very solid heft and beautiful finish. Arrived in a secure wooden crate.',
    date: '12 Oct 2026',
    verifiedPurchase: true,
    helpfulCount: 9,
  },
  {
    id: 'rev-03',
    productId: 'tz-urli-royal-01',
    authorName: 'Rohit K.',
    authorEmail: 'rohit@example.com',
    rating: 5,
    title: 'A true Moradabad heirloom',
    comment: 'Much better than lightweight market brass. Truly 99.8% virgin ingot.',
    date: '10 Oct 2026',
    verifiedPurchase: false,
    helpfulCount: 4,
  },
];

test('calculateReviewStats accurately computes average and star percentages', () => {
  const stats = calculateReviewStats(mockReviews);
  assert.equal(stats.reviewCount, 3);
  // (5 + 4 + 5) / 3 = 14 / 3 = 4.666 -> rounded to 4.7
  assert.equal(stats.averageRating, 4.7);
  assert.equal(stats.distribution[5].count, 2);
  assert.equal(stats.distribution[4].count, 1);
  assert.equal(stats.distribution[3].count, 0);
  assert.equal(stats.distribution[5].percentage, 67);
  assert.equal(stats.distribution[4].percentage, 33);
});

test('calculateReviewStats handles empty reviews gracefully', () => {
  const empty = calculateReviewStats([]);
  assert.equal(empty.averageRating, 0);
  assert.equal(empty.reviewCount, 0);
  assert.equal(empty.distribution[5].count, 0);
});

test('filterAndSortReviews filters by verified and sorts by rating', () => {
  const verifiedOnly = filterAndSortReviews(mockReviews, 'verified');
  assert.equal(verifiedOnly.length, 2);
  assert.ok(verifiedOnly.every((r) => r.verifiedPurchase));

  const highestFirst = filterAndSortReviews(mockReviews, 'highest');
  assert.equal(highestFirst[0].rating, 5);
  assert.equal(highestFirst[highestFirst.length - 1].rating, 4);

  const fiveStarOnly = filterAndSortReviews(mockReviews, 'recent', 5);
  assert.equal(fiveStarOnly.length, 2);
});

test('validateRegistration checks name, email, phone, and password length', () => {
  const valid = validateRegistration({
    name: 'Atir Rais',
    email: 'atir@tagzee.in',
    phone: '7351366786',
    password: 'securePass123',
  });
  assert.equal(valid.isValid, true);

  const invalidEmail = validateRegistration({
    name: 'Atir Rais',
    email: 'invalid-email',
    phone: '7351366786',
    password: 'securePass123',
  });
  assert.equal(invalidEmail.isValid, false);
  assert.ok(invalidEmail.error);

  const shortPassword = validateRegistration({
    name: 'Atir Rais',
    email: 'atir@tagzee.in',
    phone: '7351366786',
    password: '123',
  });
  assert.equal(shortPassword.isValid, false);
});

test('validateLogin enforces non-empty fields and valid email format', () => {
  assert.equal(validateLogin({ email: 'user@example.com', password: 'password' }).isValid, true);
  assert.equal(validateLogin({ email: 'bad-email', password: 'password' }).isValid, false);
  assert.equal(validateLogin({ email: 'user@example.com', password: '' }).isValid, false);
});

test('toggleWishlistItem adds and removes product IDs', () => {
  const initial = ['tz-urli-royal-01'];
  const added = toggleWishlistItem(initial, 'tz-peacock-lamp-02');
  assert.equal(added.isSaved, true);
  assert.deepEqual(added.updatedItemIds, ['tz-urli-royal-01', 'tz-peacock-lamp-02']);

  const removed = toggleWishlistItem(added.updatedItemIds, 'tz-urli-royal-01');
  assert.equal(removed.isSaved, false);
  assert.deepEqual(removed.updatedItemIds, ['tz-peacock-lamp-02']);
});

test('generateConciergeReply returns domain answers for purity and export', () => {
  const purityReply = generateConciergeReply('Is this pure brass or mixed?');
  assert.ok(purityReply.includes('99.8% pure virgin brass'));

  const exportReply = generateConciergeReply('What is the wholesale MOQ for export?');
  assert.ok(exportReply.includes('MOQ is 20 units'));
});
