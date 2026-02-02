import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'

// Demo reviews when Supabase isn't configured
const DEMO_REVIEWS = [
  {
    id: 'demo-1',
    rating: 5,
    content: 'This book was AMAZING! I couldn\'t stop reading it. The ending was so surprising and I loved all the characters. Percy is so funny and brave. I want to read the whole series now!',
    emoji_rating: '😍',
    has_spoilers: false,
    visibility: 'public',
    helpful_count: 12,
    created_at: '2026-01-28T14:30:00Z',
    reviewer_name: 'Maya L.',
    reviewer_avatar: '👧',
  },
  {
    id: 'demo-2',
    rating: 4,
    content: 'Really good book! The part where they go to the Underworld was my favorite. I think the writing is great for kids our age. Some parts were a little scary but in a good way.',
    emoji_rating: '🤩',
    has_spoilers: true,
    visibility: 'school',
    helpful_count: 8,
    created_at: '2026-01-25T10:15:00Z',
    reviewer_name: 'Ethan K.',
    reviewer_avatar: '👦',
  },
  {
    id: 'demo-3',
    rating: 5,
    content: null,
    emoji_rating: '😍',
    has_spoilers: false,
    visibility: 'class',
    helpful_count: 3,
    created_at: '2026-01-22T16:45:00Z',
    reviewer_name: 'Sophia R.',
    reviewer_avatar: '👩',
  },
  {
    id: 'demo-4',
    rating: 3,
    content: 'It was pretty good. I liked the mythology stuff but sometimes it was hard to follow. I think I\'ll try the next one though because my friends say it gets even better.',
    emoji_rating: '😊',
    has_spoilers: false,
    visibility: 'public',
    helpful_count: 5,
    created_at: '2026-01-20T09:00:00Z',
    reviewer_name: 'Liam D.',
    reviewer_avatar: '🧑',
  },
  {
    id: 'demo-5',
    rating: 5,
    content: 'Best book I\'ve ever read!!! I finished it in 3 days because I couldn\'t put it down. The gods are so cool and I love learning about Greek myths. Already started the second book! 📖🔥',
    emoji_rating: null,
    has_spoilers: false,
    visibility: 'public',
    helpful_count: 15,
    created_at: '2026-01-18T11:30:00Z',
    reviewer_name: 'Ava C.',
    reviewer_avatar: '👧',
  },
]

/**
 * Display a list of reviews for a book.
 *
 * Props:
 *   bookId  — UUID of the book
 *   reviews — optionally pass reviews directly (overrides fetch)
 */
