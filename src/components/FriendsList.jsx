import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'

// ─── Demo friends data ────────────────────────────────────────────────────────
const DEMO_FRIENDS = [
  { id: 'f1', display_name: 'Maya L.', avatar: '👧', level: 15, streak: 12, online: true, currentBook: 'The Wild Robot' },
  { id: 'f2', display_name: 'Sophia R.', avatar: '👩', level: 18, streak: 21, online: true, currentBook: 'Harry Potter' },
  { id: 'f3', display_name: 'Ethan K.', avatar: '👦', level: 9, streak: 7, online: false, currentBook: 'Dog Man' },
  { id: 'f4', display_name: 'Ava C.', avatar: '👧', level: 22, streak: 28, online: true, currentBook: 'The Hunger Games' },
  { id: 'f5', display_name: 'Noah W.', avatar: '👦', level: 16, streak: 16, online: false, currentBook: 'Hatchet' },
  { id: 'f6', display_name: 'Emma T.', avatar: '👧', level: 11, streak: 10, online: true, currentBook: 'Wonder' },
  { id: 'f7', display_name: 'Liam D.', avatar: '🧑', level: 5, streak: 3, online: false, currentBook: 'Percy Jackson' },
  { id: 'f8', display_name: 'James H.', avatar: '👦', level: 8, streak: 5, online: false, currentBook: 'Amulet' },
  { id: 'f9', display_name: 'Isabella M.', avatar: '👧', level: 14, streak: 9, online: true, currentBook: 'Wings of Fire' },
  { id: 'f10', display_name: 'Lucas G.', avatar: '👦', level: 7, streak: 4, online: false, currentBook: 'Diary of a Wimpy Kid' },
]

const DEMO_PENDING = [
  { id: 'p1', display_name: 'Charlotte B.', avatar: '👧', level: 13, school: 'Oakwood Elementary' },
  { id: 'p2', display_name: 'Mason R.', avatar: '👦', level: 6, school: 'Oakwood Elementary' },
]

