import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h1 className="font-display text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-rq-muted text-lg">How ReadQuest protects your family's data</p>
          <p className="text-sm text-rq-muted mt-2">Last updated: February 1, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-purple max-w-none">

          {/* Table of Contents */}
          <nav className="bg-purple-50/50 rounded-2xl p-6 mb-10 border border-purple-100">
            <h2 className="font-display text-lg font-bold text-rq-purple mb-3 mt-0">Table of Contents</h2>
            <ol className="columns-2 gap-8 text-sm space-y-1 list-decimal pl-5">
              <li><a href="#introduction" className="text-rq-purple hover:underline">Introduction</a></li>
              <li><a href="#coppa" className="text-rq-purple hover:underline">COPPA Compliance</a></li>
              <li><a href="#data-collection" className="text-rq-purple hover:underline">Data We Collect</a></li>
              <li><a href="#data-use" className="text-rq-purple hover:underline">How We Use Your Data</a></li>
              <li><a href="#data-sharing" className="text-rq-purple hover:underline">Who We Share Data With</a></li>
              <li><a href="#parental-rights" className="text-rq-purple hover:underline">Parental Rights</a></li>
              <li><a href="#data-retention" className="text-rq-purple hover:underline">Data Retention</a></li>
              <li><a href="#security" className="text-rq-purple hover:underline">Data Security</a></li>
              <li><a href="#changes" className="text-rq-purple hover:underline">Changes to This Policy</a></li>
              <li><a href="#contact" className="text-rq-purple hover:underline">Contact Us</a></li>
            </ol>
          </nav>

          {/* 1. Introduction */}
          <Section id="introduction" number="1" title="Introduction">
            <p>
              ReadQuest ("we," "us," or "our") is a product of <strong>PSH Industries</strong>. We are committed to protecting the privacy of all our users, especially children under the age of 13. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the ReadQuest platform, including our website, mobile applications, and related services (collectively, the "Service").
            </p>
            <p>
              By using ReadQuest, you agree to the collection and use of information in accordance with this policy. If you are a parent or guardian, we encourage you to read this policy carefully and help us protect your child's information.
            </p>
          </Section>

          {/* 2. COPPA */}
          <Section id="coppa" number="2" title="COPPA Compliance (Children Under 13)">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="font-bold text-rq-purple mb-1">Special Protections for Children</h4>
                  <p className="text-sm text-rq-muted">
                    ReadQuest complies with the Children's Online Privacy Protection Act (COPPA). We take additional steps to protect the privacy of children under 13.
                  </p>
                </div>
              </div>
            </div>
            <p>For users under 13, we:</p>
            <ul>
              <li><strong>Require verifiable parental consent</strong> before collecting any personal information from children.</li>
              <li><strong>Limit data collection</strong> to only what is reasonably necessary for the child to participate in ReadQuest activities.</li>
              <li><strong>Do not condition participation</strong> on the disclosure of more personal information than is needed.</li>
              <li><strong>Do not serve behavioral advertising</strong> to children under 13.</li>
              <li><strong>Allow parents to review, delete, and manage</strong> their child's data at any time.</li>
              <li><strong>Provide direct notice</strong> to parents and guardians about our information practices.</li>
            </ul>
            <p>
              Student accounts are created by teachers or school administrators. Parents receive a consent notification and must provide verifiable consent before their child can use social or interactive features. See our <Link to="/coppa" className="text-rq-purple hover:underline font-semibold">COPPA Compliance page</Link> for full details.
            </p>
          </Section>

          {/* 3. Data Collection */}
          <Section id="data-collection" number="3" title="Data We Collect">
            <h4 className="font-display font-semibold text-rq-purple">3.1 Information Provided by Schools and Parents</h4>
            <ul>
              <li>Student name (first name and last initial only)</li>
              <li>Grade level and school</li>
              <li>Parent/guardian email address (for consent and communication)</li>
              <li>Teacher-assigned class membership</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">3.2 Information Created Through Use</h4>
            <ul>
              <li>Reading logs (books, minutes, pages)</li>
              <li>Book reviews and ratings</li>
              <li>Virtual bookshelf contents</li>
              <li>Achievement badges and XP points</li>
              <li>Social interactions (reactions, friend connections — within school boundaries only)</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">3.3 Automatically Collected Information</h4>
            <ul>
              <li>Device type and browser information</li>
              <li>Usage analytics (pages visited, features used, session duration)</li>
              <li>IP address (anonymized for children under 13)</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">3.4 Information We Do NOT Collect from Children</h4>
            <ul>
              <li>Full name, home address, or phone number</li>
              <li>Photos, videos, or audio recordings</li>
              <li>Geolocation data</li>
              <li>Social media accounts</li>
              <li>Any information not necessary for the reading experience</li>
            </ul>
          </Section>

          {/* 4. Data Use */}
          <Section id="data-use" number="4" title="How We Use Your Data">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve the ReadQuest reading platform</li>
              <li>Track reading progress and generate educational reports for teachers and parents</li>
              <li>Power the gamification system (XP, badges, streaks, challenges)</li>
              <li>Enable age-appropriate social features within school boundaries</li>
              <li>Send notifications about reading goals, achievements, and account activity</li>
              <li>Provide AI-powered book recommendations based on reading history</li>
              <li>Generate aggregate, de-identified analytics to improve our service</li>
              <li>Ensure platform safety and enforce our Terms of Service</li>
            </ul>
            <p>
              We <strong>never</strong> use children's data for advertising purposes. We <strong>never</strong> sell personal information.
            </p>
          </Section>

          {/* 5. Data Sharing */}
          <Section id="data-sharing" number="5" title="Who We Share Data With">
            <p>We share personal information only in the following limited circumstances:</p>
            <ul>
              <li><strong>Teachers and Schools:</strong> Teachers see their students' reading activity, progress, and achievements within their assigned classes.</li>
              <li><strong>Parents/Guardians:</strong> Parents can access their child's complete reading data, activity, and settings.</li>
              <li><strong>Service Providers:</strong> We use carefully selected third-party services (hosting, analytics, email) that process data on our behalf under strict data processing agreements.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law, regulation, or legal process.</li>
            </ul>
            <p>We <strong>never</strong> sell, rent, or trade personal information to third parties for marketing purposes.</p>
          </Section>

          {/* 6. Parental Rights */}
          <Section id="parental-rights" number="6" title="Parental Rights">
            <div className="bg-teal-50 rounded-xl p-5 border border-teal-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👨‍👩‍👧</span>
                <div>
                  <h4 className="font-bold text-rq-teal mb-1">Your Rights as a Parent</h4>
                  <p className="text-sm text-rq-muted">
                    You have full control over your child's data on ReadQuest.
                  </p>
                </div>
              </div>
            </div>
            <p>As a parent or legal guardian, you have the right to:</p>
            <ul>
              <li><strong>Review</strong> all personal information collected about your child through the Parent Dashboard</li>
              <li><strong>Request deletion</strong> of your child's account and all associated data</li>
              <li><strong>Opt out</strong> of specific features (social interactions, push notifications, review visibility)</li>
              <li><strong>Withdraw consent</strong> at any time — we will delete your child's personal information within 30 days</li>
              <li><strong>Receive direct notice</strong> of any material changes to our privacy practices</li>
              <li><strong>Port data</strong> — request an export of your child's reading data in a standard format</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:privacy@pshindustries.com" className="text-rq-purple hover:underline font-semibold">privacy@pshindustries.com</a> or use the controls in your Parent Dashboard.
            </p>
          </Section>

          {/* 7. Data Retention */}
          <Section id="data-retention" number="7" title="Data Retention">
            <ul>
              <li><strong>Active accounts:</strong> Data is retained for the duration of the account's active use.</li>
              <li><strong>Inactive accounts:</strong> Student accounts inactive for more than 24 months are flagged for deletion. Parents and schools are notified 30 days before deletion.</li>
              <li><strong>Deleted accounts:</strong> All personal data is permanently deleted within 30 days of account deletion. Anonymized, aggregate data may be retained for research and improvement purposes.</li>
              <li><strong>Reading logs and reviews:</strong> Retained with the account. Upon deletion, all reading data is permanently removed.</li>
              <li><strong>Backups:</strong> Encrypted backups are purged within 90 days of account deletion.</li>
            </ul>
          </Section>

          {/* 8. Security */}
          <Section id="security" number="8" title="Data Security">
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul>
              <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>Row-level security policies enforce strict data isolation between users, classes, and schools</li>
              <li>Regular security audits and penetration testing</li>
              <li>Multi-factor authentication available for teacher and parent accounts</li>
              <li>Automated monitoring for suspicious activity</li>
              <li>Employee access is limited on a need-to-know basis and subject to background checks</li>
            </ul>
          </Section>

          {/* 9. Changes */}
          <Section id="changes" number="9" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. If we make material changes that affect children's data practices, we will provide at least 30 days' advance notice to parents via email and in-app notification. We will obtain new parental consent if required.
            </p>
            <p>
              Non-material changes (e.g., formatting, clarifications) may be made without prior notice. The "Last Updated" date at the top of this page indicates when the policy was last revised.
            </p>
          </Section>

          {/* 10. Contact */}
          <Section id="contact" number="10" title="Contact Us">
            <div className="bg-gray-50 rounded-xl p-6 not-prose border border-gray-200">
              <h4 className="font-display font-bold text-lg mb-3">PSH Industries</h4>
              <div className="space-y-2 text-sm">
                <p>📧 <strong>Email:</strong> <a href="mailto:privacy@pshindustries.com" className="text-rq-purple hover:underline">privacy@pshindustries.com</a></p>
                <p>📧 <strong>COPPA Inquiries:</strong> <a href="mailto:coppa@pshindustries.com" className="text-rq-purple hover:underline">coppa@pshindustries.com</a></p>
                <p>🌐 <strong>Website:</strong> <a href="https://pshindustries.com" className="text-rq-purple hover:underline">pshindustries.com</a></p>
              </div>
              <p className="text-xs text-rq-muted mt-4">
                If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us. We are committed to resolving any concerns promptly.
              </p>
            </div>
          </Section>

          {/* Related links */}
          <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-purple-100">
            <Link to="/terms" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Terms of Service →
            </Link>
            <Link to="/coppa" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              COPPA Compliance →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

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
