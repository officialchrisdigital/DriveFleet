import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'definitions',
    title: '1. Definitions',
    content: `In these Terms and Conditions:
• "Agreement" means these Rental Terms together with your booking confirmation and the vehicle condition report.
• "DriveFleet" or "Company" means DriveFleet Technologies Ltd., a company incorporated under the laws of the Federal Republic of Nigeria.
• "Customer" or "Renter" means the individual or entity named on the booking as the primary renter.
• "Primary Driver" means the person who presents their licence at pickup and takes physical custody of the vehicle.
• "Vehicle" means the specific motor vehicle described in the booking confirmation.
• "Rental Period" means the period beginning at the agreed pickup time and ending at the agreed return time.
• "Booking Reference" means the unique identifier in the format DF-YYYY-XXXX assigned at the time of booking confirmation.
• "Minor Units" means amounts expressed in Nigerian Kobo (1 Naira = 100 Kobo) as used internally by the pricing engine.`,
  },
  {
    id: 'eligibility',
    title: '2. Eligibility & Driver Requirements',
    content: `2.1 Age — The primary driver must be at least 21 years of age at the time of pickup. Drivers aged 21–24 may only rent Economy and Sedan category vehicles. SUV and Luxury vehicle rentals require the primary driver to be at least 25 years of age.

2.2 Licence — The primary driver must hold a valid, current driver's licence issued by an appropriate authority (Nigerian FRSC or recognised international equivalent). The licence must have been held for a minimum of 2 years. Learner permits and provisional licences are not accepted.

2.3 Identification — A valid government-issued photo ID (National Identity Card, international passport, or Permanent Voter's Card) must be presented alongside the driver's licence at pickup.

2.4 Additional Drivers — Only the primary driver named in the booking is authorised to operate the vehicle unless additional drivers have been registered and approved in writing by DriveFleet prior to pickup. Additional driver registration attracts an additional fee per driver per day.

2.5 DriveFleet reserves the right to refuse vehicle release at its sole discretion if eligibility requirements are not satisfied.`,
  },
  {
    id: 'booking',
    title: '3. Booking & Confirmation',
    content: `3.1 Reservations — A booking is not confirmed until the Customer receives a booking confirmation with a unique Booking Reference. Availability displayed on the platform reflects live, real-time availability as of the moment of viewing, but is only locked at the point of checkout confirmation.

3.2 Atomic Locking — DriveFleet's platform uses database-level advisory locking to prevent concurrent bookings of the same vehicle for overlapping periods. In the event of a simultaneous booking attempt for the same vehicle and dates, only the first confirmed checkout will succeed. The other customer will receive a conflict notification and is invited to select an alternative vehicle.

3.3 Idempotency — Checkout is idempotent. Submitting the same booking request multiple times using the same idempotency key will not result in duplicate charges. Only one booking record will be created.

3.4 Booking Reference — The Booking Reference (DF-YYYY-XXXX) is the Customer's primary proof of reservation. Customers must present this reference at pickup.`,
  },
  {
    id: 'pricing',
    title: '4. Pricing & Charges',
    content: `4.1 Base Rate — Each vehicle has a published daily base rate displayed on its listing page. Rates are in Nigerian Naira (NGN).

4.2 Weekend Surcharge — Days within the rental period that fall on a Saturday or Sunday attract a 10% surcharge applied to the daily base rate. The surcharge is applied on a per-day basis and is shown as a separate line item in the quote.

4.3 Pricing Overrides — DriveFleet's pricing team may apply date-specific or vehicle-specific rate overrides that supersede the standard base rate and weekend surcharge calculation. Where an override is active for a given day, it replaces the standard calculation entirely for that day. Overrides are displayed transparently in the quote.

4.4 Duration Discounts — Bookings with a billed period of 7–29 days receive a 10% discount applied to the subtotal after per-day calculation. Bookings of 30 or more days receive a 20% discount. Duration discounts and weekend surcharges are not mutually exclusive; the surcharge is applied at the per-day level, and the duration discount is applied to the resulting subtotal.

4.5 Promo Codes — Valid promo codes apply a further reduction to the post-duration-discount total. Percentage promos are applied as a percentage of the subtotal after duration discount. Fixed-amount promos deduct a Naira amount, capped at the payable balance. A booking total cannot be reduced below ₦0.

4.6 Security Deposit — A refundable security deposit is charged at booking confirmation. The deposit amount is specific to the vehicle category. The deposit is held until the vehicle passes return inspection and is released within 3–5 business days. Deductions may be made for damage, excess mileage, or fuel shortfall.

4.7 Administrative Fee — A non-refundable administrative fee is charged per booking. This fee covers platform operations, inspection documentation, and booking support.

4.8 Excess Mileage — Mileage in excess of the agreed daily allowance (default 200 km/day) is charged at ₦150 per kilometre. Excess mileage charges are settled at the time of return.

4.9 Late Return — Vehicles returned after the agreed return time without prior arrangement are subject to a late return surcharge of 1.5× the daily rate, pro-rated per hour, up to a maximum of 1 additional full day's rate per late day.

4.10 All prices are inclusive of applicable VAT where required by law. DriveFleet will provide a VAT receipt upon request.`,
  },
  {
    id: 'pickup',
    title: '5. Pickup, Handover & Inspection',
    content: `5.1 Pickup Time — The Customer must collect the vehicle within 2 hours of the agreed pickup time. Failure to do so without prior notification will constitute a no-show and the booking may be released without refund.

5.2 Inspection SOP — Before key handover, a DriveFleet agent will conduct a structured condition inspection in the presence of the Customer. The inspection records: odometer reading, fuel level, and the condition of all body panels, glass, tyres, interior surfaces, lights, and mirrors.

5.3 Condition Report — The Customer is required to review and sign the pickup condition report. By signing, the Customer acknowledges the pre-existing condition of the vehicle as documented. Any damage discovered after departure that is not documented on the pickup report may be attributed to the Customer.

5.4 Fuel Level — The exact fuel level at pickup is recorded. The Customer is responsible for returning the vehicle with fuel at or above this level.

5.5 Odometer Monotonicity — The odometer reading at return must equal or exceed the reading at pickup. Any indication of odometer tampering will be treated as a serious breach of this Agreement and may result in criminal referral.`,
  },
  {
    id: 'return',
    title: '6. Return & Settlement',
    content: `6.1 Return Location — The vehicle must be returned to the same branch from which it was collected, unless a one-way transfer has been expressly agreed in writing prior to the rental period.

6.2 Return Inspection — On return, a DriveFleet agent will conduct a structured return inspection comparing the current condition to the pickup report. Odometer and fuel level are recorded. Any new damage, fuel shortfall, or excess mileage is documented.

6.3 Damage Charges — The Customer is liable for the cost of repairing any damage that: (a) was not documented on the pickup condition report, and (b) is not covered by the Customer's personal vehicle insurance (where accepted by DriveFleet in writing). Damage repair costs are charged at DriveFleet's standard repair rate schedule.

6.4 Deposit Release — The security deposit is released within 3–5 business days of a clean return inspection, less any deductions for damage, excess mileage, fuel shortfall, or outstanding late fees.`,
  },
  {
    id: 'prohibited',
    title: '7. Prohibited Uses',
    content: `The Vehicle must not be used for any of the following purposes. Violation of this clause constitutes a material breach of this Agreement and entitles DriveFleet to immediately terminate the rental without refund:

7.1 Off-road driving or use on unpaved terrain not reasonably accessible by a standard passenger vehicle.
7.2 Racing, rallying, or participation in any motor sport event.
7.3 Transportation of hazardous, toxic, or illegal materials.
7.4 Driving under the influence of alcohol, narcotics, or any substance that impairs driving ability.
7.5 Sub-letting or commercial use of the vehicle (e.g. ride-hailing, taxis, hire) without prior written consent from DriveFleet.
7.6 Driving outside the Federal Republic of Nigeria without DriveFleet's express written authorisation.
7.7 Allowing an unauthorised additional driver to operate the vehicle.
7.8 Towing any vehicle or trailer unless express written permission has been granted.
7.9 Carrying more passengers than the vehicle's rated seating capacity.`,
  },
  {
    id: 'cancellation',
    title: '8. Cancellation Policy',
    content: `8.1 Customer-Initiated Cancellations:
• More than 24 hours before scheduled pickup: Full refund of the rental amount; administrative fee is non-refundable.
• Within 24 hours of scheduled pickup: 50% of the rental amount is retained as a late cancellation fee; the security deposit is fully refunded.
• No-show (failure to collect within 2 hours of pickup without contact): Full rental amount retained; security deposit refunded.

8.2 DriveFleet-Initiated Cancellations: In the rare event that DriveFleet cancels a booking due to circumstances within its control (e.g. vehicle mechanical failure, operational emergency), the Customer will receive a full refund including the administrative fee within 5 business days, and DriveFleet will make commercially reasonable efforts to provide an alternative vehicle.

8.3 Force Majeure: DriveFleet shall not be liable for cancellations caused by events beyond its reasonable control, including acts of God, government actions, civil unrest, or infrastructure failures. In such cases, DriveFleet will offer rescheduling at no penalty or a full refund at the Customer's election.`,
  },
  {
    id: 'liability',
    title: '9. Liability & Insurance',
    content: `9.1 Third-Party Cover — All DriveFleet vehicles are covered by the minimum third-party motor vehicle insurance as required under Nigerian law (TPPI).

9.2 Comprehensive Cover — Comprehensive insurance coverage is not included in the standard rental rate. Customers are advised to confirm whether their personal car insurance or credit card provides rental vehicle coverage before collecting.

9.3 Customer Liability — The Customer is financially liable for:
(a) Damage to the rental vehicle up to the full market value of the vehicle for uninsured incidents.
(b) Damage to third-party property or injury to third parties resulting from driver negligence.
(c) Traffic fines, tolls, and government penalties incurred during the rental period.

9.4 Limitation of Liability — To the maximum extent permitted by Nigerian law, DriveFleet's total liability to the Customer for any claim arising under this Agreement shall not exceed the total rental charges paid by the Customer for the specific rental period in question.

9.5 DriveFleet is not responsible for personal property left in the vehicle.`,
  },
  {
    id: 'governing-law',
    title: '10. Governing Law & Dispute Resolution',
    content: `10.1 These Terms and Conditions are governed by and shall be construed in accordance with the laws of the Federal Republic of Nigeria.

10.2 In the event of a dispute, the parties agree to first attempt resolution through good-faith negotiation within 30 days of written notice of the dispute.

10.3 If negotiation fails, disputes shall be referred to the Lagos Multi-Door Courthouse (LMDC) for mediation, and failing that, submitted to arbitration under the rules of the Lagos Court of Arbitration (LCA).

10.4 Nothing in this clause prevents DriveFleet from seeking injunctive or other urgent relief from a court of competent jurisdiction.`,
  },
  {
    id: 'general',
    title: '11. General Provisions',
    content: `11.1 Entire Agreement — These Terms, together with the booking confirmation and vehicle condition report, constitute the entire agreement between the parties and supersede all prior representations, negotiations, and understandings.

11.2 Amendments — DriveFleet may update these Terms at any time. Updated Terms will be published on this page. Continued use of DriveFleet services after publication constitutes acceptance.

11.3 Severability — If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.

11.4 Waiver — Failure by DriveFleet to enforce any right under this Agreement does not constitute a waiver of that right.

11.5 Contact — For enquiries regarding these Terms, contact: legal@drivefleet.ng or write to DriveFleet Technologies Ltd., 14 Obafemi Awolowo Way, Ikeja, Lagos State, Nigeria.

Last updated: October 2026 | Version 2.1`,
  },
];

const toc = sections.map((s) => ({ id: s.id, title: s.title }));

export function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Rental Terms & Conditions
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            These Terms and Conditions govern all vehicle rentals made through DriveFleet Technologies Ltd. Please read them carefully before confirming your booking. By completing checkout, you agree to be bound by these Terms.
          </p>
          <p className="text-xs text-slate-500 mt-4">Last updated: October 2026 &nbsp;·&nbsp; Version 2.1</p>
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
              Questions about these Terms? Contact our legal team at{' '}
              <a href="mailto:legal@drivefleet.ng" className="font-semibold underline">legal@drivefleet.ng</a>
              {' '}or visit our{' '}
              <Link to="/contact" className="font-semibold underline">Contact page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
