import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <span className="text-4xl mb-4 block">🍪</span>
          <h1 className="font-display text-4xl font-bold mb-3">Cookie Policy</h1>
          <p className="text-rq-muted text-lg">How ReadQuest uses cookies and local storage</p>
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
              <li><a href="#what-are-cookies" className="text-rq-purple hover:underline">What Are Cookies?</a></li>
              <li><a href="#how-we-use" className="text-rq-purple hover:underline">How We Use Cookies</a></li>
              <li><a href="#essential" className="text-rq-purple hover:underline">Essential Cookies</a></li>
              <li><a href="#analytics" className="text-rq-purple hover:underline">Analytics Cookies</a></li>
              <li><a href="#local-storage" className="text-rq-purple hover:underline">Local Storage</a></li>
              <li><a href="#third-party" className="text-rq-purple hover:underline">Third-Party Cookies</a></li>
              <li><a href="#managing" className="text-rq-purple hover:underline">Managing Cookies</a></li>
              <li><a href="#children" className="text-rq-purple hover:underline">Cookies & Children</a></li>
              <li><a href="#changes" className="text-rq-purple hover:underline">Changes to This Policy</a></li>
              <li><a href="#contact" className="text-rq-purple hover:underline">Contact Us</a></li>
            </ol>
          </nav>

          {/* 1. What Are Cookies? */}
          <Section id="what-are-cookies" number="1" title="What Are Cookies?">
            <p>
              Cookies are small text files that are placed on your device (computer, tablet, or phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners. ReadQuest uses cookies and similar technologies (such as local storage) to ensure our platform works properly and to improve your experience.
            </p>
            <p>
              This Cookie Policy explains what cookies we use, why we use them, and how you can control them. This policy should be read alongside our <Link to="/privacy" className="text-rq-purple hover:underline font-semibold">Privacy Policy</Link>.
            </p>
          </Section>

          {/* 2. How We Use Cookies */}
          <Section id="how-we-use" number="2" title="How We Use Cookies">
            <p>ReadQuest uses cookies for the following purposes:</p>
            <ul>
              <li><strong>Authentication:</strong> To keep you securely logged in during your session</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences (e.g., reading timer state, theme preferences)</li>
              <li><strong>Security:</strong> To protect against unauthorized access and cross-site request forgery</li>
              <li><strong>Performance:</strong> To understand how our platform is used so we can improve it</li>
            </ul>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <h4 className="font-bold text-rq-purple mb-1">What We Don't Do</h4>
                  <p className="text-sm text-rq-muted">
                    ReadQuest <strong>never</strong> uses cookies for advertising, behavioral tracking, or building marketing profiles — especially for children under 13. We do not serve targeted ads.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* 3. Essential Cookies */}
          <Section id="essential" number="3" title="Essential Cookies">
            <p>
              These cookies are strictly necessary for ReadQuest to function. They cannot be switched off in our systems. They are usually only set in response to actions you take, such as logging in or filling in forms.
            </p>

            <div className="overflow-x-auto not-prose mb-4">
              <table className="w-full text-sm border border-purple-100 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Cookie / Storage Key</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-mono text-xs">sb-access-token</td>
                    <td className="px-4 py-3 text-rq-muted">Supabase authentication session token</td>
                    <td className="px-4 py-3 text-rq-muted">Session (1 hour)</td>
                  </tr>
                  <tr className="border-b border-purple-50 bg-purple-50/30">
                    <td className="px-4 py-3 font-mono text-xs">sb-refresh-token</td>
                    <td className="px-4 py-3 text-rq-muted">Supabase session refresh token</td>
                    <td className="px-4 py-3 text-rq-muted">7 days</td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-mono text-xs">sb-auth-token</td>
                    <td className="px-4 py-3 text-rq-muted">Authentication state persistence</td>
                    <td className="px-4 py-3 text-rq-muted">Session</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="px-4 py-3 font-mono text-xs">csrf-token</td>
                    <td className="px-4 py-3 text-rq-muted">Cross-site request forgery protection</td>
                    <td className="px-4 py-3 text-rq-muted">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* 4. Analytics Cookies */}
          <Section id="analytics" number="4" title="Analytics Cookies">
            <p>
              These cookies help us understand how visitors interact with ReadQuest by collecting information anonymously. We use privacy-respecting analytics only.
            </p>

            <div className="overflow-x-auto not-prose mb-4">
              <table className="w-full text-sm border border-purple-100 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Cookie / Storage Key</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-mono text-xs">_rq_session</td>
                    <td className="px-4 py-3 text-rq-muted">Anonymous session ID for usage analytics (no PII)</td>
                    <td className="px-4 py-3 text-rq-muted">30 minutes</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="px-4 py-3 font-mono text-xs">_rq_consent</td>
                    <td className="px-4 py-3 text-rq-muted">Records your cookie consent preferences</td>
                    <td className="px-4 py-3 text-rq-muted">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-teal-50 rounded-xl p-5 border border-teal-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h4 className="font-bold text-rq-teal mb-1">COPPA-Safe Analytics</h4>
                  <p className="text-sm text-rq-muted">
                    For accounts identified as belonging to children under 13, analytics cookies are <strong>disabled by default</strong> and do not collect any data unless a school administrator explicitly opts in. We use privacy-first analytics (such as Plausible or PostHog in cookieless mode) that do not track individual users.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* 5. Local Storage */}
          <Section id="local-storage" number="5" title="Local Storage">
            <p>
              In addition to cookies, ReadQuest uses your browser's local storage to save certain information locally on your device. Local storage works similarly to cookies but can store more data and is not sent to the server with every request.
            </p>

            <div className="overflow-x-auto not-prose mb-4">
              <table className="w-full text-sm border border-purple-100 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Key</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Contains PII?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-mono text-xs">rq-timer-state</td>
                    <td className="px-4 py-3 text-rq-muted">Saves reading timer progress if browser is closed mid-session</td>
                    <td className="px-4 py-3 text-rq-muted">No</td>
                  </tr>
                  <tr className="border-b border-purple-50 bg-purple-50/30">
                    <td className="px-4 py-3 font-mono text-xs">rq-theme</td>
                    <td className="px-4 py-3 text-rq-muted">Stores light/dark theme preference</td>
                    <td className="px-4 py-3 text-rq-muted">No</td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-mono text-xs">rq-book-cache</td>
                    <td className="px-4 py-3 text-rq-muted">Caches recently viewed book metadata for faster loading</td>
                    <td className="px-4 py-3 text-rq-muted">No</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="px-4 py-3 font-mono text-xs">rq-onboarding</td>
                    <td className="px-4 py-3 text-rq-muted">Tracks onboarding flow completion state</td>
                    <td className="px-4 py-3 text-rq-muted">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              None of our local storage items contain personally identifiable information. All local storage can be cleared through your browser settings.
            </p>
          </Section>

          {/* 6. Third-Party Cookies */}
          <Section id="third-party" number="6" title="Third-Party Cookies">
            <p>
              ReadQuest minimizes the use of third-party services that set cookies. The following third parties may set cookies when you use our platform:
            </p>

            <div className="overflow-x-auto not-prose mb-4">
              <table className="w-full text-sm border border-purple-100 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Provider</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-medium">Supabase</td>
                    <td className="px-4 py-3 text-rq-muted">Authentication and database (essential)</td>
                    <td className="px-4 py-3"><a href="https://supabase.com/privacy" className="text-rq-purple hover:underline text-xs">supabase.com/privacy</a></td>
                  </tr>
                  <tr className="border-b border-purple-50 bg-purple-50/30">
                    <td className="px-4 py-3 font-medium">Google</td>
                    <td className="px-4 py-3 text-rq-muted">Google SSO login (only when user clicks "Sign in with Google")</td>
                    <td className="px-4 py-3"><a href="https://policies.google.com/privacy" className="text-rq-purple hover:underline text-xs">policies.google.com/privacy</a></td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="px-4 py-3 font-medium">Open Library</td>
                    <td className="px-4 py-3 text-rq-muted">Book cover images and metadata (no cookies set)</td>
                    <td className="px-4 py-3"><a href="https://openlibrary.org/privacy" className="text-rq-purple hover:underline text-xs">openlibrary.org/privacy</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              We do <strong>not</strong> use any advertising networks, social media tracking pixels, or marketing automation platforms that set third-party cookies.
            </p>
          </Section>

          {/* 7. Managing Cookies */}
          <Section id="managing" number="7" title="Managing Cookies">
            <p>
              You can control and manage cookies in several ways. Please note that removing or blocking cookies may impact your experience on ReadQuest.
            </p>

            <h4 className="font-display font-semibold text-rq-purple">7.1 Browser Settings</h4>
            <p>
              Most web browsers allow you to control cookies through their settings. You can typically find these in the "Options," "Settings," or "Preferences" menu of your browser. Links to instructions for common browsers:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-rq-purple hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-rq-purple hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-us/HT201265" className="text-rq-purple hover:underline">Safari (iOS)</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471" className="text-rq-purple hover:underline">Safari (macOS)</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-rq-purple hover:underline">Microsoft Edge</a></li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">7.2 Impact of Disabling Cookies</h4>
            <p>
              If you disable essential cookies, you may not be able to:
            </p>
            <ul>
              <li>Stay logged in to your ReadQuest account</li>
              <li>Maintain your reading timer state across page navigations</li>
              <li>Access features that require authentication</li>
            </ul>
            <p>
              Disabling analytics cookies will not affect your ability to use ReadQuest. The platform will function normally without them.
            </p>

            <h4 className="font-display font-semibold text-rq-purple">7.3 Clearing Local Storage</h4>
            <p>
              To clear local storage data, you can use your browser's developer tools (usually accessible via F12) or clear all browsing data through your browser's settings. This will reset your preferences and cached data.
            </p>
          </Section>

          {/* 8. Cookies & Children */}
          <Section id="children" number="8" title="Cookies & Children">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="font-bold text-rq-purple mb-1">Special Protections for Young Users</h4>
                  <p className="text-sm text-rq-muted">
                    In compliance with COPPA, ReadQuest takes extra precautions with cookies for users under 13.
                  </p>
                </div>
              </div>
            </div>
            <ul>
              <li><strong>No behavioral tracking:</strong> We do not use cookies to build behavioral profiles of children</li>
              <li><strong>Essential only by default:</strong> Only strictly necessary cookies are set for child accounts</li>
              <li><strong>No third-party analytics:</strong> Analytics cookies are disabled for child accounts unless the school explicitly opts in</li>
              <li><strong>No advertising cookies:</strong> We never set advertising or marketing cookies for any user, especially children</li>
              <li><strong>Minimal data:</strong> Authentication cookies contain only session identifiers — no personal information</li>
            </ul>
          </Section>

          {/* 9. Changes */}
          <Section id="changes" number="9" title="Changes to This Policy">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, our practices, or legal requirements. If we make significant changes, we will update the "Last Updated" date at the top of this page and, where appropriate, notify you through the platform.
            </p>
            <p>
              We encourage you to review this policy periodically to stay informed about how we use cookies.
            </p>
          </Section>

          {/* 10. Contact */}
          <Section id="contact" number="10" title="Contact Us">
            <div className="bg-gray-50 rounded-xl p-6 not-prose border border-gray-200">
              <h4 className="font-display font-bold text-lg mb-3">PSH Industries</h4>
              <div className="space-y-2 text-sm">
                <p>📧 <strong>Privacy Office:</strong> <a href="mailto:privacy@pshindustries.com" className="text-rq-purple hover:underline">privacy@pshindustries.com</a></p>
                <p>🌐 <strong>Website:</strong> <a href="https://pshindustries.com" className="text-rq-purple hover:underline">pshindustries.com</a></p>
              </div>
              <p className="text-xs text-rq-muted mt-4">
                If you have any questions about our use of cookies or this Cookie Policy, please don't hesitate to contact us.
              </p>
            </div>
          </Section>

          {/* Related links */}
          <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-purple-100">
            <Link to="/privacy" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Privacy Policy →
            </Link>
            <Link to="/terms" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Terms of Service →
            </Link>
            <Link to="/coppa" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              COPPA Compliance →
            </Link>
            <Link to="/ferpa" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              FERPA Compliance →
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
