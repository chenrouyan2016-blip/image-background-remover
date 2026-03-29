export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "50 images / month",
        "Preview resolution (~600px)",
        "PNG download",
        "No sign-up required",
      ],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      features: [
        "500 images / month",
        "Full HD resolution",
        "Batch processing",
        "Priority processing",
        "API access",
      ],
      cta: "Coming Soon",
      highlight: true,
    },
    {
      name: "Business",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited images",
        "Full HD resolution",
        "Batch processing",
        "Dedicated API",
        "Custom integration support",
      ],
      cta: "Coming Soon",
      highlight: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h1>
        <p className="text-lg text-gray-500">Start free, upgrade when you need more.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 border ${
              plan.highlight
                ? "border-purple-500 bg-purple-50 shadow-lg"
                : "border-gray-200 bg-white"
            }`}
          >
            {plan.highlight && (
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">
                Most Popular
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 ml-1">/{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                plan.highlight
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={plan.cta === "Coming Soon"}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
