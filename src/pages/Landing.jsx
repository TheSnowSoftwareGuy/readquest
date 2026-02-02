import { Link } from 'react-router-dom'
import { features, stats, testimonials } from '../data/mockData'

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-teal-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 text-6xl opacity-10 animate-float">📚</div>
          <div className="absolute top-1/4 right-1/3 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>⭐</div>
          <div className="absolute bottom-1/4 right-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🏆</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-purple-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="text-sm">🚀</span>
              <span className="text-sm font-medium text-rq-purple">The future of kids reading is here</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-rq-text">Your Reading</span>
              <br />
              <span className="bg-gradient-to-r from-rq-purple via-rq-teal to-rq-orange bg-clip-text text-transparent">Adventure Starts Here</span>
            </h1>
            <p className="text-lg md:text-xl text-rq-muted leading-relaxed mb-10 max-w-2xl mx-auto">
              The AI-powered reading platform that combines smart book discovery, social motivation, and game-like engagement to make every child a reader.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo" className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-purple-200 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2">
                Try Interactive Demo
                <span className="text-xl">→</span>
              </Link>
              <Link to="/pricing" className="bg-white text-rq-purple border-2 border-purple-200 px-8 py-4 rounded-full text-lg font-bold hover:border-rq-purple hover:shadow-lg transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2">
                View Pricing
              </Link>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-purple-200/50 border border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-rq-purple to-rq-purple-light p-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-white/80 text-sm ml-2 font-medium">ReadQuest — Jayden's Dashboard</span>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-teal-50">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Streak Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">🔥</span>
                      <span className="text-xs font-semibold text-rq-orange bg-orange-100 px-2 py-0.5 rounded-full">14-Day Streak!</span>
                    </div>
                    <div className="text-2xl font-bold text-rq-text">14 Days</div>
                    <div className="text-sm text-rq-muted">Keep it going! 🎯</div>
                    <div className="mt-3 flex gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-full h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />
                      ))}
                    </div>
                  </div>
                  {/* XP Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">⚡</span>
                      <span className="text-xs font-semibold text-rq-purple bg-purple-100 px-2 py-0.5 rounded-full">Level 12</span>
                    </div>
                    <div className="text-2xl font-bold text-rq-text">2,750 XP</div>
                    <div className="text-sm text-rq-muted">Bookworm 🐛</div>
                    <div className="mt-3 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="xp-bar h-full rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                  {/* Books Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">📚</span>
                      <span className="text-xs font-semibold text-rq-teal bg-teal-100 px-2 py-0.5 rounded-full">This Month: 4</span>
                    </div>
                    <div className="text-2xl font-bold text-rq-text">23 Books</div>
                    <div className="text-sm text-rq-muted">Read this year</div>
                    <div className="mt-3 flex -space-x-2">
                      {['📖', '📗', '📘', '📙', '📕'].map((b, i) => (
                        <span key={i} className="text-xl">{b}</span>
                      ))}
                      <span className="text-sm text-rq-muted ml-2 self-center">+18 more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-rq-purple to-rq-purple-dark py-10 -mt-6 relative z-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything Kids Need to <span className="text-rq-purple">Love Reading</span>
            </h2>
            <p className="text-lg text-rq-muted max-w-2xl mx-auto">
              Built for students, loved by teachers, trusted by schools.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-purple-50 hover:border-rq-purple/30 hover:shadow-lg hover:shadow-purple-100/50 transition-all hover:-translate-y-1 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-rq-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Get Started in <span className="text-rq-teal">3 Easy Steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, icon: '🏫', title: 'Sign Up Your School', description: 'Create your school account, import students via Clever, ClassLink, or CSV. Setup takes less than 30 minutes.' },
              { step: 2, icon: '📱', title: 'Students Explore', description: 'Students log in with a class code, take the reading quiz, and get personalized book recommendations instantly.' },
              { step: 3, icon: '📈', title: 'Watch Reading Soar', description: 'Track progress on your teacher dashboard. See reading time increase, engagement climb, and reading levels grow.' },
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-purple-100 shadow-sm text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-rq-purple to-rq-teal rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-2">{item.icon}</div>
                <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-rq-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Gamification That <span className="text-rq-orange">Actually Works</span>
              </h2>
              <p className="text-lg text-rq-muted mb-8 leading-relaxed">
                ReadQuest uses the same engagement mechanics that make Duolingo and games so addictive — but channels that energy into reading. XP, streaks, badges, leaderboards, and level-ups keep students coming back for more.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '⚡', label: 'Earn XP', desc: 'Every page, every review, every day adds to your experience' },
                  { icon: '🔥', label: 'Build Streaks', desc: 'Daily reading habits that stick (with streak freezes!)' },
                  { icon: '🏅', label: 'Collect 100+ Badges', desc: 'From common to legendary — something for every reader' },
                  { icon: '🎭', label: 'Customize Avatars', desc: 'Unlock items through reading achievements' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-purple-50 hover:border-rq-purple/20 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-sm text-rq-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-teal-100 rounded-3xl p-8">
                {/* Badge Showcase */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: '⚡', name: 'Speed Reader', color: 'from-orange-400 to-red-400', rarity: 'Rare' },
                    { icon: '🗺️', name: 'Genre Explorer', color: 'from-teal-400 to-blue-400', rarity: 'Uncommon' },
                    { icon: '🔥', name: '14-Day Streak', color: 'from-red-400 to-orange-400', rarity: 'Uncommon' },
                    { icon: '✍️', name: 'Review Master', color: 'from-purple-400 to-pink-400', rarity: 'Uncommon' },
                    { icon: '🧙', name: 'Fantasy Fan', color: 'from-purple-600 to-blue-400', rarity: 'Common' },
                    { icon: '🦋', name: 'Social Star', color: 'from-pink-400 to-rose-400', rarity: 'Rare' },
                  ].map((badge, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 transition-transform cursor-pointer">
                      <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl mb-2`}>
                        {badge.icon}
                      </div>
                      <div className="text-xs font-semibold truncate">{badge.name}</div>
                      <div className="text-[10px] text-rq-muted">{badge.rarity}</div>
                    </div>
                  ))}
                </div>
                {/* Level Progress */}
                <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🐛</span>
                      <span className="font-semibold">Level 12 — Bookworm</span>
                    </div>
                    <span className="text-sm text-rq-purple font-bold">2,750 / 3,000 XP</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="xp-bar h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="text-xs text-rq-muted mt-1">250 XP to Level 13! 🎉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Teachers */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
                <div className="bg-gradient-to-r from-rq-teal to-rq-blue p-4">
                  <span className="text-white font-display font-semibold">📊 Teacher Dashboard — Ms. Rodriguez</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-teal-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-rq-teal">28</div>
                      <div className="text-xs text-rq-muted">Students</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-rq-blue">3.2</div>
                      <div className="text-xs text-rq-muted">Avg Books/Mo</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-rq-purple">142</div>
                      <div className="text-xs text-rq-muted">Avg Min/Wk</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2">Student Reading This Week</div>
                    <div className="space-y-2">
                      {[
                        { name: 'Ava C.', min: 250, max: 250, color: 'bg-green-400' },
                        { name: 'Sophia R.', min: 210, max: 250, color: 'bg-green-400' },
                        { name: 'Maya L.', min: 185, max: 250, color: 'bg-teal-400' },
                        { name: 'Jayden M.', min: 142, max: 250, color: 'bg-blue-400' },
                        { name: 'Olivia P.', min: 35, max: 250, color: 'bg-red-400' },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs w-20 truncate text-rq-muted">{s.name}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                            <div className={`${s.color} h-full rounded-full transition-all`} style={{ width: `${(s.min / s.max) * 100}%` }} />
                          </div>
                          <span className="text-xs text-rq-muted w-12 text-right">{s.min} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">⚠️ 2 students need support</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">✨ 3 exceeding goals</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Built for <span className="text-rq-teal">Teachers</span>
              </h2>
              <p className="text-lg text-rq-muted mb-8 leading-relaxed">
                See every student's reading journey at a glance. Create challenges, track goals, identify struggling readers early, and generate reports for parent conferences — all in one beautiful dashboard.
              </p>
              <ul className="space-y-3">
                {[
                  'Bulk import via Clever, ClassLink, or Google Classroom',
                  'Real-time reading activity monitoring',
                  'Custom challenge creation with templates',
                  'Exportable PDF/CSV reports',
                  'Student alerts for falling behind',
                  'Setup in under 30 minutes',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-rq-teal text-lg">✓</span>
                    <span className="text-rq-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Publishers / Product Placement */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <span className="text-sm">📺</span>
                <span className="text-sm font-medium text-rq-orange">For Publishers & Advertisers</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Embedded <span className="text-rq-orange">Book Marketing</span> That Kids Love
              </h2>
              <p className="text-lg text-rq-muted mb-8 leading-relaxed">
                Place your books where millions of kids are already watching. ReadQuest is the first platform connecting children's publishers with TV shows, streaming originals, and YouTube creators — with closed-loop attribution from viewership to reads.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Place books in Netflix, PBS Kids, Disney+, and YouTube shows',
                  'Creator partnerships with 142+ kids influencers',
                  'Track impressions → shelf adds → reads (full attribution)',
                  'COPPA-compliant aggregated analytics',
                  'The most defensible product category in kids media',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-rq-orange text-lg">✓</span>
                    <span className="text-rq-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/publishers" className="bg-gradient-to-r from-rq-orange to-rq-pink text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-orange-200 transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                Publisher Portal →
              </Link>
            </div>
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-rq-orange to-rq-pink p-4">
                  <span className="text-white font-display font-semibold">📊 Publisher Attribution Dashboard</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-rq-orange">22.1M</div>
                      <div className="text-[10px] text-rq-muted">Impressions</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-rq-purple">399K</div>
                      <div className="text-[10px] text-rq-muted">Shelf Adds</div>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-rq-teal">104.3K</div>
                      <div className="text-[10px] text-rq-muted">Books Read</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2">Show-to-Read Attribution</div>
                    <div className="space-y-2">
                      {[
                        { show: '📺 Ada Twist', book: 'The Wild Robot', reads: '22.1K' },
                        { show: '🧢 Blippi', book: 'Dog Man', reads: '41.2K' },
                        { show: '👻 Ghostwriter', book: 'Percy Jackson', reads: '12.3K' },
                        { show: '👩‍🏫 Ms. Rachel', book: 'Wings of Fire', reads: '18.9K' },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-xs">
                          <span className="font-medium">{row.show}</span>
                          <span className="text-rq-muted">→</span>
                          <span>{row.book}</span>
                          <span className="font-bold text-rq-teal">{row.reads}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-orange-100 text-rq-orange text-xs px-2 py-1 rounded-full">$0.48 avg cost/read</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">26.1% view-to-read rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Loved by <span className="text-rq-pink">Students & Teachers</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{t.avatar}</div>
                <p className="text-sm text-rq-muted leading-relaxed mb-4">"{t.text}"</p>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-rq-muted">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-rq-purple via-rq-purple-light to-rq-teal rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-4 left-8 text-4xl opacity-20 animate-float">📚</div>
              <div className="absolute bottom-8 right-12 text-4xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
              <div className="absolute top-12 right-24 text-3xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🏆</div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 relative">
              Ready to Transform Reading?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto relative">
              Join thousands of schools making every child a reader. Start free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link to="/demo" className="bg-white text-rq-purple px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2">
                Try Interactive Demo
                <span>→</span>
              </Link>
              <a href="mailto:phull@pshindustries.com" className="border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2">
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
