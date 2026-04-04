"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    priceNote: "forever",
    badge: null,
    highlight: false,
    cta: "Get started free",
    ctaStyle: "border",
    features: [
      { text: "3 images on sign-up (one-time gift)", yes: true },
      { text: "Preview resolution (~600px)", yes: true },
      { text: "PNG download", yes: true },
      { text: "Full HD resolution", yes: false },
      { text: "Credits never expire", yes: false },
      { text: "Processing history", yes: false },
    ],
    action: "free",
  },
  {
    name: "Credit Pack",
    price: "$5",
    priceNote: "50 images · one-time",
    badge: "Pay as you go",
    highlight: false,
    cta: "Buy credits",
    ctaStyle: "border",
    features: [
      { text: "50 full-HD images", yes: true },
      { text: "Credits never expire", yes: true },
      { text: "PNG & WebP download", yes: true },
      { text: "No subscription", yes: true },
      { text: "$9 = 100 images also available", yes: true },
      { text: "Processing history", yes: false },
    ],
    action: "credits",
  },
  {
    name: "Pro",
    price: "$12",
    priceNote: "per month",
    badge: "Best value",
    highlight: true,
    cta: "Subscribe to Pro",
    ctaStyle: "filled",
    features: [
      { text: "100 full-HD images / month", yes: true },
      { text: "Credits reset monthly", yes: true },
      { text: "PNG & WebP download", yes: true },
      { text: "Full processing history", yes: true },
      { text: "API access", yes: true },
      { text: "Priority support", yes: true },
    ],
    action: "pro",
  },
];

const FAQS = [
  {
    q: "How many free images do I get?",
    a: "Every new account receives 3 free credits on sign-up — a one-time gift, no monthly reset. No credit card required.",
  },
  {
    q: "Do credit packs expire?",
    a: "Never. Credits you purchase stay in your account until you use them.",
  },
  {
    q: "What's the quality difference between Free and paid?",
    a: "Free plan outputs preview resolution (~600px on the longest side). Credit Pack and Pro output your image at full original resolution.",
  },
  {
    q: "What file formats are supported?",
    a: "Input: JPG, PNG, WebP up to 10 MB. Output: PNG with transparent background (WebP available on paid plans).",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes. Cancel anytime — you keep access until the end of your billing period. No lock-ins.",
  },
  {
    q: "Do you offer refunds?",
    a: "Full refund within 7 days, no questions asked. Email support@imageremover.shop.",
  },
  {
    q: "How does API access work?",
    a: "Pro and Business subscribers get a personal API key. Documentation is available in your dashboard after subscribing.",
  },
  {
    q: "When will PayPal be available?",
    a: "PayPal payment is coming soon. Join the waitlist and we'll notify you the moment it launches.",
  },
];

function PlanCard({ plan, session, onAction }: { plan: typeof PLANS[0]; session: unknown; onAction: (a: string) => void }) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-8 border ${
      plan.highlight ? "border-purple-500 bg-purple-50 shadow-2xl scale-[1.03]" : "border-gray-200 bg-white"
    }`}>
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            plan.highlight ? "bg-purple-600 text-white" : "bg-gray-700 text-white"
          }`}>{plan.badge}</span>
        </div>
      )}

      <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">{plan.name}</p>
      <div className="flex items-end gap-1 mb-1">
        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
      </div>
      <p className="text-sm text-gray-400 mb-7">{plan.priceNote}</p>

      <ul className="space-y-2.5 flex-1 mb-8">
        {plan.features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5 text-sm">
            <span className={`mt-0.5 flex-shrink-0 font-bold ${f.yes ? "text-green-500" : "text-gray-200"}`}>
              {f.yes ? "✓" : "✗"}
            </span>
            <span className={f.yes ? "text-gray-700" : "text-gray-400"}>{f.text}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onAction(plan.action)}
        className={`w-full py-3 rounded-xl font-semibold transition-all ${
          plan.ctaStyle === "filled"
            ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {plan.action === "free" && session ? "Go to app →" : plan.cta}
      </button>
    </div>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleAction(action: string) {
    if (action === "free") {
      if (!session) signIn("google");
      else window.location.href = "/";
    } else if (action === "credits" || action === "pro") {
      // PayPal coming soon — collect interest via email
      window.location.href = `mailto:support@imageremover.shop?subject=Interested in ${action === "pro" ? "Pro Plan" : "Credit Pack"}&body=Please notify me when payment is available.`;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium px-4 py-1.5 rounded-full mb-5">
          🎉 Early access — PayPal payment launching soon
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Start free.<br />
          <span className="text-purple-600">Pay only when you need more.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto">
          Sign up and get 3 images free. No credit card needed. Upgrade to Credit Pack or Pro when you&apos;re ready.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-24">
        {PLANS.map((plan) => (
          <PlanCard key={plan.name} plan={plan} session={session} onAction={handleAction} />
        ))}
      </div>

      {/* Feature comparison table */}
      <div className="mb-24">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Compare plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-medium text-gray-500">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Free</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Credit Pack</th>
                <th className="text-center py-3 px-4 font-semibold text-purple-600">Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Monthly images", "3 (one-time)", "50 or 100", "100 / month"],
                ["Image resolution", "Preview ~600px", "Full HD", "Full HD"],
                ["Credits expire", "—", "Never", "Monthly reset"],
                ["Output format", "PNG", "PNG + WebP", "PNG + WebP"],
                ["Processing history", "✗", "✗", "✓"],
                ["API access", "✗", "✗", "✓"],
                ["Support", "Community", "Email", "Priority email"],
              ].map(([feature, free, credits, pro], i) => (
                <tr key={feature} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
                  <td className="py-3 pr-4 text-gray-700 font-medium">{feature}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{free}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{credits}</td>
                  <td className="py-3 px-4 text-center text-purple-700 font-medium">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-10 text-center text-white mb-24">
        <h2 className="text-3xl font-bold mb-3">3 free images. No credit card. Right now.</h2>
        <p className="text-purple-200 mb-8 max-w-md mx-auto">
          Sign in with Google in one click and start removing backgrounds instantly.
        </p>
        <button
          onClick={() => !session ? signIn("google") : window.location.href = "/"}
          className="bg-white text-purple-600 font-bold px-10 py-3.5 rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
        >
          {session ? "Back to app →" : "Sign up free with Google →"}
        </button>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 ml-4 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        Still have questions?{" "}
        <a href="mailto:support@imageremover.shop" className="text-purple-600 hover:underline">
          support@imageremover.shop
        </a>
      </p>
    </div>
  );
}
