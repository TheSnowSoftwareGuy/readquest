import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'

const EMOJIS = [
  { emoji: '😍', label: 'Loved it!' },
  { emoji: '🤩', label: 'Amazing!' },
  { emoji: '😊', label: 'Liked it' },
  { emoji: '🤔', label: 'It was okay' },
  { emoji: '😴', label: 'Boring' },
  { emoji: '😢', label: 'Made me sad' },
]

const VISIBILITY_OPTIONS = [
  { value: 'class', label: '🏫 Class Only', desc: 'Only your classmates can see' },
  { value: 'school', label: '🏛️ My School', desc: 'Anyone at your school' },
  { value: 'public', label: '🌍 Public', desc: 'All ReadQuest readers' },
]

const MAX_CHARS = 1000
const MIN_CHARS = 10

/**
 * Book review form with star rating, emoji option, spoiler toggle, visibility.
 *
 * Props:
 *   bookId       — UUID of the book being reviewed
 *   bookTitle    — for display
 *   onSubmit     — callback after successful submit (review obj)
 *   onCancel     — close / cancel handler
 *   existingReview — if editing, pre-fill data
 */
export default function ReviewForm({ bookId, bookTitle, onSubmit, onCancel, existingReview }) {
  const [starRating, setStarRating] = useState(existingReview?.rating || 0)
  const [hoverStar, setHoverStar] = useState(0)
  const [emojiRating, setEmojiRating] = useState(existingReview?.emoji_rating || null)
  const [reviewText, setReviewText] = useState(existingReview?.content || '')
  const [hasSpoilers, setHasSpoilers] = useState(existingReview?.has_spoilers || false)
  const [visibility, setVisibility] = useState(existingReview?.visibility || 'class')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [mode, setMode] = useState('stars') // 'stars' | 'emoji'

  const charCount = reviewText.length
  const isValid = starRating > 0 || emojiRating

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    setSubmitting(true)
    setError(null)

    const reviewData = {
      book_id: bookId,
      rating: starRating || 3, // Default to 3 for emoji-only
      content: reviewText.trim() || null,
      emoji_rating: emojiRating,
      has_spoilers: hasSpoilers,
      visibility,
    }

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('You need to be signed in to write a review.')
          setSubmitting(false)
          return
        }

        const { data, error: dbError } = await supabase
          .from('reviews')
          .upsert({ ...reviewData, user_id: user.id }, { onConflict: 'user_id,book_id' })
          .select()
          .single()

        if (dbError) throw dbError
        setSuccess(true)
        onSubmit?.(data)
      } catch (err) {
        console.error('Error submitting review:', err)
        setError('Something went wrong. Please try again!')
      }
    } else {
      // Demo mode — simulate success
      await new Promise((r) => setTimeout(r, 800))
      const demoReview = {
        id: `demo-${Date.now()}`,
        ...reviewData,
        user_id: 'demo-user',
        reviewer_name: 'Jayden M.',
        helpful_count: 0,
        created_at: new Date().toISOString(),
      }
      setSuccess(true)
      onSubmit?.(demoReview)
    }

    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <span className="text-4xl block mb-2">🎉</span>
        <h3 className="font-display font-bold text-lg text-green-800">Review Submitted!</h3>
        <p className="text-sm text-green-600 mt-1">Thanks for sharing your thoughts. +15 XP earned! ⚡</p>
        <button
          onClick={() => { setSuccess(false); setStarRating(0); setEmojiRating(null); setReviewText(''); }}
          className="mt-3 text-sm text-rq-purple hover:underline font-semibold"
        >
          Write another review
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-purple-50 shadow-sm p-6">
      <h3 className="font-display font-bold text-lg mb-1">✍️ Write a Review</h3>
      {bookTitle && <p className="text-sm text-rq-muted mb-4">for <span className="font-semibold text-rq-purple">{bookTitle}</span></p>}

      {/* Rating mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('stars')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'stars'
              ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow'
              : 'bg-gray-100 text-rq-muted hover:bg-gray-200'
          }`}
        >
          ⭐ Star Rating
        </button>
        <button
          type="button"
          onClick={() => setMode('emoji')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'emoji'
              ? 'bg-gradient-to-r from-rq-orange to-rq-yellow text-white shadow'
              : 'bg-gray-100 text-rq-muted hover:bg-gray-200'
          }`}
        >
          😊 Emoji Rating
        </button>
      </div>

      {/* Star Rating */}
      {mode === 'stars' && (
        <div className="mb-4">
          <label className="text-sm font-semibold text-rq-text block mb-2">How many stars?</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStarRating(star)}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                className={`text-3xl transition-transform duration-150 hover:scale-125 ${
                  star <= (hoverStar || starRating)
                    ? 'text-yellow-400 drop-shadow-sm'
                    : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
            {starRating > 0 && (
              <span className="ml-2 text-sm text-rq-muted self-center">
                {['', 'Not great', 'Okay', 'Good', 'Great', 'Amazing!'][starRating]}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Emoji Rating */}
      {mode === 'emoji' && (
        <div className="mb-4">
          <label className="text-sm font-semibold text-rq-text block mb-2">How did this book make you feel?</label>
          <div className="flex gap-2 flex-wrap">
            {EMOJIS.map(({ emoji, label }) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setEmojiRating(emojiRating === emoji ? null : emoji)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                  emojiRating === emoji
                    ? 'bg-orange-100 border-2 border-rq-orange shadow-md scale-110'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:scale-105'
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-[10px] text-rq-muted mt-0.5">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review text */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-rq-text block mb-2">
          Your Review <span className="font-normal text-rq-muted">(optional)</span>
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="What did you think about this book? What was your favorite part?"
          rows={4}
          className="w-full border border-purple-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rq-purple/30 focus:border-rq-purple resize-none transition-all"
        />
        <div className="flex justify-between mt-1">
          <span className={`text-xs ${charCount > 0 && charCount < MIN_CHARS ? 'text-orange-500' : 'text-rq-muted'}`}>
            {charCount > 0 && charCount < MIN_CHARS && `At least ${MIN_CHARS} characters please`}
          </span>
          <span className={`text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-orange-500 font-semibold' : 'text-rq-muted'}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Spoiler toggle */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer group">
        <input
          type="checkbox"
          checked={hasSpoilers}
          onChange={(e) => setHasSpoilers(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-rq-purple focus:ring-rq-purple/30"
        />
        <span className="text-sm text-rq-muted group-hover:text-rq-text transition-colors">
          🤫 Contains spoilers
        </span>
      </label>

      {/* Visibility */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-rq-text block mb-2">Who can see this review?</label>
        <div className="flex gap-2 flex-wrap">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVisibility(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                visibility === opt.value
                  ? 'bg-purple-100 text-rq-purple border-2 border-rq-purple/30'
                  : 'bg-gray-50 text-rq-muted border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div>{opt.label}</div>
              <div className="font-normal mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-2 mb-4">{error}</div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!isValid || submitting || (charCount > 0 && charCount < MIN_CHARS)}
          className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all ${
            isValid && !submitting
              ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            '📝 Submit Review'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full font-bold text-sm bg-gray-100 text-rq-muted hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
