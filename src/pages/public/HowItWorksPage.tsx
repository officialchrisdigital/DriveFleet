import { Link } from 'react-router-dom';
import {
  Search,
  CalendarCheck,
  CreditCard,
  ClipboardCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Clock,
  Shield,
  Star,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse & Select Your Vehicle',
    description:
      'Use our fleet catalogue to filter by category (Economy, Sedan, SUV, Luxury), pickup branch, and travel dates. Every listing shows real-time availability, live pricing, transmission type, fuel type, and seating capacity so you can make an informed choice before committing.',
    tips: [
      'Use date filters to see only available vehicles for your window',
      'Compare categories to balance comfort and budget',
      'Hover over a vehicle card to preview daily rate details',
    ],
    color: 'blue',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Configure Your Booking',
    description:
      'Select your exact pickup and return dates and times. Our transparent pricing engine instantly calculates your quote — showing you the per-day breakdown, any weekend surcharge (+10%), applicable duration discounts (7–29 days: 10% off, 30+ days: 20% off), promo codes, fixed fees, and refundable security deposit. No hidden figures.',
    tips: [
      'Enter a promo code at this step to apply a discount',
      'Longer rentals automatically unlock duration tier discounts',
      'Weekend days (Fri–Sun) carry a 10% surcharge — shown clearly in the quote',
    ],
    color: 'indigo',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Complete Checkout',
    description:
      'Review your full cost breakdown then proceed to our simulated checkout. DriveFleet uses atomic concurrency locking to guarantee your vehicle is reserved the moment you confirm — no double bookings, no race conditions. Your booking reference is generated instantly and sent to your registered email.',
    tips: [
      'Checkout is idempotent — refreshing will not double-charge you',
      'Your booking reference (DF-YYYY-XXXX) is your proof of reservation',
      'Cancellations within the policy window are processed back automatically',
    ],
    color: 'violet',
  },
  {
    number: '04',
    icon: ClipboardCheck,
    title: 'Branch Pickup & Inspection',
    description:
      'Arrive at your chosen branch at the agreed time. A DriveFleet staff agent will conduct a structured pickup inspection — recording the current odometer reading, fuel level, and the condition of every panel, interior surface, tyre, and glass. Both you and the agent sign off on the condition report before you drive away.',
    tips: [
      'Bring your booking confirmation, valid driver\'s licence, and a form of ID',
      'Walk around the vehicle with the agent — never skip the inspection',
      'Any pre-existing damage will be documented so you are not held liable',
    ],
    color: 'emerald',
  },
  {
    number: '05',
    icon: Car,
    title: 'Drive — Your Fleet, Your Schedule',
    description:
      'Enjoy your rental with confidence. Each vehicle comes with a mileage allowance (default 200 km/day). If you need to extend your rental, contact the branch before your return date to amend the booking. Our staff team is reachable during operational hours for any roadside queries.',
    tips: [
      'Stay within your agreed mileage allowance to avoid excess charges',
      'Fuel policy is return-to-same-level — refill before returning',
      'For extensions, call your branch — amendments are subject to availability',
    ],
    color: 'amber',
  },
  {
    number: '06',
    icon: CheckCircle2,
    title: 'Return & Final Settlement',
    description:
      'Return the vehicle to the same branch at the agreed time. A return inspection records the new odometer, fuel level, and any new damage compared to the pickup report. Mileage excess charges and fuel differentials are calculated and settled. Your security deposit is released once the vehicle clears inspection.',
    tips: [
      'Return on time to avoid late fees',
      'Top up the fuel to the level recorded at pickup',
      'Deposit release typically reflects within 3–5 business days',
    ],
    color: 'rose',
  },
];

const colorMap: Record<string, { bg: string; text: string; badge: string; border: string; dot: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-700',    badge: 'bg-blue-600',    border: 'border-blue-200',   dot: 'bg-blue-600'   },
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  badge: 'bg-indigo-600',  border: 'border-indigo-200', dot: 'bg-indigo-600' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-700',  badge: 'bg-violet-600',  border: 'border-violet-200', dot: 'bg-violet-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-600', border: 'border-emerald-200',dot: 'bg-emerald-600'},
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   badge: 'bg-amber-500',   border: 'border-amber-200',  dot: 'bg-amber-500'  },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-700',    badge: 'bg-rose-600',    border: 'border-rose-200',   dot: 'bg-rose-600'   },
};

const highlights = [
  { icon: Shield, label: 'Atomic Booking Guarantee', desc: 'Advisory locks prevent double-booking at the database level' },
  { icon: Star,   label: 'Transparent Pricing',       desc: 'Every line item shown before you confirm — no surprises at checkout' },
  { icon: Clock,  label: 'Fast Handover',             desc: 'Structured inspection SOP keeps branch pickup under 15 minutes' },
  { icon: MapPin, label: 'Two Branch Locations',      desc: 'Lagos Ikeja Main Hub and Abuja Central Terminal — more locations coming' },
];

export function HowItWorksPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            The DriveFleet Process
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            How DriveFleet Works
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From browsing the fleet to returning the keys — a transparent, six-step process
            designed around speed, trust, and zero hidden charges.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
            >
              Browse the Fleet <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-slate-800">{label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Your Rental Journey — Step by Step</h2>
          <p className="text-slate-500 mt-2 text-sm">Follow these six steps for a smooth, fully documented rental experience.</p>
        </div>

        {steps.map((step, idx) => {
          const c = colorMap[step.color];
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-12 bg-slate-200 -translate-x-1/2 z-0" />
              )}
              <div className={`relative z-10 bg-white rounded-2xl border ${c.border} shadow-sm overflow-hidden`}>
                <div className={`${c.bg} px-6 py-5 flex items-start gap-4`}>
                  <div className={`${c.badge} text-white rounded-xl p-2.5 shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-bold uppercase tracking-widest ${c.text} opacity-70`}>
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold mt-1 ${c.text}`}>{step.title}</h3>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <p className="text-slate-600 leading-relaxed text-sm">{step.description}</p>
                  <ul className="mt-4 space-y-2">
                    {step.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs text-slate-500">
                        <ChevronRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${c.text}`} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-blue-100 mb-6 text-sm max-w-md mx-auto">
          Browse our fleet now and get a transparent, instant quote in under 60 seconds.
        </p>
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
        >
          Browse Fleet <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
