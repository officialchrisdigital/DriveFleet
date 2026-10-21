import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send, ChevronDown } from 'lucide-react';

const branches = [
  {
    id: 'lagos',
    name: 'Lagos Ikeja Main Hub',
    tag: 'Headquarters',
    tagColor: 'bg-blue-600 text-white',
    address: '14 Obafemi Awolowo Way, Ikeja, Lagos State, Nigeria',
    phone: '+234 801 234 5678',
    email: 'lagos@drivefleet.ng',
    whatsapp: '+234 801 234 5678',
    hours: [
      { day: 'Monday – Friday', time: '7:00 AM – 8:00 PM' },
      { day: 'Saturday',        time: '7:00 AM – 6:00 PM' },
      { day: 'Sunday',          time: '9:00 AM – 5:00 PM' },
      { day: 'Public Holidays', time: '10:00 AM – 4:00 PM' },
    ],
    mapEmbed: null,
    color: 'border-blue-500',
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 'abuja',
    name: 'Abuja Central Terminal',
    tag: 'FCT Branch',
    tagColor: 'bg-emerald-600 text-white',
    address: '3 Shehu Shagari Way, Central Business District, Abuja FCT, Nigeria',
    phone: '+234 802 987 6543',
    email: 'abuja@drivefleet.ng',
    whatsapp: '+234 802 987 6543',
    hours: [
      { day: 'Monday – Friday', time: '8:00 AM – 7:00 PM' },
      { day: 'Saturday',        time: '8:00 AM – 5:00 PM' },
      { day: 'Sunday',          time: '10:00 AM – 4:00 PM' },
      { day: 'Public Holidays', time: 'Closed' },
    ],
    mapEmbed: null,
    color: 'border-emerald-500',
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
];

const departments = [
  { label: 'General Enquiries',          email: 'hello@drivefleet.ng'       },
  { label: 'Corporate & Fleet Accounts', email: 'corporate@drivefleet.ng'   },
  { label: 'Booking Amendments',         email: 'bookings@drivefleet.ng'    },
  { label: 'Damage & Insurance Claims',  email: 'claims@drivefleet.ng'      },
  { label: 'Data & Privacy Requests',    email: 'privacy@drivefleet.ng'     },
  { label: 'Media & Partnerships',       email: 'partnerships@drivefleet.ng'},
];

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: just show success state
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Contact & Branch Directory
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Two branches. Expert staff. Fast response. Whether you have a booking question, need to
            amend a reservation, or want to talk corporate accounts — we're here.
          </p>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Our Branches</h2>
          <p className="text-slate-500 text-sm mt-2">Walk in, call, or email — we're available across both locations.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {branches.map((branch) => (
            <div key={branch.id} className={`bg-white rounded-2xl border-l-4 ${branch.color} border border-slate-200 shadow-sm overflow-hidden`}>
              <div className={`${branch.bg} px-6 py-5 flex items-start justify-between`}>
                <div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${branch.tagColor} inline-block mb-2`}>
                    {branch.tag}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">{branch.name}</h3>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${branch.accent}`} />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className={`w-4 h-4 shrink-0 ${branch.accent}`} />
                  <a href={`tel:${branch.phone}`} className={`hover:underline ${branch.accent} font-medium`}>{branch.phone}</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className={`w-4 h-4 shrink-0 ${branch.accent}`} />
                  <a href={`mailto:${branch.email}`} className={`hover:underline ${branch.accent} font-medium`}>{branch.email}</a>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className={`w-4 h-4 ${branch.accent}`} />
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Operating Hours</span>
                  </div>
                  <div className="space-y-1.5">
                    {branch.hours.map((h) => (
                      <div key={h.day} className="flex justify-between text-xs text-slate-600">
                        <span className="text-slate-500">{h.day}</span>
                        <span className={`font-medium ${h.time === 'Closed' ? 'text-red-500' : 'text-slate-700'}`}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${branch.bg} rounded-xl p-3 text-xs text-slate-600 border ${branch.color.replace('border-', 'border-').split('-')[0]}`}>
                  <strong>Note:</strong> Pickup and return appointments should be made via the booking system at least 2 hours in advance. Walk-in collections are subject to vehicle availability.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Emails */}
      <div className="bg-white border-y border-slate-200 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Department Contacts</h2>
            <p className="text-slate-500 text-sm mt-2">Route your enquiry to the right team for the fastest response.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((d) => (
              <div key={d.label} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-1">{d.label}</p>
                <a href={`mailto:${d.email}`} className="text-blue-600 text-xs font-medium hover:underline">{d.email}</a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            Response time: General enquiries within 24 hours. Booking amendments within 4 business hours.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
          <p className="text-slate-500 text-sm mt-2">Fill in the form below and we'll respond within 24 hours.</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Message Received!</h3>
            <p className="text-sm text-emerald-700">
              Thank you, <strong>{form.name}</strong>. We've received your enquiry and will respond to <strong>{form.email}</strong> within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Chukwudi Adeyemi"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="chukwudi@company.com"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a topic…</option>
                    <option>General Enquiry</option>
                    <option>Booking Amendment</option>
                    <option>Cancellation Request</option>
                    <option>Corporate Account</option>
                    <option>Damage / Insurance Claim</option>
                    <option>Data / Privacy Request</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Please describe your enquiry in detail, including your booking reference if applicable…"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
            <p className="text-center text-xs text-slate-400">
              This is a demo environment. No message is actually transmitted.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
