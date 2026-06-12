"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCcw, AlertCircle, CheckCircle, Package, Clock, Truck, Shield, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const RETURN_REASONS = [
  "Item arrived damaged",
  "Item does not match description",
  "Wrong item delivered",
  "Item is defective / not working",
  "Size / fit issue",
  "Changed my mind",
  "Item arrived too late",
  "Duplicate order",
  "Other",
];

const PROCESS_STEPS = [
  { icon: <Package size={20} strokeWidth={3} />, title: "Submit Request", desc: "Fill out the return form below. You have 14 days from delivery.", color: "bg-yellow-300" },
  { icon: <CheckCircle size={20} strokeWidth={3} />, title: "Approval (1–2 days)", desc: "Our team reviews your request and sends approval with return instructions.", color: "bg-cyan-300" },
  { icon: <Truck size={20} strokeWidth={3} />, title: "Ship Item Back", desc: "Drop off at any Posta Kenya branch or use our arranged courier.", color: "bg-lime-300" },
  { icon: <RefreshCcw size={20} strokeWidth={3} />, title: "Refund / Exchange (3–5 days)", desc: "Refund to M-Pesa or card within 3–5 working days after receipt.", color: "bg-purple-300" },
];

const FAQS = [
  { q: "What is the return window?", a: "You have 14 calendar days from the confirmed delivery date to initiate a return. Returns requested after this window will not be accepted." },
  { q: "Which items are not eligible for return?", a: "Underwear, swimwear, personalised/customised items, perishables, and items marked 'Final Sale' are non-returnable for hygiene and quality reasons." },
  { q: "Who pays for return shipping?", a: "If the item is defective, damaged, or incorrect, Jijenge Swiftsoko covers return shipping. For change-of-mind returns, the customer bears the return shipping cost." },
  { q: "How long does a refund take?", a: "Once we receive and inspect the item, refunds are processed within 3–5 working days. M-Pesa refunds typically reflect within minutes; card refunds within 5–10 banking days depending on your bank." },
  { q: "Can I exchange instead of refund?", a: "Yes. During the returns form, select 'Exchange' and specify the product/size you prefer. Exchanges are subject to availability." },
  { q: "What condition must items be in?", a: "Items must be unused, in original packaging with all tags attached, and accompanied by the original receipt or order number." },
];

