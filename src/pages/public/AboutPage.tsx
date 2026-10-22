import { Link } from 'react-router-dom';
import { MapPin, Users, Award, TrendingUp, ArrowRight, CheckCircle2, Phone, Mail } from 'lucide-react';

const values = [
  {
    icon: CheckCircle2,
    title: 'Transparency First',
    desc: 'Every pricing component — base rate, weekend surcharge, duration discount, promo reduction, deposit — is displayed before you confirm. We believe renters deserve the full picture.',
  },
  {
    icon: Award,
    title: 'Operational Excellence',
    desc: 'Our structured pickup and return inspection SOPs protect both the customer and the fleet. Odometer readings, fuel levels, and vehicle condition are recorded at every handover.',
  },
  {
    icon: TrendingUp,
    title: 'Technology-Driven',
    desc: 'DriveFleet\'s booking engine uses atomic database locks to guarantee availability — no overbooking, no race conditions, no double-charging. Enterprise-grade reliability for everyday renters.',
  },
  {
    icon: Users,
    title: 'Customer-Centric',
    desc: 'From the demo role-switcher that lets reviewers explore every user perspective, to our 24-hour cancellation policy, everything is built around making your experience seamless.',
  },
];

const team = [
  {
    name: 'Marcus Vance',
    role: 'Chief Executive Officer & Fleet Administrator',
    bio: 'Marcus oversees DriveFleet\'s fleet strategy, branch expansion, and pricing governance. With over 12 years in Nigerian transport logistics, he built the operational SOP framework that underpins every handover.',
    initials: 'MV',
    color: 'bg-blue-600',
  },
  {
    name: 'Amara Kalu',
    role: 'Head of Branch Operations — Lagos',
    bio: 'Amara manages day-to-day dispatch and customer handovers at the Lagos Ikeja Main Hub. Her team handles all pickup inspections, maintenance scheduling, and CRM follow-ups for the Lagos customer base.',
    initials: 'AK',
    color: 'bg-emerald-600',
  },
  {
    name: 'Ibrahim Musa',
    role: 'Senior Fleet Coordinator — Abuja',
    bio: 'Ibrahim coordinates vehicle availability, maintenance blocks, and corporate account bookings at the Abuja Central Terminal. He is the primary point of contact for government and enterprise clients in the FCT.',
    initials: 'IM',
    color: 'bg-violet-600',
  },
];

const branches = [
  {
    name: 'Lagos Ikeja Main Hub',
    address: '14 Obafemi Awolowo Way, Ikeja, Lagos State',
    phone: '+234 801 234 5678',
    email: 'lagos@drivefleet.ng',
    hours: 'Mon – Sat: 7:00 AM – 8:00 PM | Sun: 9:00 AM – 5:00 PM',
    vehicles: '8 vehicles',
    color: 'border-blue-500',
    badge: 'bg-blue-50 text-blue-700',
  },
  {
    name: 'Abuja Central Terminal',
    address: '3 Shehu Shagari Way, Central Business District, Abuja FCT',
    phone: '+234 802 987 6543',
    email: 'abuja@drivefleet.ng',
    hours: 'Mon – Sat: 8:00 AM – 7:00 PM | Sun: 10:00 AM – 4:00 PM',
    vehicles: '4 vehicles',
    color: 'border-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
];

const milestones = [
  { year: '2019', event: 'DriveFleet founded in Lagos with a fleet of 3 Economy vehicles and 1 branch.' },
  { year: '2020', event: 'Expanded to 10 vehicles across Economy, Sedan, and SUV categories; launched corporate account programme.' },
  { year: '2021', event: 'Opened Abuja Central Terminal, becoming a dual-city operation serving the Lagos–Abuja corridor.' },
  { year: '2022', event: 'Introduced the Luxury tier (Mercedes-Benz, Lexus, BMW) to serve executive and diplomatic clients.' },
  { year: '2023', event: 'Launched DriveFleet Online — the web booking platform with instant pricing and atomic availability checks.' },
  { year: '2024', event: 'Grew fleet to 15 vehicles with full maintenance scheduling, CRM integration, and operational analytics.' },
  { year: '2026', event: 'Launched DriveFleet 2.0 — full-stack fleet management with structured inspection SOPs, promo engine, and audit trail.' },
];

export function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            About DriveFleet
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            DriveFleet Technologies Ltd. is Nigeria's premier enterprise car rental and fleet management
            platform — built on transparency, operational discipline, and technology-first thinking.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white border-b border-slate-200 py-14 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Our Mission</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-4 leading-snug">
              Redefining mobility for Nigerian businesses and individuals
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm mb-4">
              We started DriveFleet because we believed the car rental experience in Nigeria deserved
              better — clearer pricing, faster handovers, and a system that protects renters and fleet
              owners equally through documented inspections and transparent billing.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Today we operate across Lagos and Abuja, serving individual customers, corporate accounts,
              and government agencies with a fleet that spans Economy hatchbacks all the way to Luxury
              executive saloons — with every booking backed by an enterprise-grade atomic availability engine.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center space-y-6">
            <div>
              <div className="text-4xl font-extrabold text-blue-700">15</div>
              <div className="text-sm text-slate-600 mt-1">Vehicles across 4 categories</div>
            </div>
            <div className="border-t border-blue-200 pt-4">
              <div className="text-4xl font-extrabold text-blue-700">2</div>
              <div className="text-sm text-slate-600 mt-1">Branch locations</div>
            </div>
            <div className="border-t border-blue-200 pt-4">
              <div className="text-4xl font-extrabold text-blue-700">7 yrs</div>
              <div className="text-sm text-slate-600 mt-1">Operating since 2019</div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Our Core Values</h2>
          <p className="text-slate-500 text-sm mt-2">The principles that guide every decision we make.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white border-y border-slate-200 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Our Journey</h2>
            <p className="text-slate-500 text-sm mt-2">Key milestones from startup to full-stack fleet management.</p>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-[19px] sm:before:left-[21px] before:w-0.5 before:bg-blue-200">
            {milestones.map((m) => (
              <div key={m.year} className="relative flex items-start gap-4 sm:gap-6">
                {/* Timeline node */}
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border-2 border-blue-600 shadow-sm shrink-0 z-10 flex items-center justify-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                </div>
                {/* Card with milestone info */}
                <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">{m.year}</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Meet the Team</h2>
          <p className="text-slate-500 text-sm mt-2">The people who keep DriveFleet running every day.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
              <div className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-sm`}>
                {member.initials}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
              <p className="text-xs text-blue-600 font-medium mt-1 mb-3">{member.role}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Branches */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Our Locations</h2>
            <p className="text-slate-400 text-sm mt-2">Two branches. Two cities. One DriveFleet experience.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {branches.map((b) => (
              <div key={b.name} className={`bg-slate-800 rounded-2xl border-l-4 ${b.color} p-6`}>
                <span className={`text-xs font-bold px-2 py-1 rounded ${b.badge} mb-3 inline-block`}>
                  {b.vehicles}
                </span>
                <h3 className="font-bold text-white text-base mb-3">{b.name}</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{b.email}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-700 mt-2">
                    <span className="text-xs text-slate-500">{b.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 py-14 px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to experience DriveFleet?</h2>
        <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">
          Browse our fleet today — transparent pricing, instant booking, and professional handover at every step.
        </p>
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
        >
          Browse the Fleet <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
