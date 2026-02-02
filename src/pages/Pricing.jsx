import { useState } from 'react'
import { Link } from 'react-router-dom'
import { pricingTiers } from '../data/mockData'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="text-rq-purple">Pricing</span>
          </h1>
          <p className="text-lg text-rq-muted max-w-2xl mx-auto">
            Free for individual readers. Affordable for schools. Scalable for districts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-xl relative ${
                tier.popular
                  ? 'border-rq-purple shadow-xl shadow-purple-100'
                  : 'border-purple-100 shadow-sm hover:shadow-purple-100/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rq-purple to-rq-teal text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-xs text-rq-muted mb-3">{tier.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="font-display text-4xl font-bold text-rq-text">{tier.price}</span>
                  <span className="text-sm text-rq-muted mb-1">{tier.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-rq-teal mt-0.5">✓</span>
                    <span className="text-rq-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full text-sm font-bold transition-all ${
                tier.popular
                  ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white hover:shadow-lg hover:shadow-purple-200'
                  : 'bg-purple-100 text-rq-purple hover:bg-purple-200'
              }`}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="font-display text-3xl font-bold text-center mb-10">
            Frequently Asked <span className="text-rq-purple">Questions</span>
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Is ReadQuest really free for individual users?', a: 'Yes! Individual readers get a free account with a virtual bookshelf, basic reading log, 3 AI recommendations per week, and access to the social feed within their school. Premium unlocks unlimited features.' },
              { q: 'How does school pricing work?', a: 'School pricing is per student per year. You get full access to teacher dashboards, reading reports, challenge tools, LMS integration, and bulk student import. Volume discounts available for 500+ students.' },
              { q: 'Is ReadQuest COPPA and FERPA compliant?', a: 'Absolutely. ReadQuest is built from the ground up for student privacy. We use verifiable parental consent, encrypt all student data, never serve behavioral ads, and honor data deletion requests within 48 hours.' },
              { q: 'Can I try ReadQuest before committing?', a: 'Of course! Individual accounts are free. Schools can request a 60-day free pilot program with full feature access. Districts get a dedicated onboarding specialist.' },
              { q: 'What LMS integrations do you support?', a: 'We integrate with Google Classroom, Clever, ClassLink, Canvas, Schoology, and Microsoft Teams for Education. SSO, roster sync, and grade passback are all supported.' },
              { q: 'How many books are in the database?', a: 'Over 1.5 million books, sourced from Open Library, Google Books, and our curated collections. Books include reading level data (Lexile, AR), genre tags, and content information.' },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-rq-muted mb-6">Join thousands of schools making every child a reader.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/demo" className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5">
              Try Interactive Demo
            </Link>
            <a href="mailto:phull@pshindustries.com" className="bg-white text-rq-purple border-2 border-purple-200 px-8 py-3 rounded-full font-bold hover:border-rq-purple transition-all hover:-translate-y-0.5">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-purple-50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-purple-50/30 transition-colors"
      >
        <span className="font-semibold text-sm pr-4">{question}</span>
        <span className={`text-rq-purple transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-rq-muted leading-relaxed animate-slide-up">
          {answer}
        </div>
      )}
    </div>
  )
}
