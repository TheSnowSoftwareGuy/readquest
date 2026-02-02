import { useState } from 'react'
import { Link } from 'react-router-dom'
import { showPartners, sponsoredBooks } from '../data/placementData'
import { sampleBooks } from '../data/mockData'

const showBooks = {
  'ada-twist': {
    show: 'Ada Twist, Scientist',
    platform: 'Netflix',
    logo: '🔬',
    books: [
      { ...sampleBooks[4], badge: '📺 Featured in Season 3' },
      { ...sampleBooks[8], badge: '📚 Ada\'s Bookshelf' },
      { ...sampleBooks[0], badge: '📚 Ada\'s Bookshelf' },
    ],
  },
  'ghostwriter': {
    show: 'Ghostwriter',
    platform: 'Apple TV+',
    logo: '👻',
    books: [
      { ...sampleBooks[0], badge: '⭐ Episode Feature' },
      { ...sampleBooks[2], badge: '📚 On the Shelf' },
      { ...sampleBooks[11], badge: '📚 On the Shelf' },
    ],
  },
  'ms-rachel': {
    show: 'Ms. Rachel',
    platform: 'YouTube',
    logo: '👩‍🏫',
    books: [
      { ...sampleBooks[5], badge: '📺 Reading Segment' },
      { ...sampleBooks[7], badge: '📺 Story Time' },
      { ...sampleBooks[6], badge: '❤️ Ms. Rachel\'s Pick' },
    ],
  },
  'blippi': {
    show: 'Blippi',
    platform: 'YouTube',
    logo: '🧢',
    books: [
      { ...sampleBooks[6], badge: '📺 Library Visit Episode' },
      { ...sampleBooks[1], badge: '🧢 Blippi\'s Favorite' },
      { ...sampleBooks[9], badge: '📚 Featured Read' },
    ],
  },
  'wild-kratts': {
    show: 'Wild Kratts',
    platform: 'PBS Kids',
    logo: '🦎',
    books: [
      { ...sampleBooks[8], badge: '🦎 Creature Feature Pick' },
      { ...sampleBooks[4], badge: '📺 Episode Tie-In' },
    ],
  },
  'bluey': {
    show: 'Bluey',
    platform: 'Disney+',
    logo: '🐕',
    books: [
      { ...sampleBooks[3], badge: '📚 Bedroom Shelf' },
      { ...sampleBooks[7], badge: '📚 Bedroom Shelf' },
    ],
  },
}

export default function DiscoverByShow() {
  const [selectedShow, setSelectedShow] = useState('ada-twist')
  const currentShow = showBooks[selectedShow]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">📺 Discover by Show</h1>
        <p className="text-rq-muted">Find books from your favorite TV shows and YouTube channels!</p>
      </div>

      {/* Show Selector */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 -mx-4 px-4">
        {Object.entries(showBooks).map(([id, show]) => (
          <button
            key={id}
            onClick={() => setSelectedShow(id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
              selectedShow === id
                ? 'bg-gradient-to-r from-rq-purple to-rq-teal text-white shadow-md'
                : 'bg-white text-rq-muted border border-purple-100 hover:border-rq-purple/30'
            }`}
          >
            <span className="text-lg">{show.logo}</span>
            <span>{show.show}</span>
          </button>
        ))}
      </div>

      {/* Selected Show */}
      {currentShow && (
        <div className="animate-slide-up">
          <div className="bg-gradient-to-r from-purple-100 to-teal-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{currentShow.logo}</span>
              <div>
                <h2 className="font-display text-2xl font-bold">{currentShow.show}</h2>
                <span className="text-sm text-rq-muted">{currentShow.platform}</span>
              </div>
            </div>
            <p className="text-sm text-rq-muted">
              Books featured in or inspired by <strong>{currentShow.show}</strong>. Add them to your bookshelf and earn bonus XP! 🎉
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentShow.books.map((book, i) => (
              <div key={i} className="bg-white rounded-xl border border-purple-50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer">
                <div className="relative aspect-[2/3] bg-gradient-to-br from-purple-100 to-teal-100 overflow-hidden">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>' }} />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm">
                    {book.badge}
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-sm truncate">{book.title}</div>
                  <div className="text-xs text-rq-muted truncate">{book.author}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-rq-muted">{book.rating}</span>
                  </div>
                  <button className="mt-2 w-full bg-gradient-to-r from-rq-purple to-rq-teal text-white text-xs font-bold py-1.5 rounded-full hover:shadow-md transition-all">
                    📚 Add to Shelf (+25 XP)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sponsored Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-xl">🔥 Trending Across Shows</h3>
          <span className="text-xs bg-orange-100 text-rq-orange px-3 py-1 rounded-full font-medium">Sponsored</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {sponsoredBooks.map((book, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all mb-2 bg-gradient-to-br from-purple-100 to-teal-100">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>' }} />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <div className="text-[10px] text-white font-bold">{book.sponsorLabel}</div>
                </div>
              </div>
              <div className="text-xs font-semibold truncate">{book.title}</div>
              <div className="text-[10px] text-rq-muted truncate">{book.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
