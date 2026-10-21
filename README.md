# DriveFleet — Car Rental & Fleet Management Platform

[![Status](https://img.shields.io/badge/Release-Capstone%20Ready-blue.svg)](https://github.com)
[![PRD Compliance](https://img.shields.io/badge/PRD%20Routes-48%20of%2048%20Implemented-emerald.svg)](./DriveFleet_PRD.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase%20RLS-3ecf8e.svg)](https://supabase.com)

DriveFleet is an enterprise-grade car rental and internal fleet operations web platform built for small-to-medium rental organizations operating across Lagos and Abuja, Nigeria.

The platform guarantees **atomic availability**, **deterministic quote calculations**, **immutable financial ledgers**, and **auditable handover inspections**.

---

## 🚀 Key Architectural Capabilities

### 1. Concurrency Sentinel & Atomic Fleet Locks (PRD §9.2)
- All reservations, amendments, and maintenance quarantines enforce **half-open interval checking** (`[pickup_at, return_at)`).
- Serialized execution using PostgreSQL advisory locks (`pg_advisory_xact_lock(hashtext(vehicle_id))`) prevents overlapping reservations across public customer and staff dispatch channels.
- Overdue Active rentals retain their availability lock until formally resolved by an inspection SOP.

### 2. Deterministic Pricing Engine (PRD §9.3 & §9.4)
- All monetary transactions and line items are stored as **integer minor units** (`kobo`, where 1 NGN = 100 kobo).
- Standard base daily rates automatically apply a **+10% weekend surcharge** for periods commencing on Saturday or Sunday in the `Africa/Lagos` timezone.
- Duration discount tiers: 7–29 days (10% off), 30+ days (20% off).
- Single promotional code validation applied after duration discounts, with non-negative capping on fixed vouchers.
- Produces immutable quote snapshots upon booking confirmation.

### 3. Role-Based Access Control (RBAC) & Boundary Isolation
- **Customer**: Vehicle search, transparent quote review, simulated checkout, digital QR voucher pass, and personal credential dossiers.
- **Staff**: Fleet register, handover inspections (odometer & fuel SOPs), CRM directory, and operational reports. Staff cannot access admin financial aggregates.
- **Admin**: Fleet inventory CRUD, pricing override rules, team provisioning with **Last-Admin Safeguard** (`trg_last_admin_protect`), and full activity audit ledgers.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v3, Vite, Radix UI primitives, Lucide Icons, Recharts
- **Routing**: React Router v6 (Data Router with complete 48-route inventory)
- **Database & Backend**: PostgreSQL (Supabase), Row Level Security (RLS) on all tables, PL/pgSQL advisory functions
- **Deployment**: Configured for Vercel with SPA fallback routing (`vercel.json`)

---

## 💻 Quick Start & Local Development

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### Installation & Run
```bash
# 1. Clone repository & navigate to directory
cd DriveFleet

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev

# 4. Compile production build
npm run build
```

---

## 🔑 Demo Access & Role Switching

DriveFleet includes a persistent demo banner at the top of the interface that allows reviewers to switch personas on demand without entering passwords:

| Persona | Name | Role Capabilities |
| :--- | :--- | :--- |
| **Customer** | Chukwudi Adeyemi | Self-service booking, voucher QR pass, my bookings, profile |
| **Staff** | Amara Kalu | Operations deck, vehicle handovers (pickup & return), CRM, calendar |
| **Admin** | Marcus Vance | Complete operations deck, revenue reports, pricing rules, team access |

---

## 📁 Repository Structure

```
DriveFleet/
├── supabase/
│   └── migrations/              # 14 complete PostgreSQL migrations (RLS, functions, triggers, seed)
├── src/
│   ├── components/
│   │   ├── layout/             # PublicLayout, CustomerLayout, AdminLayout
│   │   └── vehicles/           # VehicleCard, Filters, Galleries
│   ├── contexts/               # AuthContext with demo role switching
│   ├── lib/
│   │   ├── types.ts            # Strict TypeScript interfaces
│   │   ├── constants.ts        # Route inventory & design tokens
│   │   ├── formatters.ts       # Currency (NGN) & Lagos date formatting
│   │   ├── pricing-engine.ts   # PRD §9.3 & §9.4 pricing engine
│   │   └── availability.ts     # Half-open interval conflict checks
│   ├── pages/
│   │   ├── public/             # Homepage, Vehicles, Detail, Content
│   │   ├── booking/            # Wizard, Checkout Simulator, Confirmation
│   │   ├── account/            # Overview, My Bookings, Profile Vault
│   │   ├── admin/              # Command Center, Fleet Register, Calendar, Handovers, CRM, Maintenance, Reports
│   │   └── system/             # 403 Access Denied, 404 Not Found
│   └── App.tsx                 # 48-route master router
├── package.json
└── vercel.json                 # Vercel deployment rewrite rules
```

---

## 📜 Compliance & Acceptance Verification

| PRD Scenario | Target | Status |
| :--- | :--- | :--- |
| **UAT-01** | Guest searches, registers/logs in, completes demo reservation | ✅ Verified |
| **UAT-02** | Atomic overlap conflict rejection under concurrency | ✅ Verified |
| **UAT-03** | Pricing rules, +10% weekend surcharge, duration discounts, promo limits | ✅ Verified |
| **UAT-04** | 24h cancellation window & amendment availability recheck | ✅ Verified |
| **UAT-05** | Handover pickup & return with non-decreasing odometer monotonicity | ✅ Verified |
| **UAT-06** | Unsafe return auto-quarantine into maintenance availability block | ✅ Verified |
| **UAT-07** | Admin fleet CRUD & staff permission gating | ✅ Verified |
| **UAT-08** | Last-admin protection trigger & private notes isolation | ✅ Verified |
| **UAT-09** | Report reconciliation & PRD §10 utilization ratio | ✅ Verified |
| **UAT-10** | 48 of 48 product routes usable at 375px, 768px, and 1440px | ✅ Verified |

---

© 2026 DriveFleet Technologies Ltd. Capstone Demonstration Release.
