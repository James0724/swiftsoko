import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

const SECTIONS = [
  {
    id: "1",
    title: "Who We Are & Scope",
    content: [
      "Jijenge Swiftsoko is a digital marketplace operated in the Republic of Kenya. This Privacy Policy explains how we collect, use, store, share, and protect your personal data when you use our Platform — including our website, mobile applications, and any related services.",
      "This Policy is compliant with the Data Protection Act, No. 24 of 2019 (\"DPA\") of the Republic of Kenya and the implementing regulations thereunder. We are registered as a data controller with the Office of the Data Protection Commissioner (ODPC) of Kenya.",
      "By using our Platform, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and processing of your personal data as described herein. You may withdraw consent at any time, subject to legal and contractual limitations.",
    ],
  },
  {
    id: "2",
    title: "Data We Collect",
    content: [
      "Account & Identity Data: When you register, we collect your name, email address, phone number, and optionally your profile photograph. Sellers additionally provide business name, KRA PIN (for tax compliance), and bank/mobile money account details.",
      "Transaction Data: We collect records of purchases, payments, refunds, and disputes. This includes order amounts, payment method references (not full card numbers — we use tokenised, PCI-DSS compliant payment processors), and delivery addresses.",
      "Usage & Device Data: We automatically collect data about how you interact with the Platform, including pages viewed, search queries, click patterns, device type, operating system, browser, IP address, and approximate geolocation (city-level only).",
      "Communications Data: When you contact our support team, submit reviews, or communicate with Sellers through the Platform, we retain those communications to resolve disputes and improve service quality.",
      "Cookies & Tracking Technologies: We use strictly necessary cookies (essential for Platform function), analytical cookies (anonymised usage statistics), and preference cookies (to remember your settings). We do not use third-party advertising trackers without your explicit consent. You can manage cookie preferences in your account settings.",
    ],
  },
  {
    id: "3",
    title: "How We Use Your Data",
    content: [
      "To fulfil your orders: Processing payments, coordinating delivery, handling returns, and communicating order status updates.",
      "To operate your account: Authentication, account management, Seller onboarding, and personalising your experience.",
      "To improve our Platform: Analysing aggregated, anonymised usage data to improve features, fix bugs, and develop new services.",
      "To comply with the law: Meeting our obligations under Kenyan tax law (through the Kenya Revenue Authority), anti-money laundering regulations, and responding to lawful requests from law enforcement or regulatory authorities.",
      "To communicate with you: Sending order confirmations, security alerts, and — with your consent — promotional offers, product recommendations, and platform updates. You may opt out of marketing communications at any time via the unsubscribe link in any email or by updating your account settings.",
      "To detect and prevent fraud: Monitoring for suspicious activity, protecting Buyers and Sellers from scams, and maintaining platform integrity.",
    ],
  },
  {
    id: "4",
    title: "Legal Basis for Processing",
    content: [
      "We process your personal data under the following lawful grounds as recognised by the Data Protection Act, 2019:",
      "Contractual necessity: Processing required to perform the contract we have with you (e.g., fulfilling your order).",
      "Legal obligation: Processing required to comply with Kenyan law (e.g., tax reporting to KRA, anti-money laundering checks).",
      "Legitimate interests: Processing for fraud prevention, platform security, and improving our services — where these interests are not overridden by your data protection rights.",
      "Consent: Where we rely on your consent (e.g., marketing emails, non-essential cookies), you have the right to withdraw it at any time without affecting the lawfulness of prior processing.",
    ],
  },
  {
    id: "5",
    title: "Data Sharing",
    content: [
      "We do not sell your personal data. We share your data only with trusted parties and only to the extent necessary:",
      "Delivery Partners: Your name, phone number, and delivery address are shared with courier and logistics partners solely to fulfil your order.",
      "Payment Processors: Transaction data is shared with PCI-DSS compliant payment processors (M-Pesa/Safaricom and card processors). We receive only transaction references — we never store full card numbers.",
      "Sellers: When you place an order, the Seller receives your name, order details, and delivery information sufficient to fulfil the order. Sellers do not receive your payment credentials.",
      "Legal Authorities: We may disclose your data when required by a valid court order, summons, or lawful request from a Kenyan regulatory authority such as the Communications Authority, KRA, or law enforcement.",
      "Service Providers: We use carefully vetted third-party providers for hosting, analytics, email delivery, and customer support tooling. All providers are bound by data processing agreements and may not use your data for their own purposes.",
    ],
  },
  {
    id: "6",
    title: "Data Retention",
    content: [
      "We retain your personal data for as long as is necessary for the purpose for which it was collected, subject to longer retention where required by law:",
      "Account data: Retained for the lifetime of your active account and 5 years after closure, consistent with Kenyan statute of limitations for contractual claims.",
      "Transaction records: Retained for 7 years to satisfy tax and anti-money laundering obligations under Kenyan law.",
      "Communications and support records: Retained for 3 years to assist with dispute resolution.",
      "Anonymised usage analytics: Retained indefinitely as they cannot be linked back to any individual.",
      "When retention periods expire, data is securely deleted or anonymised. You may request early deletion of your data (subject to legal retention requirements) by submitting a request to privacy@jijengeswiftsoko.co.ke.",
    ],
  },
  {
    id: "7",
    title: "Your Rights Under Kenyan Law",
    content: [
      "Under the Data Protection Act, 2019, you have the following rights, which you may exercise by contacting our Data Protection Officer (DPO) at privacy@jijengeswiftsoko.co.ke:",
      "Right of Access: Request a copy of the personal data we hold about you.",
      "Right to Rectification: Request correction of inaccurate or incomplete personal data.",
      "Right to Erasure: Request deletion of your personal data where there is no overriding legal basis to retain it.",
      "Right to Restrict Processing: Request that we pause processing of your data in certain circumstances.",
      "Right to Object: Object to processing based on legitimate interests or for direct marketing purposes.",
      "Right to Data Portability: Receive your data in a structured, machine-readable format.",
      "Right to Lodge a Complaint: You have the right to lodge a complaint with the Office of the Data Protection Commissioner (ODPC) at odpc.go.ke if you believe your data rights have been violated.",
      "We will respond to all verified requests within 30 days. Complex requests may be extended by a further 60 days with notice. We reserve the right to decline requests that are manifestly unfounded or excessive.",
    ],
  },
  {
    id: "8",
    title: "Data Security",
    content: [
      "We implement industry-standard technical and organisational security measures to protect your personal data from unauthorised access, accidental loss, alteration, or disclosure. These include: Transport Layer Security (TLS/HTTPS) encryption for all data in transit; AES-256 encryption for sensitive data at rest; role-based access controls limiting staff access to personal data on a need-to-know basis; regular security audits and penetration testing; and multi-factor authentication for Platform staff accounts.",
      "Notwithstanding these measures, no internet transmission is 100% secure. In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify you and the ODPC within 72 hours of becoming aware of the breach, as required by the DPA.",
    ],
  },
  {
    id: "9",
    title: "Cookies Policy",
    content: [
      "We use cookies and similar tracking technologies on our Platform. Strictly necessary cookies (which cannot be disabled) are required for core Platform functionality such as authentication and cart management. Analytical cookies (which you may opt out of) help us understand how the Platform is used, using anonymised data processed by privacy-respecting analytics tools.",
      "We do not use cookies to build advertising profiles or share your browsing behaviour with advertising networks. Third-party social media buttons (if present) may set their own cookies — these are governed by the respective third party's privacy policy.",
      "You can manage your cookie preferences through your browser settings or through our in-Platform cookie consent tool. Blocking strictly necessary cookies may impair Platform functionality.",
    ],
  },
  {
    id: "10",
    title: "Children's Privacy",
    content: [
      "The Platform is not directed to children under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a child, please contact us immediately at privacy@jijengeswiftsoko.co.ke and we will take prompt steps to delete it.",
    ],
  },
  {
    id: "11",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Material changes that affect how we use your data will be notified via email and a prominent in-Platform notice at least 14 days before taking effect. The date at the top of this page reflects when the policy was last updated.",
      "Your continued use of the Platform after the effective date of any change constitutes your acceptance of the updated policy.",
    ],
  },
  {
    id: "12",
    title: "Contact & Data Protection Officer",
    content: [
      "For all data protection queries, access requests, or complaints, contact our Data Protection Officer:",
      "Email: privacy@jijengeswiftsoko.co.ke",
      "Postal address: Data Protection Officer, Jijenge Swiftsoko, Westlands Commercial Centre, Nairobi, Kenya",
      "Alternatively, you may file a complaint directly with the Office of the Data Protection Commissioner (ODPC), P.O. Box 41079-00100, Nairobi, Kenya. Website: odpc.go.ke.",
      "This Privacy Policy was last updated on 12 June 2026 and is effective immediately.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20">
      {/* Header */}
      <div className="bg-indigo-950 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-400 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Lock size={28} strokeWidth={3} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Privacy Protocol</h1>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest">Last updated: 12 June 2026 · DPA 2019 Compliant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Commitment Banner */}
        <div className="bg-indigo-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-8 flex items-start gap-4">
          <Lock size={24} strokeWidth={3} className="text-indigo-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-black uppercase text-xs tracking-widest text-indigo-700 mb-1">Our Privacy Commitment</p>
            <p className="font-bold text-sm text-indigo-900">We do not sell your data. We collect only what we need, retain it only as long as necessary, and treat your privacy as a fundamental right. This policy is compliant with Kenya's Data Protection Act, No. 24 of 2019.</p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
          <h2 className="font-black uppercase text-sm tracking-widest mb-4 border-b-2 border-black pb-2">Table of Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#section-${s.id}`} className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-indigo-700 hover:text-black transition-colors py-1">
                <span className="w-6 h-6 bg-indigo-950 text-white flex items-center justify-center font-black text-[10px] shrink-0">{s.id}</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.id} id={`section-${section.id}`} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-indigo-950 text-white px-6 py-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-400 text-white flex items-center justify-center font-black text-sm shrink-0">{section.id}</span>
                <h2 className="font-black uppercase text-sm tracking-wide">{section.title}</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                {section.content.map((para, i) => (
                  <p key={i} className="font-bold text-sm text-gray-700 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-bold text-xs text-gray-600 uppercase tracking-wide max-w-lg">
            Questions about your data? Email our DPO at{" "}
            <span className="font-black text-black">privacy@jijengeswiftsoko.co.ke</span>.
            Complaints may also be filed with the ODPC Kenya.
          </p>
          <Link href="/terms" className="px-6 py-3 bg-indigo-950 text-white border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all whitespace-nowrap">
            Terms of Service →
          </Link>
        </div>
      </div>
    </main>
  );
}
