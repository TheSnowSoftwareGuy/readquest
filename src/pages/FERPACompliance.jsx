import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function FERPACompliance() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <span className="text-4xl mb-4 block">🛡️</span>
          <h1 className="font-display text-4xl font-bold mb-3">FERPA Compliance</h1>
          <p className="text-rq-muted text-lg">How ReadQuest protects student education records</p>
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
              <li><a href="#overview" className="text-rq-purple hover:underline">Overview</a></li>
              <li><a href="#what-is-ferpa" className="text-rq-purple hover:underline">What Is FERPA?</a></li>
              <li><a href="#school-official" className="text-rq-purple hover:underline">School Official Exception</a></li>
              <li><a href="#psh-operator" className="text-rq-purple hover:underline">PSH Industries as Operator</a></li>
              <li><a href="#directory-info" className="text-rq-purple hover:underline">Directory Information</a></li>
              <li><a href="#data-security" className="text-rq-purple hover:underline">Data Security Measures</a></li>
              <li><a href="#parent-rights" className="text-rq-purple hover:underline">Parent & Student Rights</a></li>
              <li><a href="#annual-notification" className="text-rq-purple hover:underline">Annual Notification</a></li>
              <li><a href="#data-governance" className="text-rq-purple hover:underline">Data Governance</a></li>
              <li><a href="#contact" className="text-rq-purple hover:underline">Contact Us</a></li>
            </ol>
          </nav>

          {/* 1. Overview */}
          <Section id="overview" number="1" title="Overview">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏫</span>
                <div>
                  <h4 className="font-bold text-rq-purple mb-1">Committed to Student Privacy</h4>
                  <p className="text-sm text-rq-muted">
                    ReadQuest, a product of PSH Industries, is fully committed to compliance with the Family Educational Rights and Privacy Act (FERPA). We recognize the critical importance of protecting student education records and maintaining the trust of schools, teachers, parents, and students.
                  </p>
                </div>
              </div>
            </div>
            <p>
              This page outlines how ReadQuest complies with FERPA requirements when processing student education records on behalf of schools and school districts. We operate under strict agreements with educational institutions and maintain robust safeguards to protect student data.
            </p>
          </Section>

          {/* 2. What Is FERPA? */}
          <Section id="what-is-ferpa" number="2" title="What Is FERPA?">
            <p>
              The <strong>Family Educational Rights and Privacy Act (FERPA)</strong> (20 U.S.C. § 1232g; 34 CFR Part 99) is a federal law that protects the privacy of student education records. FERPA applies to all educational agencies and institutions that receive funding under any program administered by the U.S. Department of Education.
            </p>
            <p>FERPA provides parents (and eligible students over 18) with the right to:</p>
            <ul>
              <li><strong>Inspect and review</strong> their child's education records</li>
              <li><strong>Request corrections</strong> to records they believe are inaccurate or misleading</li>
              <li><strong>Consent to disclosure</strong> of personally identifiable information (PII) from education records, with certain exceptions</li>
              <li><strong>File complaints</strong> with the U.S. Department of Education concerning alleged FERPA violations</li>
            </ul>
          </Section>

          {/* 3. School Official Exception */}
          <Section id="school-official" number="3" title="School Official Exception">
            <div className="bg-teal-50 rounded-xl p-5 border border-teal-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <h4 className="font-bold text-rq-teal mb-1">How ReadQuest Accesses Education Records</h4>
                  <p className="text-sm text-rq-muted">
                    ReadQuest operates under the "school official" exception to FERPA's consent requirements (34 CFR § 99.31(a)(1)).
                  </p>
                </div>
              </div>
            </div>
            <p>
              Under FERPA, schools may disclose education records without parental consent to "school officials" with "legitimate educational interests." This includes contractors, consultants, and other parties to whom the school has outsourced institutional services or functions, provided certain conditions are met.
            </p>
            <p>ReadQuest qualifies under this exception because:</p>
            <ul>
              <li><strong>Contractual relationship:</strong> We enter into Data Processing Agreements (DPAs) with each school or district that specify our role, responsibilities, and limitations.</li>
              <li><strong>Legitimate educational interest:</strong> ReadQuest is used to promote literacy, track reading progress, and support student achievement — all core educational functions.</li>
              <li><strong>Direct control:</strong> Schools maintain direct control over our use of education records through their administrative dashboards and agreement terms.</li>
              <li><strong>Use limitation:</strong> We use education records solely for the purposes specified in our agreements with schools — never for advertising, marketing, or any non-educational purpose.</li>
              <li><strong>Annual notification:</strong> We support schools in their obligation to notify parents annually of their FERPA rights and the criteria for designating school officials.</li>
            </ul>
          </Section>

          {/* 4. PSH Industries as Operator */}
          <Section id="psh-operator" number="4" title="PSH Industries as Operator">
            <p>
              <strong>PSH Industries</strong> operates ReadQuest as a service provider to educational institutions. Our role and responsibilities include:
            </p>

            <div className="overflow-x-auto not-prose mb-4">
              <table className="w-full text-sm border border-purple-100 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Responsibility</th>
                    <th className="text-left px-4 py-3 font-semibold text-rq-purple border-b border-purple-100">Our Commitment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-medium">Data processing</td>
                    <td className="px-4 py-3 text-rq-muted">Process student data only as directed by the school for educational purposes</td>
                  </tr>
                  <tr className="border-b border-purple-50 bg-purple-50/30">
                    <td className="px-4 py-3 font-medium">Data ownership</td>
                    <td className="px-4 py-3 text-rq-muted">Schools retain full ownership of all student education records; we never claim ownership</td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-medium">Re-disclosure</td>
                    <td className="px-4 py-3 text-rq-muted">We do not re-disclose student PII to third parties without school authorization</td>
                  </tr>
                  <tr className="border-b border-purple-50 bg-purple-50/30">
                    <td className="px-4 py-3 font-medium">Data return/deletion</td>
                    <td className="px-4 py-3 text-rq-muted">Upon contract termination, we return or securely delete all student records within 60 days</td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="px-4 py-3 font-medium">Marketing</td>
                    <td className="px-4 py-3 text-rq-muted">We never use student data for advertising or marketing purposes</td>
                  </tr>
                  <tr className="bg-purple-50/30">
                    <td className="px-4 py-3 font-medium">Subcontractors</td>
                    <td className="px-4 py-3 text-rq-muted">Any subprocessors are bound by equivalent data protection obligations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* 5. Directory Information */}
          <Section id="directory-info" number="5" title="Directory Information Handling">
            <p>
              FERPA allows schools to designate certain student information as "directory information" — information that is generally not considered harmful or an invasion of privacy if disclosed. However, ReadQuest takes a conservative approach:
            </p>
            <ul>
              <li><strong>Minimal display names:</strong> Students are identified by first name and last initial only (e.g., "Jayden M.") — never full names.</li>
              <li><strong>No public profiles:</strong> Student information is never publicly accessible; all data is confined to school-authorized boundaries.</li>
              <li><strong>Social features are bounded:</strong> Students can only interact with classmates and schoolmates as defined by their school's configuration.</li>
              <li><strong>Teacher control:</strong> Teachers can further restrict which information is visible in social features, leaderboards, and class activities.</li>
              <li><strong>Opt-out support:</strong> We support schools in honoring parents' requests to opt out of directory information disclosures.</li>
            </ul>
            <p>
              ReadQuest does <strong>not</strong> treat any student data as directory information for our own purposes. All student data is treated as protected education records.
            </p>
          </Section>

          {/* 6. Data Security */}
          <Section id="data-security" number="6" title="Data Security Measures">
            <p>
              FERPA requires schools and their service providers to use "reasonable methods" to ensure that school officials access only the education records in which they have legitimate educational interests. ReadQuest implements comprehensive security measures:
            </p>

            <h4 className="font-display font-semibold text-rq-purple">6.1 Technical Safeguards</h4>
            <ul>
              <li><strong>Encryption:</strong> All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong>Row-Level Security:</strong> 50+ database policies enforce strict data isolation between students, classes, schools, and districts</li>
              <li><strong>Role-based access control:</strong> Students, teachers, parents, and administrators each have precisely defined access permissions</li>
              <li><strong>Audit logging:</strong> All access to student records is logged with user identity, timestamp, and action performed</li>
              <li><strong>Multi-factor authentication:</strong> Available for all teacher and administrator accounts</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">6.2 Organizational Safeguards</h4>
            <ul>
              <li><strong>Employee training:</strong> All PSH Industries employees receive FERPA awareness training annually</li>
              <li><strong>Background checks:</strong> Employees with access to student data undergo background checks</li>
              <li><strong>Need-to-know access:</strong> Internal access to student data is limited to employees who require it for their role</li>
              <li><strong>Incident response:</strong> We maintain a documented data breach response plan with notification procedures that comply with state breach notification laws</li>
              <li><strong>Regular audits:</strong> Annual security audits and penetration testing by independent third parties</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">6.3 Data Breach Notification</h4>
            <p>
              In the event of a data breach involving student education records, PSH Industries will:
            </p>
            <ul>
              <li>Notify the affected school or district within <strong>72 hours</strong> of discovery</li>
              <li>Provide a detailed incident report including the nature of the breach, records affected, and remediation steps</li>
              <li>Cooperate fully with the school's notification obligations to parents and regulatory authorities</li>
              <li>Implement corrective measures to prevent recurrence</li>
            </ul>
          </Section>

          {/* 7. Parent & Student Rights */}
          <Section id="parent-rights" number="7" title="Parent & Student Rights">
            <div className="bg-teal-50 rounded-xl p-5 border border-teal-200 not-prose mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👨‍👩‍👧</span>
                <div>
                  <h4 className="font-bold text-rq-teal mb-1">Your Rights Under FERPA</h4>
                  <p className="text-sm text-rq-muted">
                    FERPA grants parents important rights regarding their child's education records. ReadQuest supports schools in honoring these rights.
                  </p>
                </div>
              </div>
            </div>
            <p>Parents and eligible students (18 and older) have the right to:</p>
            <ul>
              <li><strong>Access records:</strong> Review all reading data, activity logs, and information maintained by ReadQuest through the Parent Dashboard or by contacting the school.</li>
              <li><strong>Request amendments:</strong> If you believe information in your child's ReadQuest records is inaccurate, contact the school to request a correction.</li>
              <li><strong>Consent to disclosures:</strong> Schools must obtain your consent before disclosing education records to third parties (with limited exceptions).</li>
              <li><strong>File complaints:</strong> You may file a complaint with the U.S. Department of Education if you believe FERPA has been violated.</li>
            </ul>
            <p>To exercise these rights:</p>
            <ul>
              <li><strong>Parent Dashboard:</strong> Access your child's data directly through ReadQuest's parent portal</li>
              <li><strong>Contact your school:</strong> Your child's school remains the primary custodian of education records</li>
              <li><strong>Contact PSH Industries:</strong> Email <a href="mailto:ferpa@pshindustries.com" className="text-rq-purple hover:underline font-semibold">ferpa@pshindustries.com</a> for data-related inquiries</li>
            </ul>
          </Section>

          {/* 8. Annual Notification */}
          <Section id="annual-notification" number="8" title="Annual Notification Requirements">
            <p>
              FERPA requires schools to notify parents annually of their rights under the law. ReadQuest supports schools in meeting this obligation by:
            </p>
            <ul>
              <li><strong>Template notices:</strong> Providing schools with customizable annual notification templates that include ReadQuest-specific information</li>
              <li><strong>Service description:</strong> Clearly documenting what student data ReadQuest accesses, how it is used, and how it is protected</li>
              <li><strong>Criteria documentation:</strong> Helping schools articulate the criteria for designating ReadQuest as a "school official" with "legitimate educational interest"</li>
              <li><strong>Opt-out support:</strong> Providing mechanisms for schools to honor parent opt-out requests for directory information and optional features</li>
              <li><strong>Updated disclosures:</strong> Notifying schools promptly of any material changes to our data practices so they can update their annual notices</li>
            </ul>
            <p>
              Schools using ReadQuest should include information about our platform in their annual FERPA notification to parents, including the designation of PSH Industries as a school official performing outsourced educational services.
            </p>
          </Section>

          {/* 9. Data Governance */}
          <Section id="data-governance" number="9" title="Data Governance">
            <h4 className="font-display font-semibold text-rq-purple">9.1 Data Minimization</h4>
            <p>
              ReadQuest collects only the minimum student data necessary to provide our educational services:
            </p>
            <ul>
              <li>First name and last initial (display purposes)</li>
              <li>Grade level (content recommendations and reading level matching)</li>
              <li>Class assignment (teacher reporting and social boundaries)</li>
              <li>Reading activity data (progress tracking and gamification)</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">9.2 Data Retention</h4>
            <ul>
              <li><strong>Active accounts:</strong> Data retained for the duration of the school's contract</li>
              <li><strong>Contract termination:</strong> All student data returned or deleted within 60 days</li>
              <li><strong>Individual deletion:</strong> Schools can request deletion of individual student records at any time</li>
              <li><strong>De-identified data:</strong> Aggregate, de-identified data may be retained for product improvement (no re-identification possible)</li>
            </ul>

            <h4 className="font-display font-semibold text-rq-purple">9.3 Compliance Frameworks</h4>
            <p>In addition to FERPA, ReadQuest is designed to comply with:</p>
            <ul>
              <li><strong>COPPA</strong> — Children's Online Privacy Protection Act (<Link to="/coppa" className="text-rq-purple hover:underline font-semibold">see our COPPA compliance page</Link>)</li>
              <li><strong>State student privacy laws</strong> — Including California (SOPIPA), New York (Education Law 2-d), and others</li>
              <li><strong>Student Privacy Pledge</strong> — PSH Industries is committed to the principles of the Student Privacy Pledge</li>
            </ul>
          </Section>

          {/* 10. Contact */}
          <Section id="contact" number="10" title="Contact Us">
            <div className="bg-gray-50 rounded-xl p-6 not-prose border border-gray-200">
              <h4 className="font-display font-bold text-lg mb-3">PSH Industries</h4>
              <div className="space-y-2 text-sm">
                <p>📧 <strong>FERPA Inquiries:</strong> <a href="mailto:ferpa@pshindustries.com" className="text-rq-purple hover:underline">ferpa@pshindustries.com</a></p>
                <p>📧 <strong>Privacy Office:</strong> <a href="mailto:privacy@pshindustries.com" className="text-rq-purple hover:underline">privacy@pshindustries.com</a></p>
                <p>🌐 <strong>Website:</strong> <a href="https://pshindustries.com" className="text-rq-purple hover:underline">pshindustries.com</a></p>
              </div>
              <p className="text-xs text-rq-muted mt-4">
                For FERPA complaints, you may also contact the U.S. Department of Education:
              </p>
              <div className="mt-2 text-xs text-rq-muted">
                <p><strong>Family Policy Compliance Office</strong></p>
                <p>U.S. Department of Education</p>
                <p>400 Maryland Avenue, SW</p>
                <p>Washington, DC 20202</p>
                <p>📧 <a href="mailto:FERPA@ed.gov" className="text-rq-purple hover:underline">FERPA@ed.gov</a></p>
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
            <Link to="/terms" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Terms of Service →
            </Link>
            <Link to="/cookies" className="text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors bg-purple-50 px-4 py-2 rounded-full">
              Cookie Policy →
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
