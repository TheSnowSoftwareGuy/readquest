import { useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Demo avatar item catalog ─────────────────────────────────────────────
// Each item: { id, name, emoji, unlocked, unlockText }
// unlocked = true means the user has it; false = locked with unlockText

const MOCK_LEVEL = 12
const MOCK_COINS = 125

const CATEGORIES = [
  { key: 'hair',        label: 'Hair',        icon: '💇' },
  { key: 'skinTone',    label: 'Skin Tone',   icon: '🎨' },
  { key: 'eyes',        label: 'Eyes',         icon: '👀' },
  { key: 'outfits',     label: 'Outfits',      icon: '👕' },
  { key: 'accessories', label: 'Accessories',  icon: '🎒' },
  { key: 'backgrounds', label: 'Backgrounds',  icon: '🖼️' },
  { key: 'pets',        label: 'Pets',         icon: '🐾' },
]

const ITEMS = {
  hair: [
    { id: 'h1',  name: 'Short & Spiky',   emoji: '🦔', unlocked: true },
    { id: 'h2',  name: 'Long & Flowing',   emoji: '💁', unlocked: true },
    { id: 'h3',  name: 'Curly',            emoji: '🌀', unlocked: true },
    { id: 'h4',  name: 'Braids',           emoji: '🪢', unlocked: true },
    { id: 'h5',  name: 'Ponytail',         emoji: '🎀', unlocked: true },
    { id: 'h6',  name: 'Mohawk',           emoji: '🦁', unlocked: false, unlockText: 'Level 15' },
    { id: 'h7',  name: 'Afro',             emoji: '⭕', unlocked: false, unlockText: '30 BookCoins' },
    { id: 'h8',  name: 'Pigtails',         emoji: '🎗️', unlocked: true },
    { id: 'h9',  name: 'Bun',              emoji: '🍡', unlocked: false, unlockText: 'Level 20' },
    { id: 'h10', name: 'Rainbow',          emoji: '🌈', unlocked: false, unlockText: '100 BookCoins' },
  ],
  skinTone: [
    { id: 'sk1',  name: 'Light',           emoji: '👋🏻', unlocked: true },
    { id: 'sk2',  name: 'Medium Light',    emoji: '👋🏼', unlocked: true },
    { id: 'sk3',  name: 'Medium',          emoji: '👋🏽', unlocked: true },
    { id: 'sk4',  name: 'Medium Dark',     emoji: '👋🏾', unlocked: true },
    { id: 'sk5',  name: 'Dark',            emoji: '👋🏿', unlocked: true },
    { id: 'sk6',  name: 'Rose',            emoji: '🌸', unlocked: true },
    { id: 'sk7',  name: 'Golden',          emoji: '✨', unlocked: true },
    { id: 'sk8',  name: 'Alien Green',     emoji: '👽', unlocked: false, unlockText: 'Level 25' },
  ],
  eyes: [
    { id: 'e1',  name: 'Happy',            emoji: '😊', unlocked: true },
    { id: 'e2',  name: 'Cool',             emoji: '😎', unlocked: true },
    { id: 'e3',  name: 'Wink',             emoji: '😉', unlocked: true },
    { id: 'e4',  name: 'Starry',           emoji: '🤩', unlocked: true },
    { id: 'e5',  name: 'Sleepy',           emoji: '😴', unlocked: false, unlockText: '20 BookCoins' },
    { id: 'e6',  name: 'Heart Eyes',       emoji: '😍', unlocked: false, unlockText: 'Level 18' },
    { id: 'e7',  name: 'Glasses',          emoji: '🤓', unlocked: true },
    { id: 'e8',  name: 'Monocle',          emoji: '🧐', unlocked: false, unlockText: '50 BookCoins' },
    { id: 'e9',  name: 'Determined',       emoji: '😤', unlocked: true },
    { id: 'e10', name: 'Sparkle',          emoji: '✨', unlocked: false, unlockText: 'Level 30' },
  ],
  outfits: [
    { id: 'o1',  name: 'T-Shirt',          emoji: '👕', unlocked: true },
    { id: 'o2',  name: 'Hoodie',           emoji: '🧥', unlocked: true },
    { id: 'o3',  name: 'Dress',            emoji: '👗', unlocked: true },
    { id: 'o4',  name: 'Superhero Cape',   emoji: '🦸', unlocked: false, unlockText: '40 BookCoins' },
    { id: 'o5',  name: 'Wizard Robe',      emoji: '🧙', unlocked: false, unlockText: 'Level 15' },
    { id: 'o6',  name: 'Space Suit',       emoji: '🧑‍🚀', unlocked: false, unlockText: 'Level 20' },
    { id: 'o7',  name: 'Pirate',           emoji: '🏴‍☠️', unlocked: false, unlockText: '60 BookCoins' },
    { id: 'o8',  name: 'School Uniform',   emoji: '🎓', unlocked: true },
    { id: 'o9',  name: 'Sports Jersey',    emoji: '🏅', unlocked: true },
    { id: 'o10', name: 'Royal Armor',      emoji: '🛡️', unlocked: false, unlockText: 'Level 30' },
    { id: 'o11', name: 'Detective',        emoji: '🕵️', unlocked: false, unlockText: '80 BookCoins' },
    { id: 'o12', name: 'Overalls',         emoji: '👖', unlocked: true },
  ],
  accessories: [
    { id: 'a1',  name: 'Backpack',         emoji: '🎒', unlocked: true },
    { id: 'a2',  name: 'Crown',            emoji: '👑', unlocked: false, unlockText: 'Level 25' },
    { id: 'a3',  name: 'Headband',         emoji: '🪖', unlocked: true },
    { id: 'a4',  name: 'Scarf',            emoji: '🧣', unlocked: true },
    { id: 'a5',  name: 'Magic Wand',       emoji: '🪄', unlocked: false, unlockText: '50 BookCoins' },
    { id: 'a6',  name: 'Book',             emoji: '📕', unlocked: true },
    { id: 'a7',  name: 'Telescope',        emoji: '🔭', unlocked: false, unlockText: 'Level 18' },
    { id: 'a8',  name: 'Magnifying Glass', emoji: '🔍', unlocked: true },
    { id: 'a9',  name: 'Paintbrush',       emoji: '🖌️', unlocked: false, unlockText: '35 BookCoins' },
    { id: 'a10', name: 'Trophy',           emoji: '🏆', unlocked: false, unlockText: 'Level 30' },
  ],
  backgrounds: [
    { id: 'b1',  name: 'Library',          emoji: '📚', unlocked: true },
    { id: 'b2',  name: 'Forest',           emoji: '🌲', unlocked: true },
    { id: 'b3',  name: 'Beach',            emoji: '🏖️', unlocked: true },
    { id: 'b4',  name: 'Castle',           emoji: '🏰', unlocked: false, unlockText: '40 BookCoins' },
    { id: 'b5',  name: 'Outer Space',      emoji: '🌌', unlocked: false, unlockText: 'Level 20' },
    { id: 'b6',  name: 'Under the Sea',    emoji: '🐠', unlocked: false, unlockText: '60 BookCoins' },
    { id: 'b7',  name: 'Mountain',         emoji: '🏔️', unlocked: true },
    { id: 'b8',  name: 'Treehouse',        emoji: '🌳', unlocked: false, unlockText: 'Level 15' },
    { id: 'b9',  name: 'Rainbow Sky',      emoji: '🌈', unlocked: false, unlockText: '75 BookCoins' },
    { id: 'b10', name: 'Dragon\'s Lair',   emoji: '🐉', unlocked: false, unlockText: 'Level 30' },
  ],
  pets: [
    { id: 'p1',  name: 'Cat',              emoji: '🐱', unlocked: true },
    { id: 'p2',  name: 'Dog',              emoji: '🐶', unlocked: true },
    { id: 'p3',  name: 'Owl',              emoji: '🦉', unlocked: true },
    { id: 'p4',  name: 'Dragon',           emoji: '🐲', unlocked: false, unlockText: 'Level 20' },
    { id: 'p5',  name: 'Unicorn',          emoji: '🦄', unlocked: false, unlockText: '80 BookCoins' },
    { id: 'p6',  name: 'Bunny',            emoji: '🐰', unlocked: true },
    { id: 'p7',  name: 'Phoenix',          emoji: '🔥', unlocked: false, unlockText: 'Level 25' },
    { id: 'p8',  name: 'Turtle',           emoji: '🐢', unlocked: false, unlockText: '30 BookCoins' },
    { id: 'p9',  name: 'Penguin',          emoji: '🐧', unlocked: true },
    { id: 'p10', name: 'Hamster',          emoji: '🐹', unlocked: false, unlockText: '45 BookCoins' },
    { id: 'p11', name: 'Fox',              emoji: '🦊', unlocked: false, unlockText: 'Level 18' },
    { id: 'p12', name: 'Parrot',           emoji: '🦜', unlocked: true },
  ],
}

// Default equipped items per category
const DEFAULT_EQUIPPED = {
  hair: 'h1',
  skinTone: 'sk3',
  eyes: 'e1',
  outfits: 'o1',
  accessories: 'a6',
  backgrounds: 'b1',
  pets: 'p3',
}

export default function AvatarCustomizer() {
  const [activeCategory, setActiveCategory] = useState('hair')
  const [equipped, setEquipped] = useState(DEFAULT_EQUIPPED)
  const [bookCoins] = useState(MOCK_COINS)
  const [level] = useState(MOCK_LEVEL)

  const currentItems = ITEMS[activeCategory] || []

  const handleEquip = (item) => {
    if (!item.unlocked) return
    setEquipped(prev => ({ ...prev, [activeCategory]: item.id }))
  }

  // Build the avatar preview from currently equipped items
  const getEquippedItem = (cat) => {
    const id = equipped[cat]
    return ITEMS[cat]?.find(i => i.id === id)
  }

  const unlockedCount = Object.values(ITEMS).flat().filter(i => i.unlocked).length
  const totalCount = Object.values(ITEMS).flat().length

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Avatar Customizer 🎨</h1>
          <p className="text-rq-muted">Personalize your reading character!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-4 py-2 border border-yellow-200">
            <span className="text-sm font-bold">🪙 {bookCoins} BookCoins</span>
          </div>
          <Link
            to="/achievements"
            className="text-xs font-semibold text-rq-purple bg-purple-50 px-3 py-2 rounded-full border border-purple-100 hover:shadow-sm transition-all"
          >
            💰 Earn More
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Avatar Preview — left/center column */}
        <div className="md:col-span-4">
          <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl border-2 border-purple-200 p-6 text-center sticky top-24">
            {/* Background preview */}
            <div className="relative bg-white rounded-2xl p-6 mb-4 shadow-inner border border-purple-100 min-h-[240px] flex flex-col items-center justify-center">
              {/* Background emoji */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 text-7xl">
                {getEquippedItem('backgrounds')?.emoji || '📚'}
              </div>

              {/* Character preview */}
              <div className="relative z-10">
                {/* Skin tone / base */}
                <div className="text-7xl mb-1">
                  {getEquippedItem('skinTone')?.emoji || '👋🏽'}
                </div>
                {/* Hair */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-3xl">
                  {getEquippedItem('hair')?.emoji || '🦔'}
                </div>
                {/* Eyes */}
                <div className="text-4xl mt-1">
                  {getEquippedItem('eyes')?.emoji || '😊'}
                </div>
                {/* Outfit */}
                <div className="text-3xl mt-1">
                  {getEquippedItem('outfits')?.emoji || '👕'}
                </div>
              </div>

              {/* Accessory */}
              <div className="absolute top-3 right-3 text-2xl">
                {getEquippedItem('accessories')?.emoji || '📕'}
              </div>

              {/* Pet */}
              <div className="absolute bottom-3 right-3 text-3xl">
                {getEquippedItem('pets')?.emoji || '🦉'}
              </div>
            </div>

            {/* Character name */}
            <div className="font-display font-bold text-lg text-rq-purple">Jayden M.</div>
            <div className="text-xs text-rq-muted">Level {level} • Bookworm 🐛</div>

            {/* Items unlocked progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-rq-muted mb-1">
                <span>Items Unlocked</span>
                <span className="font-bold">{unlockedCount}/{totalCount}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rq-purple to-rq-teal h-full rounded-full transition-all duration-500"
                  style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Customization panel — right column */}
        <div className="md:col-span-8">
          {/* Category tabs */}
          <div className="flex gap-1 mb-5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md'
                    : 'bg-white text-rq-muted border border-purple-100 hover:border-rq-purple/30'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Category header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-bold">
              {CATEGORIES.find(c => c.key === activeCategory)?.icon}{' '}
              {CATEGORIES.find(c => c.key === activeCategory)?.label}
            </h2>
            <span className="text-xs text-rq-muted">
              {currentItems.filter(i => i.unlocked).length}/{currentItems.length} unlocked
            </span>
          </div>

          {/* Item grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {currentItems.map(item => {
              const isEquipped = equipped[activeCategory] === item.id
              const isLocked = !item.unlocked

              return (
                <button
                  key={item.id}
                  onClick={() => handleEquip(item)}
                  disabled={isLocked}
                  className={`relative rounded-2xl p-4 text-center transition-all border-2 ${
                    isEquipped
                      ? 'bg-gradient-to-br from-purple-100 to-teal-100 border-rq-purple shadow-md ring-2 ring-rq-purple/30'
                      : isLocked
                        ? 'bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed'
                        : 'bg-white border-purple-50 hover:border-rq-purple/30 hover:shadow-sm cursor-pointer'
                  }`}
                >
                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl z-10">
                      <div className="text-center">
                        <span className="text-2xl">🔒</span>
                        <div className="text-[10px] font-bold text-rq-muted mt-0.5">{item.unlockText}</div>
                      </div>
                    </div>
                  )}

                  {/* Equipped badge */}
                  {isEquipped && (
                    <div className="absolute -top-1 -right-1 bg-rq-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20">
                      ✓ Equipped
                    </div>
                  )}

                  {/* Item emoji */}
                  <div className={`text-4xl mb-2 ${isLocked ? 'grayscale' : ''}`}>
                    {item.emoji}
                  </div>

                  {/* Item name */}
                  <div className={`text-xs font-semibold ${
                    isEquipped ? 'text-rq-purple' : isLocked ? 'text-gray-400' : 'text-rq-text'
                  }`}>
                    {item.name}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Locked items info */}
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-display font-semibold text-sm mb-1">How to Unlock Items</h4>
                <p className="text-xs text-rq-muted leading-relaxed">
                  Earn <strong>BookCoins</strong> by completing daily quests, finishing books, and earning badges. 
                  Some special items unlock at certain <strong>levels</strong> — keep reading to level up! 
                  You currently have <strong>🪙 {bookCoins} BookCoins</strong> and are <strong>Level {level}</strong>.
                </p>
                <div className="flex gap-2 mt-2">
                  <Link to="/achievements" className="text-xs font-semibold text-rq-purple bg-white px-3 py-1.5 rounded-full border border-purple-100 hover:shadow-sm transition-all">
                    ⭐ Daily Quests
                  </Link>
                  <Link to="/reading-log" className="text-xs font-semibold text-rq-purple bg-white px-3 py-1.5 rounded-full border border-purple-100 hover:shadow-sm transition-all">
                    📖 Log Reading
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
