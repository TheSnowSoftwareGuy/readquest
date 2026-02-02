import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'
import FeedItem from '../components/FeedItem'
import FriendsList from '../components/FriendsList'
import { sampleBooks } from '../data/mockData'

// ─── Demo feed data ───────────────────────────────────────────────────────────
const now = Date.now()
const hr = 3600000
const day = 86400000

const DEMO_FEED = [
  {
    id: 1, type: 'book_complete', userName: 'Maya L.', avatar: '👧',
    bookTitle: 'Charlotte\'s Web', bookAuthor: 'E.B. White',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0064400557-L.jpg',
    rating: 5,
    created_at: new Date(now - 1.5 * hr).toISOString(),
    reactionCounts: { '📚': 3, '⭐': 5, '🎉': 2 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 2, type: 'badge_earned', userName: 'Ethan K.', avatar: '👦',
    badgeName: 'Week Warrior', badgeIcon: '⚔️',
    badgeDescription: 'Maintained a 7-day reading streak',
    created_at: new Date(now - 2.5 * hr).toISOString(),
    reactionCounts: { '🔥': 4, '👏': 6 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 3, type: 'review', userName: 'Sophia R.', avatar: '👩',
    bookTitle: 'The Wild Robot', bookAuthor: 'Peter Brown',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0316381993-L.jpg',
    rating: 5, reviewText: 'This book made me cry! Roz is the best robot ever. I wish she was real. The way she learns to survive in nature is so inspiring. Everyone should read this! ❤️',
    created_at: new Date(now - 4 * hr).toISOString(),
    reactionCounts: { '📚': 2, '⭐': 7, '👏': 3 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 4, type: 'level_up', userName: 'Noah W.', avatar: '👦',
    newLevel: 28, levelTitle: 'Story Explorer', levelEmoji: '🗺️', totalXP: 8400,
    created_at: new Date(now - 5 * hr).toISOString(),
    reactionCounts: { '🎉': 8, '🔥': 3 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 5, type: 'challenge_complete', userName: 'Ava C.', avatar: '👧',
    challengeName: 'Genre Explorer — January', challengeDescription: 'Read books from 5 different genres',
    xpEarned: 150,
    created_at: new Date(now - 7 * hr).toISOString(),
    reactionCounts: { '🏆': 2, '🎉': 5, '👏': 4 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 6, type: 'started_reading', userName: 'Liam D.', avatar: '🧑',
    bookTitle: 'Percy Jackson & The Lightning Thief', bookAuthor: 'Rick Riordan',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0786838655-L.jpg',
    created_at: new Date(now - 8 * hr).toISOString(),
    reactionCounts: { '📚': 1, '🔥': 2 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 7, type: 'book_complete', userName: 'Emma T.', avatar: '👧',
    bookTitle: 'Wonder', bookAuthor: 'R.J. Palacio',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0375869026-L.jpg',
    rating: 4,
    created_at: new Date(now - 10 * hr).toISOString(),
    reactionCounts: { '⭐': 3, '👏': 2 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 8, type: 'badge_earned', userName: 'Sophia R.', avatar: '👩',
    badgeName: 'Dedicated Reader', badgeIcon: '🔥',
    badgeDescription: 'Maintained a 30-day reading streak',
    created_at: new Date(now - 14 * hr).toISOString(),
    reactionCounts: { '🔥': 12, '👏': 8, '🎉': 5 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 9, type: 'review', userName: 'James H.', avatar: '👦',
    bookTitle: 'Holes', bookAuthor: 'Louis Sachar',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0440414806-L.jpg',
    rating: 4, reviewText: 'Stanley is so funny! The camp is crazy but the story about the family curse was cool. I couldn\'t put it down for the last 50 pages.',
    created_at: new Date(now - 18 * hr).toISOString(),
    reactionCounts: { '📚': 4, '⭐': 2 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 10, type: 'level_up', userName: 'Maya L.', avatar: '👧',
    newLevel: 15, levelTitle: 'Bookworm', levelEmoji: '🐛', totalXP: 3200,
    created_at: new Date(now - 1 * day).toISOString(),
    reactionCounts: { '🎉': 6, '👏': 3 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 11, type: 'book_complete', userName: 'Isabella M.', avatar: '👧',
    bookTitle: 'Wings of Fire: The Dragonet Prophecy', bookAuthor: 'Tui T. Sutherland',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0545349184-L.jpg',
    rating: 5,
    created_at: new Date(now - 1.2 * day).toISOString(),
    reactionCounts: { '📚': 5, '⭐': 4, '🔥': 3 }, myReactions: [],
    isFriend: true,
  },
  {
    id: 12, type: 'challenge_complete', userName: 'Lucas G.', avatar: '👦',
    challengeName: 'February Book Bingo', challengeDescription: 'Completed a full row on the reading bingo card!',
    xpEarned: 200,
    created_at: new Date(now - 1.5 * day).toISOString(),
    reactionCounts: { '🏆': 3, '🎉': 7 }, myReactions: [],
    isFriend: true,
  },
  {
    id: 13, type: 'started_reading', userName: 'Ava C.', avatar: '👧',
    bookTitle: 'The Hunger Games', bookAuthor: 'Suzanne Collins',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0439023483-L.jpg',
    created_at: new Date(now - 1.8 * day).toISOString(),
    reactionCounts: { '📚': 2, '🔥': 1 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 14, type: 'badge_earned', userName: 'Emma T.', avatar: '👧',
    badgeName: 'Fantasy Fan', badgeIcon: '🧙',
    badgeDescription: 'Finished 5 fantasy books',
    created_at: new Date(now - 2 * day).toISOString(),
    reactionCounts: { '🎉': 4, '👏': 2 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 15, type: 'review', userName: 'Noah W.', avatar: '👦',
    bookTitle: 'Hatchet', bookAuthor: 'Gary Paulsen',
    bookCover: 'https://covers.openlibrary.org/b/isbn/1416936475-L.jpg',
    rating: 5, reviewText: 'Best survival book ever! Brian is so brave. When he found the tornado part I was on the edge of my seat. Made me want to go camping.',
    created_at: new Date(now - 2.3 * day).toISOString(),
    reactionCounts: { '📚': 3, '⭐': 6, '🔥': 2 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 16, type: 'book_complete', userName: 'Ethan K.', avatar: '👦',
    bookTitle: 'Dog Man', bookAuthor: 'Dav Pilkey',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0545581605-L.jpg',
    rating: 4,
    created_at: new Date(now - 2.5 * day).toISOString(),
    reactionCounts: { '📚': 2, '🎉': 1 }, myReactions: [],
    isFriend: true,
  },
  {
    id: 17, type: 'level_up', userName: 'Liam D.', avatar: '🧑',
    newLevel: 5, levelTitle: 'Page Turner', levelEmoji: '📖', totalXP: 900,
    created_at: new Date(now - 3 * day).toISOString(),
    reactionCounts: { '🎉': 3, '👏': 5 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 18, type: 'badge_earned', userName: 'Isabella M.', avatar: '👧',
    badgeName: 'Book Dragon', badgeIcon: '🐉',
    badgeDescription: 'Finished 5 books',
    created_at: new Date(now - 3.5 * day).toISOString(),
    reactionCounts: { '🔥': 5, '🎉': 3 }, myReactions: [],
    isFriend: true,
  },
  {
    id: 19, type: 'review', userName: 'Ava C.', avatar: '👧',
    bookTitle: 'The One and Only Ivan', bookAuthor: 'Katherine Applegate',
    bookCover: 'https://covers.openlibrary.org/b/isbn/0061992259-L.jpg',
    rating: 5, reviewText: 'Ivan is the sweetest gorilla! I loved how he painted pictures for Ruby. This book teaches you about kindness and hope. 🐘🦍',
    created_at: new Date(now - 4 * day).toISOString(),
    reactionCounts: { '📚': 4, '⭐': 8, '👏': 5, '🔥': 2 }, myReactions: [],
    class_id: 'class-1',
  },
  {
    id: 20, type: 'challenge_complete', userName: 'Sophia R.', avatar: '👩',
    challengeName: 'Read Around the World', challengeDescription: 'Read books set on 7 different continents',
    xpEarned: 150,
    created_at: new Date(now - 4.5 * day).toISOString(),
    reactionCounts: { '🏆': 6, '🎉': 4, '🔥': 3 }, myReactions: [],
    class_id: 'class-1',
  },
]

const PAGE_SIZE = 8

export default function SocialFeed() {
  const [feed, setFeed] = useState([])
  const [filter, setFilter] = useState('all') // all | class | friends
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadFeed(1, filter)
  }, [filter])

  async function loadFeed(pageNum = 1, activeFilter = filter) {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    let items = []

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          let query = supabase
            .from('feed_items')
            .select('*, profiles:user_id(display_name, avatar_url)')
            .order('created_at', { ascending: false })
            .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1)

          if (activeFilter === 'class') {
            // Get user's class IDs first
            const { data: memberships } = await supabase
              .from('class_memberships')
              .select('class_id')
              .eq('user_id', user.id)
            const classIds = memberships?.map((m) => m.class_id) || []
            if (classIds.length) {
              query = query.in('class_id', classIds)
            }
          }

          const { data, error } = await query
          if (data?.length) {
            items = data.map((item) => ({
              ...item,
              userName: item.profiles?.display_name || 'Reader',
              avatar: item.profiles?.avatar_url || '🧑',
              reactionCounts: item.reaction_counts || {},
              myReactions: [],
            }))
          }
          if (!data || data.length < PAGE_SIZE) setHasMore(false)
        }
      } catch (err) {
        console.error('Error loading feed:', err)
      }
    }

    // Use demo data if no Supabase results
    if (items.length === 0) {
      let filtered = [...DEMO_FEED]
      if (activeFilter === 'class') {
        filtered = filtered.filter((item) => item.class_id === 'class-1')
      } else if (activeFilter === 'friends') {
        filtered = filtered.filter((item) => item.isFriend || item.class_id === 'class-1')
      }

      const start = (pageNum - 1) * PAGE_SIZE
      const end = start + PAGE_SIZE
      items = filtered.slice(start, end)
      if (end >= filtered.length) setHasMore(false)
      else setHasMore(true)
    }

    if (pageNum === 1) {
      setFeed(items)
    } else {
      setFeed((prev) => [...prev, ...items])
    }

    setPage(pageNum)
    setLoading(false)
    setLoadingMore(false)
  }

  function handleLoadMore() {
    loadFeed(page + 1)
  }

  async function handleReact(itemId, emoji, added) {
    if (!isSupabaseConfigured) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (added) {
        await supabase.from('reactions').insert({
          feed_item_id: itemId,
          user_id: user.id,
          emoji,
        })
      } else {
        await supabase.from('reactions').delete()
          .eq('feed_item_id', itemId)
          .eq('user_id', user.id)
          .eq('emoji', emoji)
      }
    } catch (err) {
      console.error('Error toggling reaction:', err)
    }
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter)
    setPage(1)
    setHasMore(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Activity Feed 📣</h1>
        <p className="text-rq-muted">See what your friends and classmates are reading</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-5">
            {[
              { key: 'all', label: '🌍 All Activity' },
              { key: 'class', label: '🏫 My Class' },
              { key: 'friends', label: '👥 Friends' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                  ${filter === f.key
                    ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md'
                    : 'bg-white text-rq-muted border border-purple-100 hover:border-rq-purple/30 hover:bg-purple-50'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Feed items */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-purple-50 p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-20" />
                    </div>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-3">📭</span>
              <p className="text-lg font-semibold text-rq-text">No activity yet</p>
              <p className="text-sm text-rq-muted mt-1">
                {filter === 'friends' ? 'Add some friends to see their activity!' : 'Start reading to fill up your feed!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feed.map((item) => (
                <FeedItem key={item.id} item={item} onReact={handleReact} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && !loading && feed.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-white border border-purple-200 text-rq-purple px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-purple-50 hover:border-rq-purple/40 transition-all disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-rq-purple border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}

          {!hasMore && feed.length > 0 && (
            <div className="mt-6 text-center text-sm text-rq-muted">
              ✨ You're all caught up!
            </div>
          )}
        </div>

        {/* Friends sidebar */}
        <div className="lg:w-72 shrink-0 space-y-4">
          <FriendsList />

          {/* Quick stats card */}
          <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl border border-purple-100 p-4">
            <h3 className="font-display font-semibold text-sm mb-3">📊 Class This Week</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-xl p-2.5 text-center">
                <div className="font-display text-xl font-bold text-rq-purple">47</div>
                <div className="text-[10px] text-rq-muted">Books Finished</div>
              </div>
              <div className="bg-white/70 rounded-xl p-2.5 text-center">
                <div className="font-display text-xl font-bold text-rq-teal">3,842</div>
                <div className="text-[10px] text-rq-muted">Minutes Read</div>
              </div>
              <div className="bg-white/70 rounded-xl p-2.5 text-center">
                <div className="font-display text-xl font-bold text-rq-orange">🔥 12</div>
                <div className="text-[10px] text-rq-muted">Avg Streak</div>
              </div>
              <div className="bg-white/70 rounded-xl p-2.5 text-center">
                <div className="font-display text-xl font-bold text-rq-green">28</div>
                <div className="text-[10px] text-rq-muted">Reviews</div>
              </div>
            </div>
          </div>

          {/* Trending books */}
          <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-4">
            <h3 className="font-display font-semibold text-sm mb-3">🔥 Trending in Your Class</h3>
            <div className="space-y-2.5">
              {sampleBooks.slice(0, 4).map((book, i) => (
                <div key={book.id} className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-rq-muted w-4">{i + 1}</span>
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-8 h-11 object-cover rounded shadow-sm"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{book.title}</p>
                    <p className="text-[10px] text-rq-muted">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
