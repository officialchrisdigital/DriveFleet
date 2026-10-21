import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction & Controller Identity',
    content: `DriveFleet Technologies Ltd. ("DriveFleet", "we", "us", "our") is committed to protecting the personal data of all individuals who interact with our platform, including website visitors, registered users, renters, and enquirers.

This Data Privacy Policy ("Policy") explains:
• What personal data we collect and why
• How we process, store, and protect your data
• Who we share your data with
• How long we retain your data
• Your rights under applicable data protection law
• How to contact us with data-related requests

DriveFleet Technologies Ltd. is registered in the Federal Republic of Nigeria and operates under the Nigeria Data Protection Regulation 2019 (NDPR) issued by the National Information Technology Development Agency (NITDA). Where applicable, we also observe the principles of the EU General Data Protection Regulation (GDPR) for data subjects located within the European Economic Area.

Data Controller: DriveFleet Technologies Ltd.
Contact: 14 Obafemi Awolowo Way, Ikeja, Lagos State, Nigeria
Privacy Email: privacy@drivefleet.ng
Data Protection Officer: Ibrahim Musa — dpo@drivefleet.ng`,
  },
  {
    id: 'data-collected',
    title: '2. Personal Data We Collect',
    content: `We collect personal data through the following channels:

2.1 Account Registration
• Full name (first name, last name)
• Email address
• Mobile phone number
• Password (stored as a bcrypt hash — we never store plaintext passwords)
• Preferred branch

2.2 Driver Credential Dossier (collected at booking or profile stage)
• Driver's licence number
• Driver's licence expiry date
• Date of birth
• National Identity Number (NIN) or international passport number
• Voter's card number (if used as alternate ID)

2.3 Booking & Transaction Records
• Pickup and return dates and times
• Branch selected
• Vehicle booked
• Pricing breakdown (rates, discounts, deposits, fees)
• Payment transaction references (we do not store raw card numbers — all card data is handled by our PCI-DSS-compliant payment processor)
• Booking status history and version audit trail

2.4 Inspection Records
• Odometer readings at pickup and return
• Fuel level at pickup and return
• Signed condition checklist data
• Damage photographs (stored in encrypted cloud storage)
• Staff member ID who conducted the inspection

2.5 Technical & Usage Data
• IP address at time of account creation and login
• Browser type and device type
• Pages visited and actions taken on our platform (session logs)
• Timestamp data for all significant platform events

2.6 Communications
• Enquiry messages submitted via the Contact form
• Customer support email correspondence
• WhatsApp messages sent to our support numbers`,
  },
  {
    id: 'legal-basis',
    title: '3. Legal Basis for Processing',
    content: `Under the NDPR and GDPR, we process your personal data on the following legal bases:

3.1 Contractual Necessity — Processing your name, contact details, driver's licence information, and booking data is necessary to enter into and perform the car rental agreement with you. Without this data, we cannot confirm your booking or release a vehicle to you.

3.2 Legal Obligation — We are required by Nigerian law (including the FRSC Act, Consumer Protection Framework, and tax regulations) to retain certain records including identity verification data, inspection records, and financial transaction records for regulatory compliance and audit purposes.

3.3 Legitimate Interests — We process certain technical and usage data on the basis of our legitimate interest in:
• Maintaining the security and integrity of our platform
• Preventing fraud and identity theft
• Improving our services through aggregate usage analytics
• Investigating and resolving disputes

3.4 Consent — Where we send promotional communications (newsletters, offers, announcements), we do so only with your explicit prior consent. You may withdraw consent at any time by clicking the unsubscribe link or emailing privacy@drivefleet.ng.`,
  },
  {
    id: 'data-use',
    title: '4. How We Use Your Data',
    content: `We use the personal data we collect for the following specific purposes:

4.1 To process and manage your bookings — creating booking records, generating references, calculating quotes, and coordinating pickup and return logistics.

4.2 To verify your identity and driving eligibility — confirming that you meet the minimum age, licence validity, and ID requirements before releasing a vehicle.

4.3 To conduct and record vehicle inspections — documenting vehicle condition at pickup and return to protect both the renter and DriveFleet's fleet.

4.4 To process payments and manage accounts — communicating with payment processors, issuing receipts, processing deposit refunds, and collecting outstanding balances.

4.5 To communicate with you — sending booking confirmations, amendment notifications, payment receipts, return reminders, and support responses.

4.6 To resolve disputes — using inspection records, booking audit trails, and communications to investigate and resolve claims relating to damage, excess charges, or service complaints.

4.7 To improve our platform — analysing anonymised, aggregated usage patterns to enhance the booking experience, pricing accuracy, and fleet utilisation reporting.

4.8 To comply with legal and regulatory requirements — retaining records as required by FRSC, FIRS, CAC, and NITDA regulations.

4.9 To protect against fraud — detecting and preventing fraudulent bookings, identity misrepresentation, and payment fraud.`,
  },
  {
    id: 'sharing',
    title: '5. Who We Share Your Data With',
    content: `We do not sell your personal data. We share data only in the following circumstances:

5.1 DriveFleet Staff — Authorised employees and branch agents who require access to process bookings, conduct inspections, or provide customer support. Access is role-based and audit-logged.

5.2 Payment Processors — Your payment details are shared with our licensed payment gateway partners (e.g. Paystack or Flutterwave) who are PCI-DSS certified and operate under their own privacy frameworks.

5.3 Cloud Infrastructure Providers — Our platform is hosted on cloud infrastructure (including Supabase and Vercel). These providers process data on our behalf under strict data processing agreements and do not use your data for their own purposes.

5.4 Insurance Providers — In the event of an accident, damage claim, or third-party liability incident, relevant booking and inspection records may be shared with our insurance underwriters to process the claim.

5.5 Law Enforcement & Regulatory Bodies — We will disclose personal data to Nigerian law enforcement agencies, FRSC, or regulatory authorities where required by a valid legal order, warrant, or regulatory demand.

5.6 Professional Advisers — Our lawyers, auditors, and accountants may have access to personal data where necessary to provide professional services, subject to legal professional privilege and confidentiality obligations.

We require all third parties who process data on our behalf to sign data processing agreements and implement equivalent data protection standards.`,
  },
  {
    id: 'retention',
    title: '6. Data Retention',
    content: `We retain personal data only for as long as necessary for the purposes described in this Policy, subject to applicable legal retention requirements:

6.1 Account Data — Retained for the duration of your active account. If you request deletion, account data is anonymised within 30 days, subject to the exceptions in 6.3.

6.2 Booking Records & Inspection Data — Retained for 7 years from the date of the rental, as required by Nigerian tax and commercial law (Companies and Allied Matters Act, FIRS regulations).

6.3 Driver Credential Data — Retained for 5 years from the date of the last rental associated with those credentials, to satisfy FRSC-related compliance obligations and for dispute resolution.

6.4 Financial Transaction Records — Retained for 7 years in accordance with FIRS requirements.

6.5 Technical Logs — Session and access logs are retained for 90 days and then automatically deleted.

6.6 Communications — Customer support emails are retained for 3 years; formal legal correspondence is retained for 7 years.`,
  },
  {
    id: 'security',
    title: '7. Data Security',
    content: `DriveFleet implements technical and organisational measures appropriate to the risk to protect your personal data from unauthorised access, loss, alteration, or disclosure:

7.1 Encryption — All data in transit is encrypted using TLS 1.2 or higher. Sensitive fields at rest (e.g. licence numbers, national IDs) are encrypted using AES-256.

7.2 Access Controls — Database access is governed by Row-Level Security (RLS) policies. Users can only access their own data; staff can access data within their operational scope; admins have full access with all actions audit-logged.

7.3 Audit Trail — All create, update, and delete operations on sensitive entities are recorded in an immutable audit log, capturing the actor, timestamp, and before/after state.

7.4 Password Security — User passwords are never stored in plaintext. They are hashed using bcrypt with a minimum cost factor of 12.

7.5 Third-Party Security — We conduct due diligence on all third-party processors and require contractual commitments to data security standards.

7.6 Incident Response — In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify NITDA within 72 hours and notify affected individuals without undue delay, in accordance with NDPR requirements.`,
  },
  {
    id: 'rights',
    title: '8. Your Rights',
    content: `Under the NDPR and applicable data protection law, you have the following rights regarding your personal data:

8.1 Right of Access — You may request a copy of the personal data we hold about you. We will respond within 30 days.

8.2 Right to Rectification — You may request correction of inaccurate or incomplete personal data. You can update most profile data directly within the platform; for other corrections, email privacy@drivefleet.ng.

8.3 Right to Erasure ("Right to be Forgotten") — You may request deletion of your personal data where it is no longer necessary for the purpose for which it was collected, or where you withdraw consent (where consent is the legal basis). This right is subject to legal retention obligations (see Section 6).

8.4 Right to Restriction of Processing — You may request that we restrict processing of your data in certain circumstances (e.g. while a dispute is pending).

8.5 Right to Data Portability — You may request your personal data in a structured, commonly used, machine-readable format (JSON or CSV).

8.6 Right to Object — You may object to processing based on legitimate interests, including direct marketing.

8.7 Right to Withdraw Consent — Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of processing prior to withdrawal.

8.8 Right to Lodge a Complaint — You have the right to lodge a complaint with NITDA (the Nigerian data protection authority) at ndpr@nitda.gov.ng if you believe your data has been mishandled.

To exercise any of these rights, email privacy@drivefleet.ng with the subject line identifying your request. We will verify your identity before processing any request and respond within 30 days.`,
  },
  {
    id: 'cookies',
    title: '9. Cookies & Tracking',
    content: `DriveFleet uses cookies and similar technologies to operate and improve the platform:

9.1 Strictly Necessary Cookies — Session authentication tokens and CSRF protection cookies. These are essential and cannot be disabled without affecting platform functionality.

9.2 Analytics Cookies — Anonymised usage analytics to understand how users navigate the platform (e.g. which pages are most visited, average session duration). No personally identifiable information is included in analytics data.

9.3 Preference Cookies — Storing your selected branch, currency preference, and role in demo mode.

We do not use third-party advertising cookies or sell browsing data to advertising networks.

You may manage cookie preferences through your browser settings. Disabling strictly necessary cookies will prevent you from logging in.`,
  },
  {
    id: 'children',
    title: "10. Children's Data",
    content: `DriveFleet's services are not directed at individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact privacy@drivefleet.ng and we will delete the data promptly.`,
  },
  {
    id: 'updates',
    title: '11. Policy Updates & Contact',
    content: `11.1 We may update this Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. The updated Policy will be posted on this page with a revised "Last updated" date. We will notify registered users of material changes via email.

11.2 Continued use of DriveFleet services after a Policy update constitutes your acceptance of the revised Policy.

11.3 To exercise your data rights or ask questions about this Policy, contact:
• Email: privacy@drivefleet.ng
• Data Protection Officer: Ibrahim Musa — dpo@drivefleet.ng
• Post: Data Protection Officer, DriveFleet Technologies Ltd., 14 Obafemi Awolowo Way, Ikeja, Lagos State, Nigeria

Last updated: October 2026 | Version 2.0`,
  },
];

const toc = sections.map((s) => ({ id: s.id, title: s.title }));

export function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Data Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            DriveFleet Technologies Ltd. is committed to protecting your personal data in accordance with the Nigeria Data Protection Regulation (NDPR) 2019 and applicable international data protection standards. This Policy explains what data we collect, why, and how you can exercise your rights.
          </p>
          <p className="text-xs text-slate-500 mt-4">Last updated: October 2026 &nbsp;·&nbsp; Version 2.0</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-10 items-start">
        {/* Table of Contents — sticky sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contents</h3>
            <nav className="space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 py-1 group transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-800 mb-1">NDPR Compliant</p>
            <p className="text-xs text-emerald-700">This policy is aligned with NITDA's Nigeria Data Protection Regulation 2019.</p>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 scroll-mt-24"
            >
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                {section.title}
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-blue-800 leading-relaxed">
              Privacy questions or data requests? Email{' '}
              <a href="mailto:privacy@drivefleet.ng" className="font-semibold underline">privacy@drivefleet.ng</a>
              {' '}or visit our{' '}
              <Link to="/contact" className="font-semibold underline">Contact page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
