import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const faqs = [
  // ─── Bookings & Reservations ───────────────────────────────────────────────
  {
    category: 'Bookings & Reservations',
    q: 'How do I make a booking on DriveFleet?',
    a: `Browse our fleet at drivefleet.ng/vehicles. Select a vehicle, choose your pickup and return dates and times, review the itemised quote (which shows base rate, any weekend surcharge, duration discount, and applicable promo), then proceed to checkout. Your booking reference (DF-YYYY-XXXX) is generated instantly. You'll receive a confirmation on the booking confirmation page.`,
  },
  {
    category: 'Bookings & Reservations',
    q: 'Can I book without creating an account?',
    a: `During the DriveFleet demo phase, bookings are made under a simulated customer identity. In production, you will need a registered account with verified contact details and a valid driver's licence on file before a booking can be confirmed.`,
  },
  {
    category: 'Bookings & Reservations',
    q: 'Can I book on behalf of someone else?',
    a: `Corporate account holders and DriveFleet staff can create bookings on behalf of customers through the Operations Deck. The primary driver listed must present their licence and ID at pickup. Third-party bookings without the primary driver's credentials on file cannot be collected.`,
  },
  {
    category: 'Bookings & Reservations',
    q: 'How far in advance can I make a booking?',
    a: `You can book up to 12 months in advance. Same-day bookings are accepted if the vehicle is available and the branch can accommodate a same-day pickup — please call your branch to confirm availability before booking for same-day collection.`,
  },
  {
    category: 'Bookings & Reservations',
    q: 'What is the minimum rental duration?',
    a: `The minimum rental period is 1 full calendar day (24 hours). Any rental of less than 24 hours is still billed as a full day. The system calculates billed periods as the ceiling of (return time − pickup time) ÷ 24 hours, so a 25-hour rental is billed as 2 days.`,
  },

  // ─── Pricing & Payment ────────────────────────────────────────────────────
  {
    category: 'Pricing & Payment',
    q: 'How is my rental price calculated?',
    a: `Your quote is built day by day:
• Each calendar day in your rental window is priced at the vehicle's base daily rate.
• Days that fall on a Saturday or Sunday attract a 10% weekend surcharge (e.g. ₦30,000/day becomes ₦33,000 on weekends).
• Any active pricing override (set by an admin for a specific vehicle, category, or date range) replaces the standard calculation for those days.
• Duration discounts: 7–29 day rentals receive 10% off the subtotal; 30+ day rentals receive 20% off.
• A promo code can provide an additional percentage or fixed deduction.
• A refundable security deposit and fixed administrative fee are added to reach your total.`,
  },
  {
    category: 'Pricing & Payment',
    q: 'What payment methods are accepted?',
    a: `DriveFleet currently operates as a demo/simulation platform. In production, we accept bank transfers, card payments via a licensed Nigerian payment gateway (Paystack/Flutterwave), and corporate purchase orders for approved accounts. All amounts are displayed and charged in Nigerian Naira (NGN).`,
  },
  {
    category: 'Pricing & Payment',
    q: 'Is my security deposit refundable?',
    a: `Yes. The security deposit is fully refundable provided the vehicle is returned in the same condition recorded at pickup, with the same fuel level, and with no excess mileage. Deposit refunds are processed within 3–5 business days of a clean return inspection. Deductions may be made for damage, fuel shortfall, or excess mileage charges.`,
  },
  {
    category: 'Pricing & Payment',
    q: 'What are excess mileage charges?',
    a: `Each vehicle comes with a daily mileage allowance (default 200 km/day, pro-rated across your booking). Any kilometres driven above this allowance are charged at ₦150/km (₦15,000 per 100 km). The excess is calculated from the odometer difference between pickup and return inspections and settled at the time of return.`,
  },
  {
    category: 'Pricing & Payment',
    q: 'How do promo codes work?',
    a: `Enter your promo code during the booking wizard before checkout. Codes can offer:
• A percentage discount (e.g. FLEETDEMO10 = 10% off your post-duration-discount subtotal).
• A fixed Naira amount off (e.g. ₦5,000 off), capped at the payable amount so you cannot go below ₦0.
Promo codes have validity dates, minimum rental day requirements, and maximum redemption limits. An expired or fully redeemed code will be rejected at checkout.`,
  },

  // ─── Amendments & Cancellations ──────────────────────────────────────────
  {
    category: 'Amendments & Cancellations',
    q: 'Can I change my pickup or return date after booking?',
    a: `Yes. Log into your account, navigate to My Bookings, and select Amend Booking. You can adjust pickup and return times subject to vehicle availability. The system will recalculate the quote based on the new dates. If the price increases, the difference is charged; if it decreases, the credit is applied. Amendments must be made at least 2 hours before the original pickup time.`,
  },
  {
    category: 'Amendments & Cancellations',
    q: 'What is the cancellation policy?',
    a: `• Cancellations made more than 24 hours before the scheduled pickup: Full refund of the rental amount (excluding the admin fee, which is non-refundable).
• Cancellations within 24 hours of pickup: 50% of the rental amount is retained as a late cancellation fee. The security deposit is fully refunded.
• No-shows (failure to collect within 2 hours of the scheduled pickup without contact): The full rental amount is retained. The security deposit is refunded.
• Active rentals (vehicle already collected) cannot be cancelled — only the return date can be amended.`,
  },
  {
    category: 'Amendments & Cancellations',
    q: 'What if I return the vehicle late?',
    a: `Late returns are charged at 1.5× the daily rate (pro-rated hourly) for every additional hour beyond the agreed return time, up to a maximum of 1 full additional day. If you know you'll be late, call or message your branch before your return time — pre-arranged extensions are treated as amendments and billed at the standard rate without the late penalty.`,
  },

  // ─── Vehicle & Pickup ─────────────────────────────────────────────────────
  {
    category: 'Vehicle & Pickup',
    q: 'What documents do I need to collect a vehicle?',
    a: `Bring the following to the branch at pickup:
1. Your booking confirmation (digital or printed) with the booking reference.
2. A valid, government-issued driver's licence (Nigerian or international, not expired).
3. A government-issued photo ID (national ID, international passport, or voter's card).
4. Payment card or bank transfer receipt if payment hasn't been fully confirmed.
The primary driver must be present in person. We do not release vehicles to third parties.`,
  },
  {
    category: 'Vehicle & Pickup',
    q: 'What is the minimum age to rent a vehicle?',
    a: `The minimum age to rent any DriveFleet vehicle is 21 years. Drivers aged 21–24 may rent Economy and Sedan category vehicles only. SUV and Luxury vehicles require the primary driver to be at least 25 years old. All drivers must have held a valid licence for a minimum of 2 years.`,
  },
  {
    category: 'Vehicle & Pickup',
    q: 'What happens during the pickup inspection?',
    a: `A DriveFleet staff agent will walk around the vehicle with you, documenting:
• Current odometer reading
• Fuel level (you must return the vehicle with the same fuel level)
• Condition of all body panels, glass, tyres, interior, lights, and mirrors
Any pre-existing damage is photographed and noted on the condition report. Both you and the agent sign off before you receive the keys. This protects you from being charged for damage that occurred before your rental.`,
  },
  {
    category: 'Vehicle & Pickup',
    q: 'What happens if the vehicle breaks down during my rental?',
    a: `Call your branch immediately. DriveFleet will arrange roadside assistance for mechanical failures that are not the result of driver negligence. If the vehicle cannot be repaired within 4 hours, we will substitute a comparable vehicle at no extra cost. Breakdowns caused by driver error (running out of fuel, tyre damage from kerbing, off-road driving) are not covered and may result in charges.`,
  },

  // ─── Fuel Policy ─────────────────────────────────────────────────────────
  {
    category: 'Fuel Policy',
    q: "What is DriveFleet's fuel policy?",
    a: `DriveFleet operates a full-to-full fuel policy. The vehicle will be provided with a documented fuel level at pickup (recorded as a fraction on the inspection checklist). You must return the vehicle with the same fuel level. If the fuel level at return is lower, a refuelling charge applies: the cost of the missing fuel at the current pump rate plus a ₦2,500 refuelling administration fee.`,
  },
  {
    category: 'Fuel Policy',
    q: 'What fuel type does the vehicle use?',
    a: `Each vehicle listing shows its fuel type: Petrol, Diesel, Hybrid, or Electric. This is also confirmed on your booking confirmation. Using the wrong fuel type is considered driver negligence and all draining/repair costs will be charged to the renter. Always check before fuelling.`,
  },

  // ─── Privacy & Data ──────────────────────────────────────────────────────
  {
    category: 'Privacy & Data',
    q: 'What data does DriveFleet collect about me?',
    a: `We collect the personal data necessary to operate a car rental service: your name, email, phone number, driver's licence details, date of birth, and national ID number. We also log booking activity, inspection records, and payment transactions. See our full Data Privacy Policy for details on how this data is stored, used, and protected.`,
  },
  {
    category: 'Privacy & Data',
    q: 'Can I request deletion of my data?',
    a: `Yes. Under Nigeria's NDPR and applicable data protection principles, you have the right to request access to, correction of, or deletion of your personal data. Email privacy@drivefleet.ng with the subject line "Data Deletion Request" and your registered email address. We will process your request within 30 days. Note: some data (e.g. inspection records, financial transactions) may be retained for regulatory and auditing purposes even after account deletion.`,
  },
];