export default function FriendsList({ compact = false }) {
  const [friends, setFriends] = useState(DEMO_FRIENDS)
  const [pending, setPending] = useState(DEMO_PENDING)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [tab, setTab] = useState('friends') // friends | pending | search

  useEffect(() => {
    loadFriends()
  }, [])

  async function loadFriends() {
    if (!isSupabaseConfigured) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch accepted friendships
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*, friend:profiles!friendships_friend_id_fkey(id, display_name, avatar_url, level, current_streak)')
        .eq('user_id', user.id)
        .eq('status', 'accepted')

      if (friendships?.length) {
        setFriends(friendships.map((f) => ({
          id: f.friend.id,
          display_name: f.friend.display_name,
          avatar: f.friend.avatar_url || '🧑',
          level: f.friend.level || 1,
          streak: f.friend.current_streak || 0,
          online: Math.random() > 0.5, // real-time presence not implemented yet
          currentBook: null,
        })))
      }

      // Fetch pending requests
      const { data: pendingData } = await supabase
        .from('friendships')
        .select('*, requester:profiles!friendships_user_id_fkey(id, display_name, avatar_url, level)')
        .eq('friend_id', user.id)
        .eq('status', 'pending')

      if (pendingData?.length) {
        setPending(pendingData.map((p) => ({
          id: p.requester.id,
          friendshipId: p.id,
          display_name: p.requester.display_name,
          avatar: p.requester.avatar_url || '🧑',
          level: p.requester.level || 1,
          school: 'Oakwood Elementary',
        })))
      }
    } catch (err) {
      console.error('Error loading friends:', err)
    }
  }

  async function handleSearch(query) {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url, level, school_id')
            .ilike('display_name', `%${query}%`)
            .neq('id', user.id)
            .limit(5)
          if (data) {
            setSearchResults(data.map((p) => ({
              id: p.id,
              display_name: p.display_name,
              avatar: p.avatar_url || '🧑',
              level: p.level || 1,
            })))
          }
        }
      } catch (err) {
        console.error('Search error:', err)
      }
    } else {
      // Demo search
      const allStudents = [...DEMO_FRIENDS, ...DEMO_PENDING]
      setSearchResults(
        allStudents
          .filter((s) => s.display_name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      )
    }
    setSearching(false)
  }

  async function acceptRequest(friendId) {
    setPending((prev) => prev.filter((p) => p.id !== friendId))
    const accepted = DEMO_PENDING.find((p) => p.id === friendId)
    if (accepted) {
      setFriends((prev) => [...prev, { ...accepted, online: false, streak: 0, currentBook: null }])
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('friendships')
          .update({ status: 'accepted' })
          .eq('friend_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('user_id', friendId)
      } catch (err) {
        console.error('Error accepting request:', err)
      }
    }
  }

  function declineRequest(friendId) {
    setPending((prev) => prev.filter((p) => p.id !== friendId))
  }

  const onlineFriends = friends.filter((f) => f.online)
  const offlineFriends = friends.filter((f) => !f.online)

  if (compact) {
    return (
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm">👥 Friends</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            {onlineFriends.length} online
          </span>
        </div>
        <div className="space-y-2">
          {onlineFriends.slice(0, 5).map((friend) => (
            <div key={friend.id} className="flex items-center gap-2">
              <div className="relative">
                <span className="text-lg">{friend.avatar}</span>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium truncate block">{friend.display_name}</span>
              </div>
              <span className="text-[10px] text-rq-muted">Lv {friend.level}</span>
            </div>
          ))}
        </div>
        {pending.length > 0 && (
          <div className="mt-3 pt-3 border-t border-purple-50">
            <span className="text-xs text-rq-orange font-semibold">{pending.length} pending request{pending.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-purple-50">
        {[
          { key: 'friends', label: 'Friends', count: friends.length },
          { key: 'pending', label: 'Requests', count: pending.length },
          { key: 'search', label: 'Add Friend', count: null },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-xs font-semibold transition-colors relative
              ${tab === t.key ? 'text-rq-purple' : 'text-rq-muted hover:text-rq-purple'}`}
          >
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${tab === t.key ? 'bg-rq-purple text-white' : 'bg-gray-100'}`}>
                {t.count}
              </span>
            )}
            {tab === t.key && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-rq-purple rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 max-h-[500px] overflow-y-auto">
        {/* Friends list */}
        {tab === 'friends' && (
          <div className="space-y-1">
            {onlineFriends.length > 0 && (
              <>
                <p className="text-[10px] text-rq-muted uppercase tracking-wider font-semibold mb-2">
                  Online — {onlineFriends.length}
                </p>
                {onlineFriends.map((friend) => (
                  <FriendRow key={friend.id} friend={friend} online />
                ))}
              </>
            )}
            {offlineFriends.length > 0 && (
              <>
                <p className="text-[10px] text-rq-muted uppercase tracking-wider font-semibold mt-4 mb-2">
                  Offline — {offlineFriends.length}
                </p>
                {offlineFriends.map((friend) => (
                  <FriendRow key={friend.id} friend={friend} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Pending requests */}
        {tab === 'pending' && (
          <div className="space-y-3">
            {pending.length === 0 ? (
              <div className="text-center py-6 text-rq-muted">
                <span className="text-3xl block mb-2">✨</span>
                <p className="text-sm">No pending requests</p>
              </div>
            ) : (
              pending.map((req) => (
                <div key={req.id} className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                  <span className="text-2xl">{req.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{req.display_name}</p>
                    <p className="text-xs text-rq-muted">Level {req.level} · {req.school || 'Oakwood Elementary'}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-semibold hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(req.id)}
                      className="text-xs bg-gray-200 text-rq-muted px-3 py-1.5 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Search / Add Friend */}
        {tab === 'search' && (
          <div>
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rq-purple focus:ring-2 focus:ring-purple-100"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rq-muted">🔍</span>
            </div>
            <p className="text-xs text-rq-muted mb-3">Search for classmates at your school to add as friends</p>
            {searching ? (
              <div className="text-center py-4 text-sm text-rq-muted animate-pulse">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <div key={result.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-purple-50 transition-colors">
                    <span className="text-2xl">{result.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{result.display_name}</p>
                      <p className="text-xs text-rq-muted">Level {result.level}</p>
                    </div>
                    <button className="text-xs bg-rq-purple text-white px-3 py-1.5 rounded-full font-semibold hover:bg-rq-purple-dark transition-colors">
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="text-center py-4 text-sm text-rq-muted">No results found</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

function FriendRow({ friend, online }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-purple-50/50 transition-colors cursor-pointer">
      <div className="relative shrink-0">
        <span className="text-xl">{friend.avatar}</span>
        {online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{friend.display_name}</p>
        <p className="text-[10px] text-rq-muted truncate">
          {friend.currentBook ? `📖 ${friend.currentBook}` : `Lv ${friend.level}`}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {friend.streak > 0 && (
          <span className="text-[10px] text-rq-orange font-bold">🔥{friend.streak}</span>
        )}
        <span className="text-[10px] bg-purple-100 text-rq-purple px-1.5 py-0.5 rounded-full font-semibold">
          Lv {friend.level}
        </span>
      </div>
    </div>
  )
}
