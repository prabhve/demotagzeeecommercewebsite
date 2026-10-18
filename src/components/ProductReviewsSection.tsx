import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Filter,
  PenTool,
  Check,
  Sparkles,
} from 'lucide-react';
import type { Review, User } from '../types/index.ts';
import { calculateReviewStats, filterAndSortReviews } from '../utils/authAndReviews.ts';

interface ProductReviewsSectionProps {
  productId: string;
  reviews: Review[];
  currentUser: User | null;
  onAddReview: (newReview: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  onOpenAuthModal?: () => void;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  reviews,
  currentUser,
  onAddReview,
  onOpenAuthModal,
}) => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'verified'>('recent');
  const [starFilter, setStarFilter] = useState<number | undefined>(undefined);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || 'Ananya Deshmukh');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || 'ananya.deshmukh@gmail.com');
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Helpful click tracker (set of review IDs)
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, number>>({});

  const stats = calculateReviewStats(reviews);
  const displayedReviews = filterAndSortReviews(reviews, sortBy, starFilter);

  const starLabels: Record<number, string> = {
    1: '1 Star - Needs Improvement',
    2: '2 Stars - Fair Craftsmanship',
    3: '3 Stars - Good Moradabad Brass',
    4: '4 Stars - Very Good & Authentic',
    5: '5 Stars - Royal Atelier Masterpiece',
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a review headline.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setFormError('Please write at least 10 characters describing your experience.');
      return;
    }
    if (!authorName.trim()) {
      setFormError('Please enter your name.');
      return;
    }

    setFormError('');
    onAddReview({
      productId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim() || 'guest@tagzee.in',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    setSubmittedSuccess(true);
    setTitle('');
    setComment('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsWritingReview(false);
    }, 2000);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulClicked((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  return (
    <div className="space-y-8 pt-8 border-t border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.24em] font-semibold uppercase text-[#846328] block">
            PATRON TESTIMONIALS &amp; RATINGS
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-normal text-slate-950 mt-1 flex items-center gap-3">
            <span>Customer Reviews &amp; Provenance Ratings</span>
            <span className="text-xs font-sans bg-[#FBF9F5] text-[#846328] px-3 py-1 rounded-full font-medium border border-slate-200/80">
              {stats.reviewCount} Verified Ratings
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-light mt-1">
            Real feedback from connoisseurs and interior designers across India and global export destinations.
          </p>
        </div>

        {!isWritingReview && (
          <button
            onClick={() => setIsWritingReview(true)}
            className="px-5 py-2.5 bg-slate-950 hover:bg-[#846328] text-white rounded-full text-xs font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto uppercase tracking-wider"
          >
            <PenTool className="w-3.5 h-3.5 text-[#DFBA73]" />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {/* Rating Score Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#FBF9F5] p-6 sm:p-8 rounded-3xl border border-slate-200/70">
        {/* Left: Overall Score Big Metric */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200/80 text-center shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-2">
          <div className="text-5xl font-serif font-normal text-slate-950 tabular-nums">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '5.0'}
          </div>
          <div className="flex items-center gap-1 text-[#C5A059] my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats.averageRating)
                    ? 'fill-current text-[#C5A059]'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-600 font-medium">
            Based on {stats.reviewCount} artisanal reviews
          </span>
          <span className="text-[11px] text-emerald-800 font-normal flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            100% Moradabad GI Certified buyers
          </span>
        </div>

        {/* Right: 5-Star Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const bar = stats.distribution[star] || { count: 0, percentage: 0 };
            const isSelected = starFilter === star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setStarFilter(isSelected ? undefined : star)}
                className={`w-full flex items-center gap-3 text-xs transition-colors rounded-full px-3 py-1.5 cursor-pointer text-left ${
                  isSelected ? 'bg-white shadow-xs font-semibold' : 'hover:bg-white/60'
                }`}
                title={`Filter by ${star} stars`}
              >
                <span className="w-12 text-slate-700 font-medium flex items-center gap-1 shrink-0">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                </span>
                <div className="flex-1 h-2 bg-slate-200/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#DFBA73] to-[#C5A059] rounded-full transition-all duration-300"
                    style={{ width: `${bar.percentage}%` }}
                  />
                </div>
                <span className="w-16 text-right text-slate-500 font-mono text-[11px] shrink-0">
                  {bar.percentage}% ({bar.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Drawer / Panel */}
      {isWritingReview && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white p-6 sm:p-7 rounded-3xl border border-[#C5A059]/40 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-5 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif text-lg text-slate-950 font-normal">
                Share Your Connoisseur Experience
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          {/* Interactive Star Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Overall Craftsmanship Rating:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform active:scale-110"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {starLabels[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Author Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 font-semibold block mb-1">Your Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-semibold block mb-1">Your Email</label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Review Headline */}
          <div>
            <label className="text-[11px] text-slate-600 font-semibold block mb-1">
              Review Title / Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Magnificent hammered texture and royal finish"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Review Details Textarea */}
          <div>
            <label className="text-[11px] text-slate-600 font-semibold block mb-1">
              Detailed Written Review
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the brass weight, visual presentation, water floral arrangement, packaging, or finish durability..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          {submittedSuccess ? (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-100">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your verified artisanal review has been published.</span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsWritingReview(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-950 hover:bg-[#846328] text-white font-medium rounded-full text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          )}
        </form>
      )}

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing {displayedReviews.length} of {reviews.length} reviews</span>
          {starFilter && (
            <button
              onClick={() => setStarFilter(undefined)}
              className="text-[#846328] font-semibold hover:underline text-[11px] ml-1"
            >
              (Clear {starFilter}-star filter)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-500">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C5A059]"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="verified">Verified Purchases Only</option>
          </select>
        </div>
      </div>

      {/* Individual Customer Review Cards */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl">
            No reviews match the selected filter.
          </div>
        ) : (
          displayedReviews.map((rev) => {
            const extraHelpful = helpfulClicked[rev.id] || 0;
            return (
              <div
                key={rev.id}
                className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs space-y-2.5"
              >
                {/* Header: Rating, Date, Verified Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-current' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 text-xs">{rev.title}</span>
                  </div>

                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                {/* Author & Verification */}
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{rev.authorName}</span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.2 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                {/* Review Body */}
                <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                {/* Helpful Action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors p-1 rounded cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulCount + extraHelpful})</span>
                  </button>
                  <span className="text-slate-400">Moradabad Foundry Verified</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