const categories = Array.from(new Set(faqs.map((f) => f.category)));

export function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const query = search.toLowerCase();
    const matchSearch = !query || f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            Support Centre
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
            Find answers to the most common questions about booking, pricing, pickups, cancellations, fuel policy, and data privacy.
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 transition"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors border ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">No results for "{search}"</p>
            <p className="text-sm mt-1">Try different keywords or browse all categories.</p>
          </div>
        ) : (
          (() => {
            const visibleCategories =
              activeCategory === 'All'
                ? categories.filter((cat) => filtered.some((f) => f.category === cat))
                : [activeCategory];

            return visibleCategories.map((cat) => {
              const items = filtered.filter((f) => f.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="mb-10">
                  <h2 className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-4 pl-1">{cat}</h2>
                  <div className="space-y-2">
                    {items.map((faq) => {
                      const id = `${faq.category}-${faq.q}`;
                      const isOpen = open === id;
                      return (
                        <div key={id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                          <button
                            className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                            onClick={() => setOpen(isOpen ? null : id)}
                          >
                            <span className="text-sm font-semibold text-slate-800 leading-snug">{faq.q}</span>
                            {isOpen
                              ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            }
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 border-t border-slate-100">
                              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pt-3">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>

      {/* Still have questions */}
      <div className="bg-blue-600 py-14 px-4 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
        <p className="text-blue-100 text-sm mb-6 max-w-sm mx-auto">
          Our team is ready to help. Reach out via our contact form or call your nearest branch directly.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
