import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

const SECTIONS = [
  {
    id: "1",
    title: "Introduction & Acceptance",
    content: [
      'These Terms of Service (“Terms”) constitute a legally binding agreement between you (“User”, “Customer”, or “you”) and Jijenge Swiftsoko (“we”, “us”, “our”, or the “Platform”), an online retailer operating in the Republic of Kenya.',
      "By accessing or using the Platform — whether to browse, purchase, track orders, or otherwise engage with our services — you confirm that you have read, understood, and agreed to be bound by these Terms, our Privacy Policy, and all applicable Kenyan laws.",
      "If you do not agree to these Terms, you must discontinue use of the Platform immediately. We reserve the right to update these Terms at any time; continued use after a change constitutes acceptance of the revised Terms. Material changes will be notified via email or a prominent in-Platform notice.",
      "Users must be at least 18 years of age or acting under the supervision of a legal guardian to use the Platform.",
    ],
  },
  {
    id: "2",
    title: "Definitions",
    content: [
      '"Platform" means the Jijenge Swiftsoko website, mobile applications, and all associated services.',
      '"User" or "Customer" means any person accessing the Platform to browse or purchase goods.',
      '"Order" means any completed purchase of goods from Jijenge Swiftsoko.',
      '"KSh" means Kenya Shilling, the lawful currency of the Republic of Kenya.',
    ],
  },
  {
    id: "3",
    title: "User Accounts & Registration",
    content: [
      "To access certain features — including purchasing, tracking orders, and managing a wishlist — you must create an account. You agree to provide accurate, current, and complete registration information.",
      "You are solely responsible for maintaining the confidentiality of your account credentials. Any activity occurring under your account is your responsibility. Notify us immediately at support@jijengeswiftsoko.co.ke if you suspect unauthorised access.",
      "We reserve the right to suspend or permanently terminate any account that: (a) provides false information; (b) violates these Terms; (c) engages in fraudulent, abusive, or illegal conduct; or (d) has been inactive for more than 24 consecutive months.",
      "One person may not maintain more than one account without prior written approval from the Platform.",
    ],
  },
  {
    id: "4",
    title: "Purchases & Payments",
    content: [
      "All prices displayed on the Platform are in Kenya Shillings (KSh) and are inclusive of applicable Value Added Tax (VAT) at the rate prescribed under the Value Added Tax Act, Cap 476 of the Laws of Kenya, currently 16%.",
      "Payment is accepted via M-Pesa (Safaricom), Visa/Mastercard debit and credit cards, and other payment methods we may introduce from time to time. Payment must be completed in full before an order is confirmed and dispatched.",
      "Orders are subject to availability. We reserve the right to cancel an order if a product becomes unavailable after purchase, in which case a full refund will be issued within 3–5 working days.",
      "Customers are responsible for providing accurate delivery addresses. The Platform is not liable for non-delivery resulting from incorrect address information provided by the Customer.",
      "Risk of loss and title for purchased items transfer to the Customer upon delivery confirmation.",
    ],
  },
  {
    id: "5",
    title: "Returns, Refunds & Dispute Resolution",
    content: [
      "Customers have 14 calendar days from the confirmed delivery date to initiate a return request. To be eligible, items must be unused, in original condition, and returned with all original packaging and tags.",
      "The following items are non-returnable: underwear and swimwear (for hygiene reasons), perishable goods, customised or personalised items, digital products, and any item explicitly marked 'Final Sale'.",
      "Where a return is accepted due to a defective product, wrong item delivered, or item not matching the description, the Platform will cover return shipping costs. Change-of-mind returns are accepted within the 14-day window, but the Customer bears return shipping costs.",
      "Refunds will be processed within 3–5 working days of the Platform receiving and inspecting the returned item. M-Pesa refunds typically reflect immediately; card refunds may take 5–10 banking days depending on the issuing bank.",
      "In the event of a dispute, Customers should first attempt resolution through the Platform's internal support system. If unresolved within 14 days, disputes shall be referred to mediation under the Nairobi Centre for International Arbitration (NCIA) Mediation Rules, failing which either party may seek redress in the competent courts of Kenya.",
    ],
  },
  {
    id: "6",
    title: "Product Listings & Accuracy",
    content: [
      "All products listed on the Platform are sold directly by Jijenge Swiftsoko. We take reasonable steps to ensure product descriptions, images, and specifications are accurate and not misleading, but minor variations (e.g. colour rendering on different screens) may occur.",
      "Products comply with applicable Kenyan product safety, labelling, and consumer protection laws.",
      "We are responsible for accurate stock management. In the rare event of an out-of-stock item being ordered in error, we will notify the Customer promptly and process a full refund.",
      "Confirmed orders are fulfilled within the stated processing time. Failure to dispatch within 3 business days of payment confirmation without valid reason may entitle the Customer to a full refund.",
    ],
  },
  {
    id: "7",
    title: "Platform's Role & Liability",
    content: [
      "Jijenge Swiftsoko is the direct retailer of all products listed on the Platform. We are a party to every contract of sale and bear responsibility for the products we sell.",
      "The Platform is not liable for: (a) any indirect, incidental, or consequential damages arising from Platform use; or (b) losses arising from circumstances beyond our reasonable control (force majeure), including natural disasters, civil unrest, or failures of third-party services.",
      "The Platform's maximum aggregate liability to any User for any claim arising under these Terms is limited to the total amount paid by that User to the Platform in the 90 days preceding the claim.",
      "The Platform complies with the Consumer Protection Act, Cap 46B of the Laws of Kenya, and Users' statutory rights under that Act are not affected by these Terms.",
    ],
  },
  {
    id: "8",
    title: "Intellectual Property",
    content: [
      "All content on the Platform — including the Jijenge Swiftsoko name, logo, design system, software, product photography, and original written content — is the exclusive intellectual property of the Platform and is protected under the Copyright Act, Cap 130 of the Laws of Kenya.",
      "Users may not reproduce, distribute, or create derivative works from Platform content without express written authorisation. Unauthorised use constitutes copyright infringement and may attract civil and criminal liability under Kenyan law.",
    ],
  },
  {
    id: "9",
    title: "Prohibited Conduct",
    content: [
      "Users must not: (a) use the Platform for any unlawful purpose; (b) attempt to gain unauthorised access to Platform systems; (c) submit false reviews or engage in review manipulation; (d) harass, threaten, or abuse other Users; or (e) impersonate another person or entity.",
      "Violations may result in immediate account suspension, permanent termination, and/or referral to law enforcement authorities.",
    ],
  },
  {
    id: "10",
    title: "Privacy & Data Protection",
    content: [
      "The Platform collects and processes personal data in accordance with our Privacy Policy and in compliance with the Data Protection Act, No. 24 of 2019 of the Republic of Kenya.",
      "By using the Platform, you consent to the collection and processing of your personal data as described in our Privacy Policy. You have the right to access, correct, and request deletion of your personal data subject to applicable legal requirements.",
    ],
  },
  {
    id: "11",
    title: "Governing Law & Jurisdiction",
    content: [
      "These Terms are governed by and construed in accordance with the laws of the Republic of Kenya. Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts of the Republic of Kenya, and each party irrevocably submits to the personal jurisdiction of such courts.",
      "Where disputes are referred to arbitration, the NCIA Nairobi Rules shall apply and the seat of arbitration shall be Nairobi, Kenya.",
    ],
  },
  {
    id: "12",
    title: "Amendments & Contact",
    content: [
      "We reserve the right to modify these Terms at any time. Non-material changes take effect immediately upon posting. Material changes will be notified at least 14 days in advance via email or in-Platform notice.",
      "For questions, complaints, or legal notices, contact us at: legal@jijengeswiftsoko.co.ke or by post to: Jijenge Swiftsoko Legal Team, Westlands Commercial Centre, Nairobi, Kenya.",
      "These Terms were last updated on 26 June 2026.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20">
      {/* Header */}
      <div className="bg-indigo-950 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-300 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Shield size={28} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Terms of Service</h1>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest">Last updated: 26 June 2026 · Governed by Kenyan Law</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Preamble */}
        <div className="bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
          <p className="font-black uppercase text-xs tracking-widest mb-2">Important Notice</p>
          <p className="font-bold text-sm">These Terms of Service govern your use of Jijenge Swiftsoko, an online retailer, and apply to all Customers and site visitors. They have been drafted to comply with applicable Kenyan consumer protection, data protection, and e-commerce laws. Please read them carefully.</p>
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
                <span className="w-8 h-8 bg-yellow-300 text-black flex items-center justify-center font-black text-sm shrink-0">{section.id}</span>
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

        {/* Footer note */}
        <div className="mt-8 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-bold text-xs text-gray-600 uppercase tracking-wide max-w-lg">
            If you have any questions about these Terms, contact our legal team at{" "}
            <span className="font-black text-black">legal@jijengeswiftsoko.co.ke</span>.
            These Terms are effective as of 26 June 2026.
          </p>
          <Link href="/privacy" className="px-6 py-3 bg-indigo-950 text-white border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all whitespace-nowrap">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </main>
  );
}
