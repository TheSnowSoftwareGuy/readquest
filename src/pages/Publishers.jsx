import { useState } from 'react'
import { Link } from 'react-router-dom'
import { showPartners, placementTypes, publisherTiers, dealExamples, revenueProjections, campaignMetrics } from '../data/placementData'

export default function Publishers() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-purple-50 py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="text-sm">📺</span>
              <span className="text-sm font-medium text-rq-orange">The first book-to-media placement platform for kids</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-rq-text">Put Your Books</span>
              <br />
              <span className="bg-gradient-to-r from-rq-orange via-rq-pink to-rq-purple bg-clip-text text-transparent">Where Kids Are Watching</span>
            </h1>
            <p className="text-lg text-rq-muted leading-relaxed mb-10 max-w-2xl mx-auto">
              ReadQuest connects children's book publishers with TV shows, streaming originals, YouTube creators, and influencers — turning screen time into reading time. The only platform with closed-loop attribution from viewership to reads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#tiers" className="bg-gradient-to-r from-rq-orange to-rq-pink text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-orange-200 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2">
                View Publisher Plans →
              </a>
              <a href="mailto:phull@phoenix-intel.com" className="bg-white text-rq-orange border-2 border-orange-200 px-8 py-4 rounded-full text-lg font-bold hover:border-rq-orange transition-all hover:-translate-y-1">
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Books Win */}
      <section className="py-20 bg-gradient-to-r from-rq-purple to-rq-purple-dark text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Why Books Are the Perfect Product Placement
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
            Unlike food, toys, or tech — books face zero regulatory pushback and are actively welcomed by parents, networks, and creators.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🎓', title: 'Educational Alignment', desc: 'Books reinforce the educational mission platforms want to project' },
              { icon: '👨‍👩‍👧‍👦', title: 'Parent Approval', desc: 'Parents actively want kids exposed to reading content — no backlash' },
              { icon: '⚖️', title: 'Regulatory Safe Harbor', desc: 'Books face virtually no scrutiny — CARU, FTC, and COPPA friendly' },
              { icon: '🎬', title: 'Creator Receptivity', desc: 'Showrunners and writers welcome integrations that add depth to stories' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Show Partners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Our <span className="text-rq-orange">Media Network</span></h2>
            <p className="text-rq-muted max-w-2xl mx-auto">Active partnerships and placement opportunities across streaming, YouTube, and educational content.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {showPartners.map((show) => (
              <div key={show.id} className="bg-white rounded-2xl p-5 border border-purple-50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group text-center">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{show.logo}</div>
                <div className="font-display font-semibold text-sm">{show.name}</div>
                <div className="text-xs mt-1" style={{ color: show.color }}>{show.platform}</div>
                <div className="text-[10px] text-rq-muted bg-gray-50 rounded-full px-2 py-0.5 mt-2 inline-block">{show.type}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-rq-muted">+ 134 more creators and shows in our network</p>
          </div>
        </div>
      </section>

      {/* Placement Types */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Placement <span className="text-rq-purple">Formats</span></h2>
            <p className="text-rq-muted max-w-2xl mx-auto">From subtle background placements to full episode integrations — we match the right format to your goals.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placementTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{type.icon}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: type.color + '15', color: type.color }}>
                    {type.effectiveness}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{type.name}</h3>
                <p className="text-sm text-rq-muted mb-4">{type.description}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-rq-muted">Complexity</span>
                    <span className="font-semibold">{type.complexity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-rq-muted">Lead Time</span>
                    <span className="font-semibold">{type.leadTime}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-rq-muted">Price Range</span>
                    <span className="font-semibold" style={{ color: type.color }}>{type.priceRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - The Funnel */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">The <span className="text-rq-teal">Closed-Loop</span> Advantage</h2>
            <p className="text-rq-muted max-w-2xl mx-auto">We don't just place books — we prove it works. The only platform that tracks from screen to shelf.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-2 items-center">
              {[
                { icon: '📺', label: 'Kid watches show', sub: 'Streaming / YouTube' },
                { icon: '→', label: '', sub: '', arrow: true },
                { icon: '👀', label: 'Sees your book', sub: 'Visual / Narrative' },
                { icon: '→', label: '', sub: '', arrow: true },
                { icon: '📱', label: 'Opens ReadQuest', sub: 'QR / Push / Search' },
              ].map((step, i) => (
                step.arrow ? (
                  <div key={i} className="text-3xl text-rq-purple font-bold text-center hidden md:block">→</div>
                ) : (
                  <div key={i} className="bg-white rounded-xl p-4 text-center border border-purple-50 shadow-sm">
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <div className="text-sm font-semibold">{step.label}</div>
                    <div className="text-[10px] text-rq-muted">{step.sub}</div>
                  </div>
                )
              ))}
            </div>
            <div className="flex justify-center my-4">
              <div className="text-3xl text-rq-purple font-bold">↓</div>
            </div>
            <div className="grid md:grid-cols-5 gap-2 items-center">
              {[
                { icon: '📚', label: 'Adds to bookshelf', sub: 'Tracked action' },
                { icon: '→', label: '', sub: '', arrow: true },
                { icon: '📖', label: 'Reads the book', sub: 'Minutes tracked' },
                { icon: '→', label: '', sub: '', arrow: true },
                { icon: '📊', label: 'You see the data', sub: 'Full attribution' },
              ].map((step, i) => (
                step.arrow ? (
                  <div key={i} className="text-3xl text-rq-teal font-bold text-center hidden md:block">→</div>
                ) : (
                  <div key={i} className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl p-4 text-center border border-teal-100 shadow-sm">
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <div className="text-sm font-semibold">{step.label}</div>
                    <div className="text-[10px] text-rq-muted">{step.sub}</div>
                  </div>
                )
              ))}
            </div>
          </div>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {[
              { value: campaignMetrics.totalImpressions, label: 'Total Impressions' },
              { value: campaignMetrics.avgReadRate, label: 'View-to-Read Rate' },
              { value: campaignMetrics.avgCostPerRead, label: 'Avg Cost Per Read' },
              { value: campaignMetrics.creatorPartners, label: 'Creator Partners' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border border-purple-50 shadow-sm">
                <div className="font-display text-2xl font-bold text-rq-purple">{stat.value}</div>
                <div className="text-xs text-rq-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attribution Dashboard Preview */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Publisher <span className="text-rq-orange">Analytics Dashboard</span></h2>
            <p className="text-rq-muted">Real-time attribution tracking. See exactly how placements convert to reads.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-rq-orange to-rq-pink p-4 flex items-center justify-between">
              <span className="text-white font-display font-semibold">📊 Publisher Dashboard — Scholastic Children's</span>
              <span className="text-white/70 text-xs">Last updated: 2 minutes ago</span>
            </div>
            <div className="p-6">
              {/* Top metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                  { label: 'Active Campaigns', value: '5', icon: '📢' },
                  { label: 'Total Impressions', value: '22.1M', icon: '👁️' },
                  { label: 'Shelf Adds', value: '399K', icon: '📚' },
                  { label: 'Books Read', value: '104.3K', icon: '📖' },
                  { label: 'Avg Cost/Read', value: '$0.48', icon: '💰' },
                ].map((m, i) => (
                  <div key={i} className="bg-gradient-to-br from-orange-50 to-transparent rounded-xl p-3 text-center border border-orange-100">
                    <div className="text-xl">{m.icon}</div>
                    <div className="font-display text-xl font-bold">{m.value}</div>
                    <div className="text-[10px] text-rq-muted">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Attribution Table */}
              <div className="mb-6">
                <h4 className="font-display font-semibold mb-3">📺 Show-to-Read Attribution</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs text-rq-muted uppercase">
                        <th className="px-4 py-2">Show</th>
                        <th className="px-4 py-2">Book</th>
                        <th className="px-4 py-2">Viewers</th>
                        <th className="px-4 py-2">New Reads</th>
                        <th className="px-4 py-2">Conv Rate</th>
                        <th className="px-4 py-2">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { show: '📺 Ada Twist', book: 'The Wild Robot', viewers: '5.1M', reads: '22.1K', conv: '0.43%', rev: '$11,050' },
                        { show: '🧢 Blippi', book: 'Dog Man', viewers: '8.7M', reads: '41.2K', conv: '0.47%', rev: '$20,600' },
                        { show: '👻 Ghostwriter', book: 'Percy Jackson', viewers: '2.4M', reads: '12.3K', conv: '0.51%', rev: '$6,150' },
                        { show: '👩‍🏫 Ms. Rachel', book: 'Wings of Fire', viewers: '3.8M', reads: '18.9K', conv: '0.50%', rev: '$9,450' },
                        { show: '🦎 Wild Kratts', book: 'Hatchet', viewers: '1.9M', reads: '9.8K', conv: '0.52%', rev: '$4,900' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-orange-50/30">
                          <td className="px-4 py-2 font-medium">{row.show}</td>
                          <td className="px-4 py-2">{row.book}</td>
                          <td className="px-4 py-2">{row.viewers}</td>
                          <td className="px-4 py-2 font-bold text-rq-teal">{row.reads}</td>
                          <td className="px-4 py-2">{row.conv}</td>
                          <td className="px-4 py-2 font-bold text-rq-orange">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Growth Chart */}
              <div>
                <h4 className="font-display font-semibold mb-3">📈 Weekly Campaign Performance</h4>
                <div className="flex items-end gap-3 h-32">
                  {[12, 18, 24, 31, 38, 42, 46, 51].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[10px] text-rq-muted font-semibold">{(val / 10).toFixed(1)}M</div>
                      <div className="w-full bg-gradient-to-t from-rq-orange to-rq-pink rounded-t-md hover:opacity-80 transition-opacity cursor-pointer" style={{ height: `${(val / 51) * 100}%` }} />
                      <div className="text-[10px] text-rq-muted">W{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deal Examples */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Example <span className="text-rq-purple">Deals</span></h2>
            <p className="text-rq-muted">See how placement partnerships are structured</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {dealExamples.map((deal, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-purple-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="font-display font-semibold text-lg mb-1">{deal.title}</div>
                <div className="text-xs text-rq-muted mb-4">{deal.publisher} → {deal.creator}</div>
                <div className="bg-purple-50 rounded-xl p-3 mb-4 text-sm text-rq-text">{deal.placement}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-rq-muted">Publisher Pays</span>
                    <span className="font-bold text-rq-orange">{deal.publisherPays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rq-muted">Our Commission</span>
                    <span className="font-bold text-rq-purple">{deal.ourCommission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rq-muted">Creator Receives</span>
                    <span className="font-bold text-rq-teal">{deal.creatorReceives}</span>
                  </div>
                  <div className="border-t border-gray-100 my-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-rq-muted">Expected Views</span>
                    <span>{deal.expectedViews}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-rq-muted">Est. CPM</span>
                    <span>{deal.estimatedCPM}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publisher Tiers */}
      <section id="tiers" className="py-20 bg-gradient-to-br from-orange-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Publisher <span className="text-rq-orange">Plans</span></h2>
            <p className="text-rq-muted">From self-published authors to the Big 5 — a plan for every publisher.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publisherTiers.map((tier, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-xl relative ${tier.popular ? 'border-rq-orange shadow-xl shadow-orange-100' : 'border-purple-100 shadow-sm'}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rq-orange to-rq-pink text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{tier.icon}</div>
                  <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                  <div className="flex items-end justify-center gap-1 mt-2">
                    <span className="font-display text-2xl font-bold">{tier.price}</span>
                    <span className="text-xs text-rq-muted mb-1">{tier.period}</span>
                  </div>
                  <p className="text-xs text-rq-muted mt-1">{tier.description}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-rq-orange mt-0.5">✓</span>
                      <span className="text-rq-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-rq-muted mb-4 bg-gray-50 rounded-lg p-2">
                  <strong>Best for:</strong> {tier.bestFor}
                </div>
                <button className={`w-full py-3 rounded-full text-sm font-bold transition-all ${tier.popular ? 'bg-gradient-to-r from-rq-orange to-rq-pink text-white hover:shadow-lg' : 'bg-orange-100 text-rq-orange hover:bg-orange-200'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Revenue <span className="text-rq-teal">Projections</span></h2>
            <p className="text-rq-muted">Placement services revenue potential over 5 years</p>
          </div>
          <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-teal-50 text-left text-xs text-rq-muted uppercase">
                    <th className="px-5 py-3">Period</th>
                    <th className="px-5 py-3">Subscriptions</th>
                    <th className="px-5 py-3">Commissions</th>
                    <th className="px-5 py-3">Placements</th>
                    <th className="px-5 py-3">Tech/Data</th>
                    <th className="px-5 py-3 font-bold text-rq-purple">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {revenueProjections.map((row, i) => (
                    <tr key={i} className="hover:bg-purple-50/30">
                      <td className="px-5 py-3 font-bold">{row.year}</td>
                      <td className="px-5 py-3">{row.subscriptions}</td>
                      <td className="px-5 py-3">{row.commissions}</td>
                      <td className="px-5 py-3">{row.placements}</td>
                      <td className="px-5 py-3">{row.tech}</td>
                      <td className="px-5 py-3 font-bold text-rq-purple">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Built for <span className="text-rq-green">Compliance</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🔒', title: 'COPPA Compliant', desc: 'All attribution uses aggregated, anonymized data. No individual child tracking shared with publishers.' },
              { icon: '📋', title: 'FTC Transparent', desc: 'Over-disclosure policy. All paid placements include end-credits acknowledgment and proper influencer #ad tags.' },
              { icon: '🛡️', title: 'CARU Aligned', desc: 'Books are the most defensible product category for kids. No restricted categories, no regulatory risk.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-rq-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-rq-orange via-rq-pink to-rq-purple rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <h2 className="font-display text-4xl font-bold mb-4 relative">Get Your Books In Front of Millions</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto relative">
              Join 47+ publishers already placing books where kids are watching. Start with a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <a href="mailto:phull@phoenix-intel.com" className="bg-white text-rq-orange px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl transition-all hover:-translate-y-1">
                Schedule a Call →
              </a>
              <Link to="/demo" className="border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all hover:-translate-y-1">
                See the Platform
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
