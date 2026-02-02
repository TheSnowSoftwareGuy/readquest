import { useState } from 'react'

const CHALLENGE_TYPES = [
  { key: 'books', label: 'Read X Books', icon: '📚', unit: 'books', defaultTarget: 5 },
  { key: 'minutes', label: 'Read X Minutes', icon: '⏱️', unit: 'minutes', defaultTarget: 500 },
  { key: 'streak', label: 'X Day Streak', icon: '🔥', unit: 'days', defaultTarget: 14 },
  { key: 'bingo', label: 'Genre Bingo', icon: '🎯', unit: 'genres', defaultTarget: 9 },
]

const BADGE_OPTIONS = [
  { id: 'challenge-star', name: 'Challenge Star', icon: '⭐' },
  { id: 'reading-hero', name: 'Reading Hero', icon: '🦸' },
  { id: 'champion', name: 'Champion', icon: '🏆' },
  { id: 'explorer', name: 'Explorer', icon: '🗺️' },
  { id: 'scholar', name: 'Scholar', icon: '🎓' },
  { id: 'dragon-tamer', name: 'Dragon Tamer', icon: '🐉' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CreateChallengeModal({ onClose, onSubmit, students = [] }) {
  const [step, setStep] = useState(1) // 1: form, 2: preview
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('books')
  const [target, setTarget] = useState(5)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  })
  const [assignTo, setAssignTo] = useState('class') // class | selected
  const [selectedStudents, setSelectedStudents] = useState([])
  const [badge, setBadge] = useState(BADGE_OPTIONS[0].id)
  const [xpReward, setXpReward] = useState(100)

  const typeConfig = CHALLENGE_TYPES.find((t) => t.key === type)
  const selectedBadge = BADGE_OPTIONS.find((b) => b.id === badge)

  function handleTypeChange(newType) {
    setType(newType)
    const config = CHALLENGE_TYPES.find((t) => t.key === newType)
    setTarget(config.defaultTarget)
  }

  function toggleStudent(studentId) {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }

  function handleSubmit() {
    const challenge = {
      title,
      description,
      type,
      target_value: target,
      start_date: startDate,
      end_date: endDate,
      assign_to: assignTo,
      selected_students: assignTo === 'selected' ? selectedStudents : [],
      badge_id: badge,
      xp_reward: xpReward,
    }
    onSubmit?.(challenge)
    onClose()
  }

  const isValid = title.trim().length >= 3 && target > 0 && startDate && endDate && endDate > startDate

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-purple-50 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-display text-xl font-bold">
              {step === 1 ? '🏆 Create Challenge' : '👀 Preview Challenge'}
            </h2>
            <p className="text-xs text-rq-muted">
              {step === 1 ? 'Set up a new reading challenge for your students' : 'Review before creating'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-rq-muted"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {step === 1 ? (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-rq-text block mb-1.5">Challenge Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., March Reading Marathon"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rq-purple focus:ring-2 focus:ring-purple-100"
                  maxLength={60}
                />
                <p className="text-[10px] text-rq-muted mt-1">{title.length}/60</p>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-rq-text block mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell students what this challenge is about..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rq-purple focus:ring-2 focus:ring-purple-100 resize-none"
                  maxLength={200}
                />
                <p className="text-[10px] text-rq-muted mt-1">{description.length}/200</p>
              </div>

              {/* Type selector */}
              <div>
                <label className="text-sm font-semibold text-rq-text block mb-2">Challenge Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CHALLENGE_TYPES.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => handleTypeChange(t.key)}
                      className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all border
                        ${type === t.key
                          ? 'bg-purple-50 border-rq-purple text-rq-purple shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-rq-muted hover:border-purple-200'
                        }`}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target */}
              <div>
                <label className="text-sm font-semibold text-rq-text block mb-1.5">
                  Target: {target} {typeConfig?.unit}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={type === 'minutes' ? 100 : 1}
                    max={type === 'minutes' ? 2000 : type === 'streak' ? 60 : type === 'bingo' ? 25 : 30}
                    step={type === 'minutes' ? 50 : 1}
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="flex-1 accent-rq-purple"
                  />
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-rq-purple"
                  />
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-rq-text block mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rq-purple"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-rq-text block mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rq-purple"
                  />
                </div>
              </div>

              {/* Assign to */}
              <div>
                <label className="text-sm font-semibold text-rq-text block mb-2">Assign To</label>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setAssignTo('class')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                      ${assignTo === 'class'
                        ? 'bg-purple-50 border-rq-purple text-rq-purple'
                        : 'bg-gray-50 border-gray-200 text-rq-muted hover:border-purple-200'
                      }`}
                  >
                    🏫 Whole Class
                  </button>
                  <button
                    onClick={() => setAssignTo('selected')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                      ${assignTo === 'selected'
                        ? 'bg-purple-50 border-rq-purple text-rq-purple'
                        : 'bg-gray-50 border-gray-200 text-rq-muted hover:border-purple-200'
                      }`}
                  >
                    👤 Selected Students
                  </button>
                </div>
                {assignTo === 'selected' && (
                  <div className="bg-gray-50 rounded-xl p-3 max-h-36 overflow-y-auto">
                    {students.length === 0 ? (
                      <p className="text-xs text-rq-muted text-center py-2">No students loaded</p>
                    ) : (
                      <div className="space-y-1">
                        {students.map((s) => (
                          <label
                            key={s.id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-purple-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(s.id)}
                              onChange={() => toggleStudent(s.id)}
                              className="rounded border-gray-300 text-rq-purple focus:ring-purple-200"
                            />
                            <span className="text-lg">{s.avatar}</span>
                            <span className="text-sm">{s.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Badge reward */}
              <div>
                <label className="text-sm font-semibold text-rq-text block mb-2">Badge Reward</label>
                <div className="grid grid-cols-3 gap-2">
                  {BADGE_OPTIONS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBadge(b.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all border
                        ${badge === b.id
                          ? 'bg-yellow-50 border-yellow-400 text-yellow-700 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-rq-muted hover:border-yellow-200'
                        }`}
                    >
                      <span className="text-lg">{b.icon}</span>
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* XP Reward */}
              <div>
                <label className="text-sm font-semibold text-rq-text block mb-1.5">XP Reward: ⚡ {xpReward}</label>
                <input
                  type="range"
                  min={25}
                  max={500}
                  step={25}
                  value={xpReward}
                  onChange={(e) => setXpReward(Number(e.target.value))}
                  className="w-full accent-rq-purple"
                />
                <div className="flex justify-between text-[10px] text-rq-muted">
                  <span>25 XP</span>
                  <span>500 XP</span>
                </div>
              </div>
            </div>
          ) : (
            /* ─── Preview ─────────────────────────────────────────────── */
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-5 border border-purple-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-lg">{title || 'Untitled Challenge'}</h3>
                    <p className="text-xs text-rq-muted mt-0.5">
                      {formatDate(startDate)} — {formatDate(endDate)}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    New
                  </span>
                </div>

                {description && <p className="text-sm text-rq-muted mb-4">{description}</p>}

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <span className="text-2xl">{typeConfig?.icon}</span>
                    <div className="font-display text-lg font-bold text-rq-purple mt-1">{target}</div>
                    <div className="text-[10px] text-rq-muted">{typeConfig?.unit}</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <span className="text-2xl">⚡</span>
                    <div className="font-display text-lg font-bold text-rq-orange mt-1">{xpReward}</div>
                    <div className="text-[10px] text-rq-muted">XP Reward</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <span className="text-2xl">{selectedBadge?.icon}</span>
                    <div className="font-display text-sm font-bold text-yellow-700 mt-1">{selectedBadge?.name}</div>
                    <div className="text-[10px] text-rq-muted">Badge</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-rq-muted">
                  <span>{assignTo === 'class' ? '🏫 Whole Class' : `👤 ${selectedStudents.length} students`}</span>
                  <span>·</span>
                  <span>{typeConfig?.label}</span>
                </div>

                {/* Progress preview bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-rq-muted">Progress</span>
                    <span className="font-bold text-rq-purple">0/{target}</span>
                  </div>
                  <div className="bg-white/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-rq-purple to-rq-teal h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-rq-muted text-center">
                This is how students will see the challenge. Click "Create" to publish it.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-purple-50 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          {step === 2 ? (
            <>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-rq-muted hover:text-rq-purple font-medium transition-colors"
              >
                ← Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
              >
                🏆 Create Challenge
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="text-sm text-rq-muted hover:text-rq-purple font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!isValid}
                className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Preview →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
