import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function COPPACompliance() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <span className="text-4xl mb-4 block">🛡️</span>
          <h1 className="font-display text-4xl font-bold mb-3">COPPA Compliance</h1>
          <p className="text-rq-muted text-lg">How ReadQuest protects children's privacy under federal law</p>
          <p className="text-sm text-rq-muted mt-2">Last updated: February 1, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-purple max-w-none">

          {/* Key badge */}
          <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-2xl p-6 mb-10 border border-purple-100 not-prose">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔒</div>
              <div>
                <h3 className="font-display font-bold text-lg text-rq-purple mb-1">Children's Online Privacy Protection Act</h3>
                <p className="text-sm text-rq-muted">
                  COPPA is a federal law that protects the privacy of children under 13 years of age. ReadQuest is fully committed to complying with COPPA and goes beyond the minimum requirements to ensure children's safety and privacy.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-white rounded-full px-3 py-1 text-xs font-semibold text-rq-purple border border-purple-200">🔒 COPPA Compliant</span>
                  <span className="bg-white rounded-full px-3 py-1 text-xs font-semibold text-rq-teal border border-teal-200">🛡️ FERPA Aligned</span>
                  <span className="bg-white rounded-full px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">✅ Student Privacy Pledge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <nav className="bg-purple-50/50 rounded-2xl p-6 mb-10 border border-purple-100">
            <h2 className="font-display text-lg font-bold text-rq-purple mb-3 mt-0">Table of Contents</h2>
            <ol className="columns-2 gap-8 text-sm space-y-1 list-decimal pl-5">
              <li><a href="#overview" className="text-rq-purple hover:underline">How We Comply</a></li>
              <li><a href="#consent" className="text-rq-purple hover:underline">Parental Consent Process</a></li>
              <li><a href="#data-minimization" className="text-rq-purple hover:underline">Data Minimization</a></li>
              <li><a href="#data-practices" className="text-rq-purple hover:underline">Data Collection Practices</a></li>
              <li><a href="#social-features" className="text-rq-purple hover:underline">Social Features & Safety</a></li>
              <li><a href="#third-parties" className="text-rq-purple hover:underline">Third-Party Services</a></li>
              <li><a href="#parental-controls" className="text-rq-purple hover:underline">Parental Controls</a></li>
              <li><a href="#school-consent" className="text-rq-purple hover:underline">School Consent Exception</a></li>
              <li><a href="#complaints" className="text-rq-purple hover:underline">How to Contact Us / File Complaints</a></li>
            </ol>
          </nav>

          {/* 1. Overview */}
          <Section id="overview" number="1" title="How ReadQuest Complies with COPPA">
            <p>
              ReadQuest takes children's privacy seriously. As a platform designed for students in grades K–8, many of our users are under the age of 13. Here is how we ensure COPPA compliance at every level:
            </p>

            <div className="grid md:grid-cols-2 gap-4 not-prose mb-4">
              <ComplianceCard
                icon="📋"
                title="Direct Notice"
                description="We provide clear, complete notice to parents about what data we collect and how it's used — before any collection occurs."
              />
              <ComplianceCard
                icon="✅"
                title="Verifiable Consent"
                description="We obtain verifiable parental consent before collecting personal information from children under 13."
              />
              <ComplianceCard
                icon="🔒"
                title="Data Minimization"
                description="We collect only the minimum data necessary for children to use ReadQuest's educational features."
              />
              <ComplianceCard
                icon="👨‍👩‍👧"
                title="Parental Access"
                description="Parents can review, delete, and manage their child's data at any time through the Parent Dashboard."
              />
              <ComplianceCard
                icon="🚫"
                title="No Advertising to Kids"
                description="We never serve behavioral advertising to children. Period."
              />
              <ComplianceCard
                icon="🛡️"
                title="Secure by Design"
                description="Row-level security, encryption, and strict access controls protect children's data at the database level."
              />
            </div>
          </Section>

          {/* 2. Parental Consent */}
          <Section id="consent" number="2" title="Parental Consent Process">
            <p>
              We use a multi-step process to obtain and verify parental consent:
            </p>

            <div className="not-prose mb-4">
              <div className="space-y-4">
                <StepCard step={1} title="Teacher Creates Student Account">
                  The teacher enters the student's first name, last initial, and grade level. A parent email address is required.
                </StepCard>
                <StepCard step={2} title="Direct Notice to Parent">
                  We send the parent a detailed email explaining what data we will collect, how it will be used, and their rights under COPPA.
                </StepCard>
                <StepCard step={3} title="Consent Verification">
                  Parents must verify their identity and provide affirmative consent through one of the following methods:
                  <ul className="mt-2 space-y-1 text-sm ml-4">
                    <li>• <strong>Email Plus:</strong> Consent form signed and returned via email</li>
                    <li>• <strong>Credit Card Verification:</strong> A small authorization charge (immediately refunded) to verify parental identity</li>
                    <li>• <strong>Knowledge-Based Verification:</strong> Identity verification through a third-party service</li>
                  </ul>
                </StepCard>
                <StepCard step={4} title="Account Activation">
                  Only after verified consent is received will the student's account be fully activated with interactive and social features.
                </StepCard>
                <StepCard step={5} title="Ongoing Rights">
                  Parents can withdraw consent, request data deletion, or modify permissions at any time through the Parent Dashboard.
                </StepCard>
              </div>
            </div>

            <p>
              <strong>Before consent is obtained,</strong> students may access limited, non-interactive features (browse book catalog, view achievements) but cannot create personal data (reviews, social posts, friend connections).
            </p>
          </Section>

          {/* 3. Data Minimization */}
          <Section id="data-minimization" number="3" title="Data Minimization Practices">
            <p>
              We follow the principle of data minimization — collecting only what's necessary for the educational purpose of ReadQuest.
            </p>

            <div className="not-prose mb-4">
              <div className="bg-white rounded-2xl border border-purple-50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-purple-50 text-left">
                      <th className="px-4 py-3 font-semibold text-rq-purple">Data Point</th>
                      <th className="px-4 py-3 font-semibold text-rq-purple">Collected?</th>
                      <th className="px-4 py-3 font-semibold text-rq-purple">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    <DataRow data="First name + last initial" collected="✅ Yes" purpose="Identification within class" />
                    <DataRow data="Grade level" collected="✅ Yes" purpose="Age-appropriate content" />
                    <DataRow data="Reading activity" collected="✅ Yes" purpose="Core educational function" />
                    <DataRow data="Book reviews/ratings" collected="✅ Yes" purpose="Reading engagement" />
                    <DataRow data="Parent email" collected="✅ Yes" purpose="Consent & communication" />
                    <DataRow data="Full name" collected="❌ No" purpose="—" />
                    <DataRow data="Home address" collected="❌ No" purpose="—" />
                    <DataRow data="Phone number" collected="❌ No" purpose="—" />
                    <DataRow data="Photo/video" collected="❌ No" purpose="—" />
                    <DataRow data="Precise location" collected="❌ No" purpose="—" />
                    <DataRow data="Social media IDs" collected="❌ No" purpose="—" />
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* 4. Data Practices */}
          <Section id="data-practices" number="4" title="Data Collection Practices">
            <h4 className="font-display font-semibold text-rq-purple">What We Collect</h4>
            <ul>
              <li><strong>Persistent identifiers:</strong> We use session cookies and authentication tokens strictly for maintaining login state. We do not use persistent identifiers for tracking or advertising.</li>
              <li><strong>Reading data:</strong> Books read, time spent reading, pages completed — used solely for educational progress tracking.</li>
              <li><strong>Interaction data:</strong> Reviews, ratings, social reactions — limited to school-bounded interactions with content moderation.</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">What We Don't Do</h4>
            <ul>
              <li>❌ We do <strong>not</strong> serve behavioral advertising to children</li>
              <li>❌ We do <strong>not</strong> sell or rent children's personal information</li>
              <li>❌ We do <strong>not</strong> share data with third parties for marketing purposes</li>
              <li>❌ We do <strong>not</strong> require more information than necessary to use the Service</li>
              <li>❌ We do <strong>not</strong> use dark patterns or deceptive design to collect data</li>
            </ul>
          </Section>

          {/* 5. Social Features */}
          <Section id="social-features" number="5" title="Social Features & Safety">
            <p>
              ReadQuest includes social features designed to motivate reading through peer engagement. All social features for children under 13 include the following safeguards:
            </p>
            <ul>
              <li><strong>School Boundary:</strong> Social interactions are limited to students within the same school. Students cannot connect with or see content from users outside their school.</li>
              <li><strong>Content Moderation:</strong> All user-generated content (reviews, feed posts) is subject to AI-based and human moderation.</li>
              <li><strong>Limited Public Profile:</strong> Student profiles display only first name, last initial, level, and badges. No personal details are exposed.</li>
              <li><strong>Parent Override:</strong> Parents can disable social features entirely through the Parent Dashboard.</li>
              <li><strong>No Direct Messaging:</strong> Students cannot send private messages to each other. All interactions are visible to teachers.</li>
              <li><strong>Predefined Reactions:</strong> Social reactions are limited to a set of predefined, kid-safe emoji options.</li>
            </ul>
          </Section>

          {/* 6. Third-Party Services */}
          <Section id="third-parties" number="6" title="Third-Party Services">
            <p>
              We use a limited number of carefully vetted third-party services to operate ReadQuest:
            </p>

            <div className="not-prose mb-4">
              <div className="bg-white rounded-2xl border border-purple-50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-purple-50 text-left">
                      <th className="px-4 py-3 font-semibold text-rq-purple">Service</th>
                      <th className="px-4 py-3 font-semibold text-rq-purple">Purpose</th>
                      <th className="px-4 py-3 font-semibold text-rq-purple">Data Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    <tr>
                      <td className="px-4 py-3 font-medium">Supabase</td>
                      <td className="px-4 py-3 text-rq-muted">Database & authentication</td>
                      <td className="px-4 py-3 text-rq-muted">All user data (encrypted, RLS-protected)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Open Library API</td>
                      <td className="px-4 py-3 text-rq-muted">Book metadata & covers</td>
                      <td className="px-4 py-3 text-rq-muted">No user data shared — public API queries only</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Vercel / GitHub Pages</td>
                      <td className="px-4 py-3 text-rq-muted">Web hosting</td>
                      <td className="px-4 py-3 text-rq-muted">Server logs (IP, user agent) — anonymized for minors</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Email Provider</td>
                      <td className="px-4 py-3 text-rq-muted">Parent consent & notifications</td>
                      <td className="px-4 py-3 text-rq-muted">Parent email addresses only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p>
              All third-party services are bound by data processing agreements that require COPPA-compliant data handling. We regularly audit our third-party relationships.
            </p>
          </Section>

          {/* 7. Parental Controls */}
          <Section id="parental-controls" number="7" title="Parental Controls">
            <p>
              ReadQuest provides comprehensive parental controls through the <Link to="/parent" className="text-rq-purple hover:underline font-semibold">Parent Dashboard</Link>:
            </p>
            <ul>
              <li><strong>View all data:</strong> See your child's reading logs, reviews, bookshelf, badges, and activity feed</li>
              <li><strong>Toggle social features:</strong> Enable or disable social interactions (friend requests, reactions, class feed)</li>
              <li><strong>Control review visibility:</strong> Choose whether your child's book reviews are visible to classmates</li>
              <li><strong>Manage notifications:</strong> Enable or disable push notifications (streak reminders, achievement alerts)</li>
              <li><strong>Set reading goals:</strong> Establish daily reading minute targets</li>
              <li><strong>Request data export:</strong> Download your child's complete data in a standard format</li>
              <li><strong>Delete account:</strong> Request complete deletion of your child's account and data</li>
              <li><strong>Withdraw consent:</strong> Revoke consent at any time — data is deleted within 30 days</li>
            </ul>
          </Section>

          {/* 8. School Consent Exception */}
          <Section id="school-consent" number="8" title="School Consent Exception">
            <p>
              Under COPPA, schools may act as intermediaries and consent to the collection of student data on behalf of parents, <strong>but only for educational purposes</strong>. ReadQuest supports this as follows:
            </p>
            <ul>
              <li>Schools may consent for basic educational use (reading tracking, progress monitoring)</li>
              <li>School consent does <strong>not</strong> extend to commercial purposes — we never use student data for advertising</li>
              <li>Even with school consent, parents retain the right to review data, request deletion, and opt out of features</li>
              <li>Schools must maintain their own records of consent and make them available to parents upon request</li>
            </ul>
            <p>
              We recommend that schools inform parents about ReadQuest's use and provide access to this COPPA Compliance page.
            </p>
          </Section>

          {/* 9. Contact & Complaints */}
          <Section id="complaints" number="9" title="How to Contact Us / File Complaints">
            <div className="bg-gray-50 rounded-xl p-6 not-prose border border-gray-200 mb-4">
              <h4 className="font-display font-bold text-lg mb-3">PSH Industries — Privacy Team</h4>
              <div className="space-y-2 text-sm">
                <p>📧 <strong>COPPA Inquiries:</strong> <a href="mailto:coppa@pshindustries.com" className="text-rq-purple hover:underline">coppa@pshindustries.com</a></p>
                <p>📧 <strong>Privacy Team:</strong> <a href="mailto:privacy@pshindustries.com" className="text-rq-purple hover:underline">privacy@pshindustries.com</a></p>
                <p>🌐 <strong>Website:</strong> <a href="https://pshindustries.com" className="text-rq-purple hover:underline">pshindustries.com</a></p>
              </div>
              <p className="text-xs text-rq-muted mt-4">
                We respond to all COPPA-related inquiries within 5 business days.
              </p>
            </div>

            <h4 className="font-display font-semibold text-rq-purple">Filing a Complaint with the FTC</h4>
            <p>
              If you believe we have not adequately addressed your privacy concern, you have the right to file a complaint with the Federal Trade Commission (FTC):
            </p>
            <ul>
              <li><strong>Online:</strong> <a href="https://www.ftc.gov/complaint" target="_blank" rel="noopener noreferrer" className="text-rq-purple hover:underline">ftc.gov/complaint</a></li>
              <li><strong>Phone:</strong> 1-877-FTC-HELP (1-877-382-4357)</li>
              <li><strong>Mail:</strong> Federal Trade Commission, 600 Pennsylvania Avenue NW, Washington, DC 20580</li>
            </ul>
          </Section>

          {/* Related links */}
          <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-purple-100">
            <Link to="/privacy" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Privacy Policy →
            </Link>
            <Link to="/terms" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Terms of Service →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="font-display text-2xl font-bold text-rq-purple mb-4 mt-0 scroll-mt-20">
        {number}. {title}
      </h2>
      {children}
    </section>
  )
}

function ComplianceCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-purple-50 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          <p className="text-xs text-rq-muted">{description}</p>
        </div>
      </div>
    </div>
  )
}

function StepCard({ step, title, children }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-8 h-8 bg-gradient-to-br from-rq-purple to-rq-teal rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <div className="text-sm text-rq-muted">{children}</div>
      </div>
    </div>
  )
}

function DataRow({ data, collected, purpose }) {
  return (
    <tr>
      <td className="px-4 py-2.5 font-medium">{data}</td>
      <td className="px-4 py-2.5">{collected}</td>
      <td className="px-4 py-2.5 text-rq-muted">{purpose}</td>
    </tr>
  )
}