export default function ReviewsList({ bookId, reviews: externalReviews }) {
  const [reviews, setReviews] = useState(externalReviews || [])
  const [loading, setLoading] = useState(!externalReviews)
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'helpful'
  const [helpedIds, setHelpedIds] = useState(new Set())
  const [revealedSpoilers, setRevealedSpoilers] = useState(new Set())

  useEffect(() => {
    if (externalReviews) return
    loadReviews()
  }, [bookId])

  async function loadReviews() {
    setLoading(true)
    if (isSupabaseConfigured && bookId) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id, rating, content, emoji_rating, has_spoilers, visibility,
            helpful_count, created_at,
            profiles!reviews_user_id_fkey ( display_name, avatar_url )
          `)
          .eq('book_id', bookId)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setReviews(
          (data || []).map((r) => ({
            ...r,
            reviewer_name: r.profiles?.display_name || 'Anonymous',
            reviewer_avatar: r.profiles?.avatar_url || '🧑‍🎓',
          }))
        )
      } catch (err) {
        console.error('Error loading reviews:', err)
        setReviews(DEMO_REVIEWS)
      }
    } else {
      // Demo fallback
      await new Promise((r) => setTimeout(r, 400))
      setReviews(DEMO_REVIEWS)
    }
    setLoading(false)
  }

  async function handleHelpful(reviewId) {
    if (helpedIds.has(reviewId)) return
    setHelpedIds(new Set([...helpedIds, reviewId]))

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r
      )
    )

    if (isSupabaseConfigured) {
      try {
        await supabase.rpc('increment_helpful', { review_id: reviewId })
      } catch (err) {
        console.error('Error voting helpful:', err)
      }
    }
  }

  function toggleSpoiler(reviewId) {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev)
      next.has(reviewId) ? next.delete(reviewId) : next.add(reviewId)
      return next
    })
  }

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return (b.helpful_count || 0) - (a.helpful_count || 0)
    return new Date(b.created_at) - new Date(a.created_at)
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-purple-50 p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-8 text-center">
        <span className="text-4xl block mb-2">📝</span>
        <h3 className="font-display font-semibold text-lg">No Reviews Yet</h3>
        <p className="text-sm text-rq-muted mt-1">Be the first to share what you think about this book!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">
          📖 Reviews ({reviews.length})
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              sortBy === 'newest'
                ? 'bg-rq-purple text-white'
                : 'bg-gray-100 text-rq-muted hover:bg-gray-200'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy('helpful')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              sortBy === 'helpful'
                ? 'bg-rq-purple text-white'
                : 'bg-gray-100 text-rq-muted hover:bg-gray-200'
            }`}
          >
            Most Helpful
          </button>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {sorted.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isHelpedByMe={helpedIds.has(review.id)}
            isSpoilerRevealed={revealedSpoilers.has(review.id)}
            onHelpful={() => handleHelpful(review.id)}
            onRevealSpoiler={() => toggleSpoiler(review.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ review, isHelpedByMe, isSpoilerRevealed, onHelpful, onRevealSpoiler }) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const showSpoilerBlur = review.has_spoilers && !isSpoilerRevealed

  return (
    <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-teal-100 rounded-full flex items-center justify-center text-lg">
          {review.reviewer_avatar || '🧑‍🎓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{review.reviewer_name || 'Anonymous'}</div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm tracking-wide">{stars}</span>
            <span className="text-xs text-rq-muted">{date}</span>
          </div>
        </div>
        {review.emoji_rating && (
          <span className="text-2xl" title="Emoji rating">{review.emoji_rating}</span>
        )}
      </div>

      {/* Spoiler warning */}
      {review.has_spoilers && !isSpoilerRevealed && (
        <button
          onClick={onRevealSpoiler}
          className="w-full mb-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-center cursor-pointer hover:bg-orange-100 transition-colors"
        >
          <span className="text-sm font-semibold text-orange-600">
            🤫 This review contains spoilers — tap to reveal
          </span>
        </button>
      )}

      {/* Review text */}
      {review.content && (
        <div
          className={`text-sm text-rq-text leading-relaxed mb-3 transition-all duration-300 ${
            showSpoilerBlur ? 'blur-sm select-none pointer-events-none' : ''
          }`}
        >
          "{review.content}"
        </div>
      )}

      {/* Emoji-only review (no text) */}
      {!review.content && review.emoji_rating && (
        <div className="text-sm text-rq-muted mb-3 italic">Emoji review only</div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4">
        <button
          onClick={onHelpful}
          disabled={isHelpedByMe}
          className={`flex items-center gap-1 text-xs font-semibold transition-all ${
            isHelpedByMe
              ? 'text-rq-purple'
              : 'text-rq-muted hover:text-rq-purple'
          }`}
        >
          <span>{isHelpedByMe ? '👍' : '👍'}</span>
          Helpful ({review.helpful_count || 0})
        </button>
        {review.visibility && (
          <span className="text-[10px] text-rq-muted bg-gray-100 px-2 py-0.5 rounded-full capitalize">
            {review.visibility === 'class' ? '🏫 Class' : review.visibility === 'school' ? '🏛️ School' : '🌍 Public'}
          </span>
        )}
      </div>
    </div>
  )
}