export default function ReturnsPage() {
  const [form, setForm] = useState({ orderId: "", email: "", reason: "", type: "refund", details: "", agree: false });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) { toast.error("Please accept the returns policy to proceed."); return; }
    setSubmitted(true);
    toast.success("Return request submitted! We'll email you within 24 hours.");
  };

  const update = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20">
      {/* Header */}
      <div className="bg-indigo-950 border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-orange-400 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <RefreshCcw size={28} strokeWidth={3} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Returns &amp; Refunds</h1>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest">14-day returns · Fair resolution guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Policy Banner */}
        <div className="bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex items-start gap-4">
          <Shield size={28} strokeWidth={3} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-black uppercase text-sm mb-1">Jijenge Buyer Protection</p>
            <p className="font-bold text-sm">All purchases are covered by our 14-day returns policy. If your item arrives damaged, doesn't match the description, or the wrong product was delivered, we will replace it or refund you in full — no questions asked.</p>
          </div>
        </div>

        {/* Process Steps */}
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-5">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className={`${step.color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm">{i + 1}</div>
                  {step.icon}
                </div>
                <p className="font-black uppercase text-xs tracking-wide mb-1">{step.title}</p>
                <p className="font-bold text-xs text-black/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Form */}
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-5">Submit a Return Request</h2>
          {submitted ? (
            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
              <div className="inline-block p-5 border-4 border-black bg-green-300 mb-5 -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle size={48} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Request Submitted!</h3>
              <p className="font-bold text-sm text-gray-600 uppercase max-w-md mx-auto mb-6">Your return request has been received. Check your email for confirmation and next steps. Our team will respond within 1–2 business days.</p>
              <p className="font-black text-sm uppercase">Reference: RET-{Math.floor(Math.random() * 90000) + 10000}</p>
              <div className="flex gap-3 justify-center mt-6">
                <Link href="/orders" className="px-6 py-3 bg-yellow-300 border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                  My Orders
                </Link>
                <button onClick={() => setSubmitted(false)} className="px-6 py-3 border-4 border-black font-black uppercase text-xs hover:bg-gray-100 transition-colors">
                  New Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-black uppercase text-xs">Order ID *</label>
                  <input required value={form.orderId} onChange={(e) => update("orderId", e.target.value)} placeholder="e.g. ORD-20260001" className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50" />
                </div>
                <div className="space-y-1">
                  <label className="font-black uppercase text-xs">Email Address *</label>
                  <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-xs">Reason for Return *</label>
                <select required value={form.reason} onChange={(e) => update("reason", e.target.value)} className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50 appearance-none bg-white">
                  <option value="">— Select a reason —</option>
                  {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-xs">Resolution Preference *</label>
                <div className="flex gap-4">
                  {["refund", "exchange"].map((t) => (
                    <label key={t} className={`flex-1 flex items-center justify-center gap-2 py-3 border-4 border-black font-black uppercase text-xs cursor-pointer transition-all ${form.type === t ? "bg-yellow-300 translate-x-0.5 translate-y-0.5 shadow-none" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"}`}>
                      <input type="radio" value={t} checked={form.type === t} onChange={() => update("type", t)} className="hidden" />
                      {t === "refund" ? "Full Refund" : "Exchange Item"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-xs">Additional Details</label>
                <textarea value={form.details} onChange={(e) => update("details", e.target.value)} rows={4} placeholder="Describe the issue in detail. If the item is damaged, describe the damage..." className="w-full px-4 py-3 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50 resize-none" />
              </div>

              <div className="bg-orange-50 border-4 border-black p-4 flex items-start gap-3">
                <AlertCircle size={18} strokeWidth={3} className="shrink-0 mt-0.5 text-orange-600" />
                <div>
                  <p className="font-black uppercase text-xs mb-1">Before You Submit</p>
                  <ul className="font-bold text-xs text-gray-700 space-y-1 list-disc list-inside">
                    <li>Items must be in original, unused condition with tags attached</li>
                    <li>Return window is 14 days from delivery — no exceptions</li>
                    <li>Customised or Final Sale items are not eligible for return</li>
                    <li>Refunds to M-Pesa take 3–5 business days; card refunds 5–10 days</li>
                  </ul>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} className="w-5 h-5 border-2 border-black mt-0.5 shrink-0" />
                <span className="font-bold text-xs text-gray-700">
                  I confirm that the information provided is accurate and I have read and agreed to the{" "}
                  <Link href="/terms" className="underline decoration-2 underline-offset-2 hover:text-black">Returns Policy</Link>{" "}
                  and{" "}
                  <Link href="/terms" className="underline decoration-2 underline-offset-2 hover:text-black">Terms of Service</Link>.
                </span>
              </label>

              <button type="submit" className="w-full py-4 bg-orange-400 border-4 border-black font-black uppercase text-base shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Submit Return Request
              </button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-yellow-50 transition-colors text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-black uppercase text-sm">{faq.q}</span>
                  <ChevronDown size={16} strokeWidth={3} className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 border-t-2 border-black pt-3">
                    <p className="font-bold text-sm text-gray-700">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-indigo-950 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-black uppercase text-lg mb-1">Need Help?</p>
            <p className="font-bold text-sm text-white/70">Our support team is available Mon–Sat, 8am–6pm EAT</p>
          </div>
          <div className="flex gap-3">
            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-green-500 border-4 border-white font-black uppercase text-xs hover:bg-green-400 transition-colors">
              WhatsApp Us
            </a>
            <a href="mailto:support@jijengeswiftsoko.co.ke" className="px-6 py-3 bg-yellow-300 text-black border-4 border-white font-black uppercase text-xs hover:bg-yellow-200 transition-colors">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
