import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <span className="text-4xl mb-4 block">📜</span>
          <h1 className="font-display text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-rq-muted text-lg">The rules of the road for using ReadQuest</p>
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
              <li><a href="#service-description" className="text-rq-purple hover:underline">Service Description</a></li>
              <li><a href="#accounts" className="text-rq-purple hover:underline">User Accounts</a></li>
              <li><a href="#acceptable-use" className="text-rq-purple hover:underline">Acceptable Use</a></li>
              <li><a href="#content" className="text-rq-purple hover:underline">User Content & Moderation</a></li>
              <li><a href="#ip" className="text-rq-purple hover:underline">Intellectual Property</a></li>
              <li><a href="#subscriptions" className="text-rq-purple hover:underline">Subscriptions & Payment</a></li>
              <li><a href="#liability" className="text-rq-purple hover:underline">Limitation of Liability</a></li>
              <li><a href="#disclaimers" className="text-rq-purple hover:underline">Disclaimers</a></li>
              <li><a href="#termination" className="text-rq-purple hover:underline">Termination</a></li>
              <li><a href="#changes" className="text-rq-purple hover:underline">Changes to Terms</a></li>
              <li><a href="#governing-law" className="text-rq-purple hover:underline">Governing Law</a></li>
              <li><a href="#contact" className="text-rq-purple hover:underline">Contact Us</a></li>
            </ol>
          </nav>

          {/* 1. Service Description */}
          <Section id="service-description" number="1" title="Service Description">
            <p>
              ReadQuest is an AI-powered children's reading platform operated by <strong>PSH Industries</strong> ("we," "us," or "our"). Our Service provides tools for students (K–8) to track reading progress, discover books, write reviews, earn achievements, and participate in age-appropriate social features — all within a safe, school-connected environment.
            </p>
            <p>
              The Service includes web and mobile applications, teacher dashboards, parent dashboards, and related features. By accessing or using ReadQuest, you agree to be bound by these Terms of Service ("Terms").
            </p>
          </Section>

          {/* 2. User Accounts */}
          <Section id="accounts" number="2" title="User Accounts">
            <h4 className="font-display font-semibold text-rq-purple">2.1 Account Types</h4>
            <ul>
              <li><strong>Student accounts</strong> are created by teachers or school administrators. Students under 13 require parental consent per COPPA.</li>
              <li><strong>Teacher accounts</strong> are created by educators with a valid school email address.</li>
              <li><strong>Parent accounts</strong> are created by parents or guardians and linked to their children's student accounts.</li>
              <li><strong>School/District accounts</strong> are created by authorized administrators.</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">2.2 Account Responsibilities</h4>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>Teachers are responsible for the student accounts they create and must ensure parental consent is obtained.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">2.3 Age Requirements</h4>
            <p>
              ReadQuest is designed for students in grades K–8 (approximately ages 5–14). Children under 13 may only use the Service with verifiable parental consent. Teachers and parents must be at least 18 years of age.
            </p>
          </Section>

          {/* 3. Acceptable Use */}
          <Section id="acceptable-use" number="3" title="Acceptable Use">
            <p>You agree NOT to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose or in violation of these Terms</li>
              <li>Post content that is offensive, harmful, threatening, abusive, or inappropriate for a children's platform</li>
              <li>Attempt to access other users' accounts or data without authorization</li>
              <li>Circumvent, disable, or interfere with security features of the Service</li>
              <li>Use automated tools (bots, scrapers) to access the Service without permission</li>
              <li>Falsify reading data or game the gamification system (e.g., logging fake reading sessions)</li>
              <li>Share login credentials with unauthorized individuals</li>
              <li>Bully, harass, or intimidate other users</li>
              <li>Upload or transmit viruses, malware, or other malicious code</li>
            </ul>
            <p>
              Violation of these rules may result in account suspension or termination.
            </p>
          </Section>

          {/* 4. User Content & Moderation */}
          <Section id="content" number="4" title="User Content & Moderation">
            <h4 className="font-display font-semibold text-rq-purple">4.1 User-Generated Content</h4>
            <p>
              Users may create content including book reviews, ratings, and social feed posts ("User Content"). You retain ownership of your User Content, but by posting it on ReadQuest, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content within the Service.
            </p>

            <h4 className="font-display font-semibold text-rq-purple">4.2 Content Moderation</h4>
            <p>
              We employ a combination of AI-based and human moderation to ensure all content is appropriate for a children's platform. We reserve the right to:
            </p>
            <ul>
              <li>Remove content that violates our community guidelines</li>
              <li>Flag content for teacher or parent review</li>
              <li>Suspend or restrict users who repeatedly post inappropriate content</li>
              <li>Modify content visibility settings (e.g., restrict to class-only view)</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">4.3 Reporting</h4>
            <p>
              Users can report inappropriate content or behavior. We investigate all reports and take appropriate action within 48 hours.
            </p>
          </Section>

          {/* 5. Intellectual Property */}
          <Section id="ip" number="5" title="Intellectual Property">
            <p>
              The ReadQuest platform, including its design, features, content, badges, characters, and branding, is the property of PSH Industries and is protected by intellectual property laws.
            </p>
            <ul>
              <li>You may not copy, modify, distribute, or reverse-engineer any part of the Service.</li>
              <li>The ReadQuest name, logo, and related marks are trademarks of PSH Industries.</li>
              <li>Book covers, metadata, and descriptions are provided by third-party sources (including Open Library) and are subject to their respective licenses.</li>
              <li>User-generated content (reviews, ratings) remains the property of the user, subject to the license granted above.</li>
            </ul>
          </Section>

          {/* 6. Subscriptions & Payment */}
          <Section id="subscriptions" number="6" title="Subscriptions & Payment">
            <p>
              ReadQuest offers both free and paid subscription tiers. By subscribing to a paid plan:
            </p>
            <ul>
              <li>You agree to pay all applicable fees as described on our <Link to="/pricing" className="text-rq-purple hover:underline font-semibold">Pricing page</Link>.</li>
              <li>Subscriptions automatically renew unless canceled before the renewal date.</li>
              <li>School and district subscriptions are governed by separate agreements.</li>
              <li>We offer a 30-day money-back guarantee for individual subscriptions.</li>
              <li>We reserve the right to modify pricing with 30 days' advance notice.</li>
            </ul>
          </Section>

          {/* 7. Limitation of Liability */}
          <Section id="liability" number="7" title="Limitation of Liability">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 not-prose mb-4">
              <p className="text-sm text-rq-muted">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PSH INDUSTRIES AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, REGARDLESS OF THE CAUSE OF ACTION OR THE THEORY OF LIABILITY.
              </p>
            </div>
            <p>
              Our total aggregate liability for any claims arising from or relating to the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability shall be limited to the fullest extent permitted by law.
            </p>
          </Section>

          {/* 8. Disclaimers */}
          <Section id="disclaimers" number="8" title="Disclaimers">
            <ul>
              <li>ReadQuest is provided "as is" and "as available" without warranties of any kind.</li>
              <li>We do not guarantee that the Service will be uninterrupted, error-free, or secure at all times.</li>
              <li>Reading level assessments and AI recommendations are for informational purposes and do not replace professional educational guidance.</li>
              <li>Book information and metadata are sourced from third parties and may contain inaccuracies.</li>
              <li>We are not responsible for content in books recommended or tracked through our platform.</li>
            </ul>
          </Section>

          {/* 9. Termination */}
          <Section id="termination" number="9" title="Termination">
            <h4 className="font-display font-semibold text-rq-purple">9.1 By You</h4>
            <p>
              You may terminate your account at any time through the account settings or by contacting us. Upon termination, your data will be handled according to our <Link to="/privacy" className="text-rq-purple hover:underline font-semibold">Privacy Policy</Link>.
            </p>

            <h4 className="font-display font-semibold text-rq-purple">9.2 By Us</h4>
            <p>
              We may suspend or terminate your account if:
            </p>
            <ul>
              <li>You violate these Terms or our community guidelines</li>
              <li>Your account is used for unauthorized or illegal activity</li>
              <li>We are required to do so by law</li>
              <li>We discontinue the Service (with reasonable advance notice)</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">9.3 Effect of Termination</h4>
            <p>
              Upon termination, your right to access the Service ceases immediately. We will retain and delete your data in accordance with our Privacy Policy and applicable data retention laws. Sections related to intellectual property, limitation of liability, and governing law survive termination.
            </p>
          </Section>

          {/* 10. Changes */}
          <Section id="changes" number="10" title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. Material changes will be communicated via email and in-app notification at least 30 days before taking effect. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </Section>

          {/* 11. Governing Law */}
          <Section id="governing-law" number="11" title="Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the state or federal courts located in Delaware.
            </p>
          </Section>

          {/* 12. Contact */}
          <Section id="contact" number="12" title="Contact Us">
            <div className="bg-gray-50 rounded-xl p-6 not-prose border border-gray-200">
              <h4 className="font-display font-bold text-lg mb-3">PSH Industries</h4>
              <div className="space-y-2 text-sm">
                <p>📧 <strong>General:</strong> <a href="mailto:legal@pshindustries.com" className="text-rq-purple hover:underline">legal@pshindustries.com</a></p>
                <p>📧 <strong>Privacy:</strong> <a href="mailto:privacy@pshindustries.com" className="text-rq-purple hover:underline">privacy@pshindustries.com</a></p>
                <p>🌐 <strong>Website:</strong> <a href="https://pshindustries.com" className="text-rq-purple hover:underline">pshindustries.com</a></p>
              </div>
            </div>
          </Section>

          {/* Related links */}
          <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-purple-100">
            <Link to="/privacy" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Privacy Policy →
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
