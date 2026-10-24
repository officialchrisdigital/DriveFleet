import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Vehicle, Booking, CrmCustomer, MaintenanceTask,
  VehicleOperationalState, BookingStatus, AuditLogEntry
} from '@/lib/types';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import {
  CustomerBooking,
  CHUKWUDI_INITIAL_BOOKINGS,
  updateCustomerBookingStatus,
  addUserBooking,
  toCustomerBookingStatus,
} from '@/lib/userBookings';

export interface PromoItem {
  code: string;
  name: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minDurationDays: number;
  active: boolean;
  usageCount: number;
  expiresAt: string;
}

export interface PricingOverrideItem {
  id: string;
  name: string;
  scope: 'global' | 'category' | 'vehicle';
  targetId?: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  flatRateMinor?: number;
  reason: string;
}

export interface TeamMemberItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'staff';
  phone?: string;
  branch: string;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface OperationsContextType {
  vehicles: Vehicle[];
  customers: CrmCustomer[];
  bookings: Booking[];
  maintenanceTasks: MaintenanceTask[];
  promos: PromoItem[];
  pricingOverrides: PricingOverrideItem[];
  teamMembers: TeamMemberItem[];

  // Vehicle Actions
  addVehicle: (vehicleData: Partial<Vehicle>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Customer Actions
  addCustomer: (customerData: Partial<CrmCustomer>) => CrmCustomer;
  updateCustomer: (id: string, updates: Partial<CrmCustomer>) => void;

  // Booking Actions
  addBooking: (bookingData: Partial<Booking>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string, reason?: string) => void;

  // Maintenance Actions
  addMaintenanceTask: (taskData: Partial<MaintenanceTask>) => MaintenanceTask;
  updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>) => void;
  completeMaintenanceTask: (id: string) => void;

  // Promo Actions
  addPromo: (promo: Omit<PromoItem, 'usageCount'>) => void;
  togglePromo: (code: string) => void;

  // Pricing Actions
  addPricingOverride: (override: Omit<PricingOverrideItem, 'id'>) => void;

  // Team Actions
  addTeamMember: (member: Omit<TeamMemberItem, 'id' | 'createdAt'> & { password?: string }) => void;
  toggleTeamMember: (id: string) => void;

  // Audit Actions
  auditLogs: AuditLogEntry[];
  logAuditEvent: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Conflict Checking
  checkAvailability: (
    vehicleId: string,
    pickupAt: string,
    returnAt: string,
    excludeBookingId?: string
  ) => { available: boolean; conflictReason?: string };
}

const STORAGE_KEYS = {
  VEHICLES: 'drivefleet_vehicles',
  CUSTOMERS: 'drivefleet_customers',
  BOOKINGS: 'drivefleet_bookings',
  MAINTENANCE: 'drivefleet_maintenance',
  PROMOS: 'drivefleet_promos',
  PRICING: 'drivefleet_pricing_overrides',
  TEAM: 'drivefleet_team_members',
  REGISTERED_USERS: 'drivefleet_registered_users',
  AUDIT: 'drivefleet_audit_logs',
};

const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    actor: 'Marcus Vance (ADMIN)',
    action: 'BOOKING_COMMITTED',
    entity: 'Booking #DF-2026-9812',
    reason: 'Customer completed simulated atomic checkout',
    timestamp: 'Today @ 10:14:02 AM',
    type: 'booking',
  },
  {
    id: 'aud-002',
    actor: 'Amara Kalu (STAFF)',
    action: 'MAINTENANCE_QUARANTINE_LOCKED',
    entity: 'Vehicle LAG-330-MT (Kia Rio)',
    reason: 'Brake pads worn past threshold. Availability blocked.',
    timestamp: 'Yesterday @ 03:22:15 PM',
    type: 'maintenance',
  },
  {
    id: 'aud-003',
    actor: 'Marcus Vance (ADMIN)',
    action: 'RATE_OVERRIDE_CREATED',
    entity: 'Override: Diplomatic Prado Weekend Peak',
    reason: 'Peak holiday demand rate adjustment',
    timestamp: 'Oct 19, 2026 @ 11:05:40 AM',
    type: 'pricing',
  },
  {
    id: 'aud-004',
    actor: 'System Sentinel',
    action: 'CONCURRENCY_COLLISION_PREVENTED',
    entity: 'Vehicle LAG-802-AB (Toyota RAV4)',
    reason: 'Rejected concurrent conflicting interval attempt during checkout race',
    timestamp: 'Oct 18, 2026 @ 02:40:19 PM',
    type: 'system',
  },
  {
    id: 'aud-005',
    actor: 'Marcus Vance (ADMIN)',
    action: 'RETURN_INSPECTION_RECORDED',
    entity: 'Booking #DF-2026-7814',
    reason: 'Return odometer logged (18,420 km). 0 defects.',
    timestamp: 'Sep 15, 2026 @ 10:00:00 AM',
    type: 'inspection',
  },
];

const SEED_CUSTOMERS: CrmCustomer[] = [
  {
    id: 'c-adeyemi',
    firstName: 'Chukwudi',
    lastName: 'Adeyemi',
    company: 'Enterprise Dynamics Lagos',
    email: 'chukwudi@drivefleet.demo',
    phone: '+234 803 555 0192',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    rentalsCount: 6,
    notesCount: 2,
    createdBy: 'system',
    createdAt: '2026-01-10T09:00:00Z',
    renterDetails: {
      licenseNumber: 'FRSC-LAG-8492018B',
      licenseExpiry: '24 Aug 2028',
      verifiedOnline: true,
    },
  },
  {
    id: 'n-eze',
    firstName: 'Dr. Ngozi',
    lastName: 'Eze',
    company: 'Abuja Medical Consult',
    email: 'ngozi.eze@abuja-health.gov.ng',
    phone: '+234 802 333 4455',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    rentalsCount: 3,
    notesCount: 1,
    createdBy: 'system',
    createdAt: '2026-02-14T11:30:00Z',
    renterDetails: {
      licenseNumber: 'FRSC-ABJ-3192020A',
      licenseExpiry: '15 May 2027',
      verifiedOnline: true,
    },
  },
  {
    id: 't-mansoor',
    firstName: 'Tariq',
    lastName: 'Al-Mansoor',
    company: 'Diplomatic Mission Trade Office',
    email: 't.mansoor@trade-diplomatic.org',
    phone: '+234 809 111 8899',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    status: 'vip',
    rentalsCount: 8,
    notesCount: 4,
    createdBy: 'system',
    createdAt: '2026-01-20T14:15:00Z',
    renterDetails: {
      licenseNumber: 'INTL-PERMIT-DXB-902',
      licenseExpiry: '10 Nov 2029',
      verifiedOnline: true,
    },
  },
  {
    id: 'c-okonkwo',
    firstName: 'Chidi',
    lastName: 'Okonkwo',
    company: 'Okonkwo & Sons Logistics',
    email: 'chidi@okonkwo-logistics.com',
    phone: '+234 805 777 9900',
    avatarUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=400',
    status: 'flagged',
    rentalsCount: 4,
    notesCount: 3,
    createdBy: 'system',
    createdAt: '2026-03-01T08:45:00Z',
    renterDetails: {
      licenseNumber: 'FRSC-LAG-1102948C',
      licenseExpiry: '04 Jan 2026',
      verifiedOnline: false,
    },
  },
];

const SEED_BOOKINGS: Booking[] = [
  {
    id: 'b-9812',
    reference: 'DF-2026-9812',
    customerId: 'c-adeyemi',
    vehicleId: 'rav4-802',
    branchId: 'b0000000-0000-0000-0000-000000000001',
    pickupAt: '2026-10-23T10:00:00Z',
    returnAt: '2026-10-26T10:00:00Z',
    status: 'confirmed',
    sourceChannel: 'customer',
    currentVersion: 1,
    createdAt: '2026-10-22T08:30:00Z',
    quote: {
      billedPeriods: 3,
      lineItems: [],
      subtotalMinor: 12960000,
      durationTier: null,
      durationDiscountPercent: 0,
      durationDiscountMinor: 0,
      afterDurationMinor: 12960000,
      promoDiscountMinor: 0,
      afterPromoMinor: 12960000,
      feesMinor: 0,
      depositMinor: 5000000,
      totalMinor: 12960000,
      currency: 'NGN',
    },
  },
  {
    id: 'b-7814',
    reference: 'DF-2026-7814',
    customerId: 'c-adeyemi',
    vehicleId: 'camry-104',
    branchId: 'b0000000-0000-0000-0000-000000000001',
    pickupAt: '2026-09-12T10:00:00Z',
    returnAt: '2026-09-15T10:00:00Z',
    status: 'completed',
    sourceChannel: 'customer',
    currentVersion: 1,
    createdAt: '2026-09-10T11:00:00Z',
    quote: {
      billedPeriods: 3,
      lineItems: [],
      subtotalMinor: 9450000,
      durationTier: null,
      durationDiscountPercent: 0,
      durationDiscountMinor: 0,
      afterDurationMinor: 9450000,
      promoDiscountMinor: 0,
      afterPromoMinor: 9450000,
      feesMinor: 0,
      depositMinor: 5000000,
      totalMinor: 9450000,
      currency: 'NGN',
    },
  },
  {
    id: 'b-6102',
    reference: 'DF-2026-6102',
    customerId: 'c-adeyemi',
    vehicleId: 'c300-129',
    branchId: 'b0000000-0000-0000-0000-000000000001',
    pickupAt: '2026-07-04T10:00:00Z',
    returnAt: '2026-07-06T10:00:00Z',
    status: 'completed',
    sourceChannel: 'customer',
    currentVersion: 1,
    createdAt: '2026-07-01T09:15:00Z',
    quote: {
      billedPeriods: 2,
      lineItems: [],
      subtotalMinor: 17100000,
      durationTier: null,
      durationDiscountPercent: 0,
      durationDiscountMinor: 0,
      afterDurationMinor: 17100000,
      promoDiscountMinor: 0,
      afterPromoMinor: 17100000,
      feesMinor: 0,
      depositMinor: 10000000,
      totalMinor: 17100000,
      currency: 'NGN',
    },
  },
  {
    id: 'b-5520',
    reference: 'DF-2026-5520',
    customerId: 'c-adeyemi',
    vehicleId: 'tucson-218',
    branchId: 'b0000000-0000-0000-0000-000000000002',
    pickupAt: '2026-05-18T10:00:00Z',
    returnAt: '2026-05-21T10:00:00Z',
    status: 'cancelled',
    sourceChannel: 'customer',
    currentVersion: 1,
    createdAt: '2026-05-12T14:00:00Z',
    quote: {
      billedPeriods: 3,
      lineItems: [],
      subtotalMinor: 14500000,
      durationTier: null,
      durationDiscountPercent: 0,
      durationDiscountMinor: 0,
      afterDurationMinor: 14500000,
      promoDiscountMinor: 0,
      afterPromoMinor: 14500000,
      feesMinor: 0,
      depositMinor: 5000000,
      totalMinor: 14500000,
      currency: 'NGN',
    },
  },
  {
    id: 'b-3829',
    reference: 'DF-2026-3829',
    customerId: 'c-okonkwo',
    vehicleId: 'camry-104',
    branchId: 'b0000000-0000-0000-0000-000000000001',
    pickupAt: '2026-10-22T10:00:00Z',
    returnAt: '2026-10-24T10:00:00Z',
    status: 'active',
    sourceChannel: 'staff',
    currentVersion: 1,
    createdAt: '2026-10-21T15:20:00Z',
    quote: {
      billedPeriods: 2,
      lineItems: [],
      subtotalMinor: 9600000,
      durationTier: null,
      durationDiscountPercent: 0,
      durationDiscountMinor: 0,
      afterDurationMinor: 9600000,
      promoDiscountMinor: 0,
      afterPromoMinor: 9600000,
      feesMinor: 0,
      depositMinor: 5000000,
      totalMinor: 14600000,
      currency: 'NGN',
    },
  },
  {
    id: 'b-1044',
    reference: 'DF-2026-1044',
    customerId: 'n-eze',
    vehicleId: 'prado-401',
    branchId: 'b0000000-0000-0000-0000-000000000002',
    pickupAt: '2026-10-26T08:00:00Z',
    returnAt: '2026-10-29T17:00:00Z',
    status: 'confirmed',
    sourceChannel: 'staff',
    currentVersion: 1,
    createdAt: '2026-10-23T11:00:00Z',
    quote: {
      billedPeriods: 3,
      lineItems: [],
      subtotalMinor: 15000000,
      durationTier: null,
      durationDiscountPercent: 0,
      durationDiscountMinor: 0,
      afterDurationMinor: 15000000,
      promoDiscountMinor: 0,
      afterPromoMinor: 15000000,
      feesMinor: 0,
      depositMinor: 5000000,
      totalMinor: 20000000,
      currency: 'NGN',
    },
  },
  {
    id: 'b-7731',
    reference: 'DF-2026-7731',
    customerId: 't-mansoor',
    vehicleId: 'c300-129',
    branchId: 'b0000000-0000-0000-0000-000000000001',
    pickupAt: '2026-10-15T09:00:00Z',
    returnAt: '2026-10-18T18:00:00Z',
    status: 'completed',
    sourceChannel: 'customer',
    currentVersion: 1,
    createdAt: '2026-10-14T10:00:00Z',
    quote: {
      billedPeriods: 3,
      lineItems: [],
      subtotalMinor: 32000000,
      durationTier: null,
      durationDiscountPercent: 0,
      durationDiscountMinor: 0,
      afterDurationMinor: 32000000,
      promoDiscountMinor: 0,
      afterPromoMinor: 32000000,
      feesMinor: 0,
      depositMinor: 10000000,
      totalMinor: 42000000,
      currency: 'NGN',
    },
  },
];

const SEED_MAINTENANCE: MaintenanceTask[] = [
  {
    id: 'm-rio-brake',
    vehicleId: 'rio-330',
    taskType: 'Brake Pads & Rotor Overhaul',
    reason: 'Brake lining wear threshold reached during 50,000 km audit',
    priority: 'urgent',
    status: 'in_progress',
    assigneeName: 'Babatunde Ade (Master Tech)',
    scheduledStart: '2026-10-23T08:00:00Z',
    scheduledEnd: '2026-10-26T18:00:00Z',
    estimatedCostMinor: 8500000, // NGN 85,000
    blocksAvailability: true,
    createdBy: 'amara@drivefleet.demo',
    createdAt: '2026-10-22T08:00:00Z',
  },
  {
    id: 'm-camry-40k',
    vehicleId: 'camry-104',
    taskType: '40,000 km Scheduled Factory Service',
    reason: 'Telemetry threshold approaching (39,850 km current)',
    priority: 'high',
    status: 'scheduled',
    assigneeName: 'Amara Kalu (Fleet Lead)',
    scheduledStart: '2026-10-28T09:00:00Z',
    scheduledEnd: '2026-10-29T17:00:00Z',
    estimatedCostMinor: 4500000, // NGN 45,000
    blocksAvailability: true,
    createdBy: 'amara@drivefleet.demo',
    createdAt: '2026-10-22T09:30:00Z',
  },
  {
    id: 'm-c300-detail',
    vehicleId: 'c300-992',
    taskType: 'Executive Ceramic Coating & Detailing',
    reason: 'VIP Diplomatic Escort Preparation',
    priority: 'low',
    status: 'completed',
    assigneeName: 'Marcus Vance',
    scheduledStart: '2026-10-15T08:00:00Z',
    scheduledEnd: '2026-10-16T16:00:00Z',
    estimatedCostMinor: 6000000,
    actualCostMinor: 5800000,
    blocksAvailability: false,
    createdBy: 'marcus@drivefleet.demo',
    createdAt: '2026-10-14T08:00:00Z',
  },
];

const SEED_PROMOS: PromoItem[] = [
  {
    code: 'DRIVE2026',
    name: 'New Year DriveFleet Launch Special',
    discountType: 'percentage',
    discountValue: 10,
    minDurationDays: 2,
    active: true,
    usageCount: 42,
    expiresAt: '2026-12-31',
  },
  {
    code: 'ABUJAEXP',
    name: 'FCT Diplomatic & Enterprise Rebate',
    discountType: 'percentage',
    discountValue: 15,
    minDurationDays: 3,
    active: true,
    usageCount: 18,
    expiresAt: '2026-11-30',
  },
  {
    code: 'WEEKEND20',
    name: 'Weekend Getaway Flat Deduction',
    discountType: 'flat',
    discountValue: 20000, // NGN 20,000
    minDurationDays: 2,
    active: true,
    usageCount: 29,
    expiresAt: '2026-12-15',
  },
];

const SEED_PRICING_OVERRIDES: PricingOverrideItem[] = [
  {
    id: 'po-dec-holiday',
    name: 'December Peak Festive Holiday Surcharge',
    scope: 'global',
    startDate: '2026-12-15',
    endDate: '2027-01-08',
    multiplier: 1.25,
    reason: 'Annual national transport demand surge across Lagos and Abuja corridors',
  },
  {
    id: 'po-independence',
    name: 'National Independence Long Weekend',
    scope: 'category',
    targetId: 'luxury',
    startDate: '2026-10-01',
    endDate: '2026-10-04',
    multiplier: 1.15,
    reason: 'Executive escort high demand block',
  },
];

const SEED_TEAM: TeamMemberItem[] = [
  {
    id: 'tm-1',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus@drivefleet.demo',
    role: 'admin',
    phone: '+234 809 999 8877',
    branch: 'All Branches (HQ)',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=400',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'tm-2',
    firstName: 'Amara',
    lastName: 'Kalu',
    email: 'amara@drivefleet.demo',
    role: 'staff',
    phone: '+234 802 111 2233',
    branch: 'Lagos Ikeja Main Hub',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'tm-3',
    firstName: 'Ibrahim',
    lastName: 'Musa',
    email: 'ibrahim@drivefleet.demo',
    role: 'staff',
    phone: '+234 802 987 6543',
    branch: 'Abuja Central Terminal',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=400',
    createdAt: '2026-02-10T08:00:00Z',
  },
];

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export function OperationsProvider({ children }: { children: ReactNode }) {
  // 1. Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_VEHICLES;
  });

  // 2. Customers
  const [customers, setCustomers] = useState<CrmCustomer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_CUSTOMERS;
  });

  // 3. Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    let list = SEED_BOOKINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Merge saved bookings with SEED_BOOKINGS so none of the initial seed bookings are lost
          const seen = new Set(parsed.map((b: Booking) => b.reference || b.id));
          const missingSeeds = SEED_BOOKINGS.filter((sb) => !seen.has(sb.reference) && !seen.has(sb.id));
          list = [...parsed, ...missingSeeds];
        }
      }
    } catch {}
    return list;
  });

  // 4. Maintenance
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_MAINTENANCE;
  });

  // 5. Promos
  const [promos, setPromos] = useState<PromoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMOS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_PROMOS;
  });

  // 6. Pricing Overrides
  const [pricingOverrides, setPricingOverrides] = useState<PricingOverrideItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_PRICING_OVERRIDES;
  });

  // 7. Team
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>(() => {
    let initialTeam = SEED_TEAM;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (saved) initialTeam = JSON.parse(saved);
    } catch {}

    // Merge any user overrides so custom profile uploads reflect immediately
    try {
      const overridesStr = localStorage.getItem('drivefleet_user_overrides');
      if (overridesStr) {
        const overrides = JSON.parse(overridesStr);
        initialTeam = initialTeam.map((tm) => {
          const ov = overrides[tm.id] || overrides[tm.email.toLowerCase()];
          if (ov && ov.avatarUrl) {
            return { ...tm, avatarUrl: ov.avatarUrl };
          }
          return tm;
        });
      }
    } catch {}

    return initialTeam;
  });

  // 8. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_AUDIT_LOGS;
  });

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceTasks));
  }, [maintenanceTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricingOverrides));
  }, [pricingOverrides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAuditEvent = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: `${timeStr} (${dateStr})`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // AUTO-SYNC: Watch profile updates, user registrations, and storage events to keep CRM customers and Team Members in sync
  useEffect(() => {
    const syncAllProfiles = () => {
      try {
        // 1. Sync Team Members from overrides
        const overridesStr = localStorage.getItem('drivefleet_user_overrides');
        if (overridesStr) {
          const overrides = JSON.parse(overridesStr);
          setTeamMembers((prevTeam) => {
            let changed = false;
            const updated = prevTeam.map((tm) => {
              const ov = overrides[tm.id] || overrides[tm.email.toLowerCase()];
              if (ov && ov.avatarUrl && ov.avatarUrl !== tm.avatarUrl) {
                changed = true;
                return { ...tm, avatarUrl: ov.avatarUrl };
              }
              return tm;
            });
            return changed ? updated : prevTeam;
          });
        }

        // 2. Sync Registered Users into Customer CRM
        const storedUsers = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
        if (storedUsers) {
          const registered = JSON.parse(storedUsers);
          if (Array.isArray(registered)) {
            setCustomers((prevCustomers) => {
              let updated = [...prevCustomers];
              let changed = false;

              for (const item of registered) {
                const u = item.user;
                if (!u || !u.email) continue;

                const existingIdx = updated.findIndex(
                  (c) => c.id === u.id || (c.email && c.email.toLowerCase() === u.email.toLowerCase())
                );

                if (existingIdx === -1) {
                  // Add new customer from registration
                  updated.unshift({
                    id: u.id || `crm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    firstName: u.firstName || 'New',
                    lastName: u.lastName || 'Customer',
                    company: 'Direct Consumer',
                    email: u.email,
                    phone: u.phone || '+234 800 000 0000',
                    avatarUrl: u.avatarUrl,
                    status: 'active',
                    rentalsCount: 0,
                    notesCount: 0,
                    createdBy: 'self-registered',
                    createdAt: u.createdAt || new Date().toISOString(),
                    renterDetails: item.renterDetails || {
                      licenseNumber: 'Self-Registered Verification Pending',
                      verifiedOnline: false,
                    },
                  });
                  changed = true;
                } else {
                  // If customer uploaded a new avatar in their profile, override the CRM avatar
                  const current = updated[existingIdx];
                  if (u.avatarUrl && u.avatarUrl !== current.avatarUrl) {
                    updated[existingIdx] = { ...current, avatarUrl: u.avatarUrl };
                    changed = true;
                  }
                }
              }

              return changed ? updated : prevCustomers;
            });
          }
        }
      } catch (err) {
        console.warn('Profile sync error:', err);
      }
    };

    const syncCustomerBookings = () => {
      try {
        // Ensure Chukwudi's default bookings exist in storage if not yet set
        const chukwudiKey = 'drivefleet_user_bookings_chukwudi@drivefleet.demo';
        if (!localStorage.getItem(chukwudiKey)) {
          localStorage.setItem(chukwudiKey, JSON.stringify(CHUKWUDI_INITIAL_BOOKINGS));
        }

        // Iterate all user booking keys in localStorage
        const userBookingKeys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('drivefleet_user_bookings_')) {
            userBookingKeys.push(k);
          }
        }

        setBookings((prevBookings) => {
          let updated = [...prevBookings];
          let changed = false;

          for (const key of userBookingKeys) {
            const email = key.replace('drivefleet_user_bookings_', '').toLowerCase();
            const stored = localStorage.getItem(key);
            if (!stored) continue;

            let customerBookings: CustomerBooking[] = [];
            try {
              customerBookings = JSON.parse(stored);
            } catch {
              continue;
            }

            if (!Array.isArray(customerBookings)) continue;

            // Match customer
            const customer = customers.find(
              (c) =>
                c.email?.toLowerCase() === email ||
                (email === 'chukwudi@drivefleet.demo' && c.id === 'c-adeyemi')
            );
            const customerId = customer?.id || (email === 'chukwudi@drivefleet.demo' ? 'c-adeyemi' : `crm-${email}`);

            for (const cb of customerBookings) {
              const existingIdx = updated.findIndex(
                (b) => b.reference === cb.id || b.id === cb.id || b.id === `b-${cb.id}`
              );

              if (existingIdx === -1) {
                // Determine matching vehicle
                const matchedVehicle =
                  vehicles.find(
                    (v) =>
                      (cb.plate && v.plate?.toUpperCase() === cb.plate?.toUpperCase()) ||
                      (cb.vehicle && `${v.make} ${v.model}`.toLowerCase().includes(cb.vehicle.toLowerCase().split(' ')[1] || ''))
                  ) ||
                  vehicles.find((v) => v.category === cb.category) ||
                  vehicles[0];

                const branchId = cb.hub?.toLowerCase().includes('abuja')
                  ? 'b0000000-0000-0000-0000-000000000002'
                  : 'b0000000-0000-0000-0000-000000000001';

                const newOpBooking: Booking = {
                  id: `b-${cb.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                  reference: cb.id,
                  customerId,
                  vehicleId: matchedVehicle.id,
                  branchId,
                  pickupAt: cb.pickupAt || new Date().toISOString(),
                  returnAt: cb.returnAt || new Date(Date.now() + 3 * 86400000).toISOString(),
                  status: cb.status,
                  sourceChannel: 'customer',
                  currentVersion: 1,
                  createdAt: cb.pickupAt || new Date().toISOString(),
                  quote: {
                    billedPeriods: 3,
                    lineItems: [],
                    subtotalMinor: cb.amountMinor || 10000000,
                    durationTier: null,
                    durationDiscountPercent: 0,
                    durationDiscountMinor: 0,
                    afterDurationMinor: cb.amountMinor || 10000000,
                    promoDiscountMinor: 0,
                    afterPromoMinor: cb.amountMinor || 10000000,
                    feesMinor: 0,
                    depositMinor: 5000000,
                    totalMinor: cb.amountMinor || 10000000,
                    currency: 'NGN',
                  },
                };
                updated.push(newOpBooking);
                changed = true;
              } else {
                // If status changed in customer booking (e.g. cancelled by customer)
                if (updated[existingIdx].status !== cb.status) {
                  updated[existingIdx] = {
                    ...updated[existingIdx],
                    status: cb.status,
                    updatedAt: new Date().toISOString(),
                  };
                  changed = true;
                }
              }
            }
          }

          return changed ? updated : prevBookings;
        });
      } catch (err) {
        console.warn('Customer bookings sync error:', err);
      }
    };

    const handleSyncAll = () => {
      syncAllProfiles();
      syncCustomerBookings();
    };

    handleSyncAll();
    window.addEventListener('storage', handleSyncAll);
    window.addEventListener('drivefleet_profile_sync', handleSyncAll as EventListener);
    window.addEventListener('drivefleet_booking_sync', handleSyncAll as EventListener);
    return () => {
      window.removeEventListener('storage', handleSyncAll);
      window.removeEventListener('drivefleet_profile_sync', handleSyncAll as EventListener);
      window.removeEventListener('drivefleet_booking_sync', handleSyncAll as EventListener);
    };
  }, [customers, vehicles]);

  // Conflict Checking Engine
  const checkAvailability = (
    vehicleId: string,
    pickupAt: string,
    returnAt: string,
    excludeBookingId?: string
  ): { available: boolean; conflictReason?: string } => {
    const pTime = new Date(pickupAt).getTime();
    const rTime = new Date(returnAt).getTime();

    if (isNaN(pTime) || isNaN(rTime) || pTime >= rTime) {
      return { available: false, conflictReason: 'Invalid rental date range selected.' };
    }

    // 1. Check vehicle operational state
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      return { available: false, conflictReason: 'Vehicle not found in inventory.' };
    }
    if (vehicle.operationalState === 'out_of_service') {
      return { available: false, conflictReason: 'Vehicle is currently Out of Service.' };
    }

    // 2. Check maintenance blocks
    const maintConflict = maintenanceTasks.find((m) => {
      if (m.vehicleId !== vehicleId || m.status === 'completed' || m.status === 'cancelled') {
        return false;
      }
      if (!m.blocksAvailability || !m.scheduledStart || !m.scheduledEnd) return false;
      const mStart = new Date(m.scheduledStart).getTime();
      const mEnd = new Date(m.scheduledEnd).getTime();
      return pTime < mEnd && rTime > mStart;
    });

    if (maintConflict) {
      return {
        available: false,
        conflictReason: `Vehicle has a scheduled maintenance block (${maintConflict.taskType}) during this period.`,
      };
    }

    // 3. Check overlapping bookings
    const bookingConflict = bookings.find((b) => {
      if (b.id === excludeBookingId) return false;
      if (b.vehicleId !== vehicleId) return false;
      if (b.status === 'cancelled' || b.status === 'completed') return false;
      const bStart = new Date(b.pickupAt).getTime();
      const bEnd = new Date(b.returnAt).getTime();
      return pTime < bEnd && rTime > bStart;
    });

    if (bookingConflict) {
      return {
        available: false,
        conflictReason: `Vehicle is already reserved on booking #${bookingConflict.reference} during this period.`,
      };
    }

    return { available: true };
  };

  // Vehicle Methods
  const addVehicle = (vehicleData: Partial<Vehicle>): Vehicle => {
    const rawPlate = vehicleData.plate?.toUpperCase() || 'LAG-100-DF';
    const newVehicle: Vehicle = {
      id: vehicleData.id || `veh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      branchId: vehicleData.branchId || 'b0000000-0000-0000-0000-000000000001',
      branch: vehicleData.branch || {
        id: vehicleData.branchId || 'b0000000-0000-0000-0000-000000000001',
        orgId: 'org-001',
        name: vehicleData.branchId?.includes('2') ? 'Abuja Central Terminal' : 'Lagos Ikeja Main Hub',
        city: vehicleData.branchId?.includes('2') ? 'Abuja' : 'Lagos',
        active: true,
        createdAt: new Date().toISOString(),
      },
      make: vehicleData.make || 'Toyota',
      model: vehicleData.model || 'Corolla',
      year: vehicleData.year || 2024,
      plate: rawPlate,
      plateNormalized: rawPlate.replace(/[^A-Z0-9]/g, ''),
      category: vehicleData.category || 'sedan',
      seats: vehicleData.seats || 5,
      transmission: vehicleData.transmission || 'automatic',
      fuelType: vehicleData.fuelType || 'petrol',
      baseRateMinor: vehicleData.baseRateMinor || 4500000,
      mileageAllowanceKm: vehicleData.mileageAllowanceKm || 200,
      currentOdometerKm: vehicleData.currentOdometerKm || 12000,
      operationalState: vehicleData.operationalState || 'ready',
      archived: false,
      serviceThresholds: vehicleData.serviceThresholds || { intervalKm: 10000 },
      images: vehicleData.images?.length
        ? vehicleData.images
        : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'],
      createdBy: vehicleData.createdBy || 'operations',
      createdByName: vehicleData.createdByName || 'Fleet Operations',
      createdAt: new Date().toISOString(),
    };

    setVehicles((prev) => [newVehicle, ...prev]);

    logAuditEvent({
      actor: newVehicle.createdByName || 'Fleet Manager',
      action: 'VEHICLE_REGISTERED',
      entity: `${newVehicle.make} ${newVehicle.model} [${newVehicle.plate}]`,
      reason: `New ${newVehicle.category.toUpperCase()} unit registered at ${newVehicle.branch?.name || 'Hub'}`,
      type: 'vehicle',
    });

    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    let vehDesc = id;
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          vehDesc = `${v.make} ${v.model} [${v.plate}]`;
          return { ...v, ...updates, updatedAt: new Date().toISOString() };
        }
        return v;
      })
    );

    logAuditEvent({
      actor: 'Fleet Manager',
      action: 'VEHICLE_UPDATED',
      entity: `Vehicle ${vehDesc}`,
      reason: updates.operationalState ? `Operational state set to ${updates.operationalState}` : 'Vehicle telemetry and specifications amended',
      type: 'vehicle',
    });
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Customer Methods
  const addCustomer = (customerData: Partial<CrmCustomer>): CrmCustomer => {
    const newCustomer: CrmCustomer = {
      id: customerData.id || `crm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      firstName: customerData.firstName || 'Anonymous',
      lastName: customerData.lastName || 'Client',
      company: customerData.company || 'Private Customer',
      email: customerData.email || `client-${Date.now()}@example.com`,
      phone: customerData.phone || '+234 800 000 0000',
      avatarUrl: customerData.avatarUrl,
      status: customerData.status || 'active',
      rentalsCount: 0,
      notesCount: customerData.notes?.length || 0,
      notes: customerData.notes || [],
      createdBy: customerData.createdBy || 'staff',
      createdByName: customerData.createdByName || 'Duty Officer',
      createdAt: new Date().toISOString(),
      renterDetails: customerData.renterDetails || {
        licenseNumber: 'FRSC-PENDING',
        verifiedOnline: true,
      },
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    // Provision into authenticated accounts registry so customer can log in
    if (newCustomer.email) {
      try {
        const cleanEmail = newCustomer.email.toLowerCase();
        const registeredStr = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
        const registered = registeredStr ? JSON.parse(registeredStr) : [];
        if (!registered.some((r: any) => r.user?.email?.toLowerCase() === cleanEmail)) {
          registered.push({
            user: {
              id: newCustomer.id,
              email: cleanEmail,
              role: 'customer',
              firstName: newCustomer.firstName,
              lastName: newCustomer.lastName,
              phone: newCustomer.phone,
              avatarUrl: newCustomer.avatarUrl,
              active: true,
              createdAt: newCustomer.createdAt,
            },
            password: 'Customer@DriveFleet2026!',
            renterDetails: newCustomer.renterDetails,
          });
          localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));
          window.dispatchEvent(new CustomEvent('drivefleet_profile_sync'));
        }
      } catch (err) {
        console.warn('Customer auth registration error:', err);
      }
    }

    // If admin/staff uploaded an avatar for this customer, sync to overrides & registered accounts
    if (newCustomer.avatarUrl && newCustomer.email) {
      try {
        const cleanEmail = newCustomer.email.toLowerCase();
        const overridesStr = localStorage.getItem('drivefleet_user_overrides');
        const overrides = overridesStr ? JSON.parse(overridesStr) : {};
        overrides[cleanEmail] = { ...(overrides[cleanEmail] || {}), avatarUrl: newCustomer.avatarUrl };
        overrides[newCustomer.id] = { ...(overrides[newCustomer.id] || {}), avatarUrl: newCustomer.avatarUrl };
        localStorage.setItem('drivefleet_user_overrides', JSON.stringify(overrides));
      } catch {}
    }

    logAuditEvent({
      actor: newCustomer.createdByName || 'Staff Officer',
      action: 'CUSTOMER_CRM_PROVISIONED',
      entity: `Customer ${newCustomer.firstName} ${newCustomer.lastName}`,
      reason: `Client account created with verified license ${newCustomer.renterDetails?.licenseNumber || 'N/A'}`,
      type: 'customer',
    });

    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<CrmCustomer>) => {
    let targetEmail: string | undefined;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates, updatedAt: new Date().toISOString() };
          targetEmail = updated.email;
          return updated;
        }
        return c;
      })
    );

    // Sync avatar to registered storefront accounts & active session
    if (updates.avatarUrl && targetEmail) {
      const cleanEmail = targetEmail.toLowerCase();
      try {
        const overridesStr = localStorage.getItem('drivefleet_user_overrides');
        const overrides = overridesStr ? JSON.parse(overridesStr) : {};
        overrides[cleanEmail] = { ...(overrides[cleanEmail] || {}), avatarUrl: updates.avatarUrl };
        overrides[id] = { ...(overrides[id] || {}), avatarUrl: updates.avatarUrl };
        localStorage.setItem('drivefleet_user_overrides', JSON.stringify(overrides));

        const registeredStr = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
        if (registeredStr) {
          const registered = JSON.parse(registeredStr);
          if (Array.isArray(registered)) {
            let regChanged = false;
            registered.forEach((r: any) => {
              if (r.user?.email?.toLowerCase() === cleanEmail || r.user?.id === id) {
                r.user.avatarUrl = updates.avatarUrl;
                regChanged = true;
              }
            });
            if (regChanged) {
              localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));
            }
          }
        }

        const authSessionStr = localStorage.getItem('drivefleet_auth_session');
        if (authSessionStr) {
          const session = JSON.parse(authSessionStr);
          if (session?.email?.toLowerCase() === cleanEmail || session?.id === id) {
            session.avatarUrl = updates.avatarUrl;
            localStorage.setItem('drivefleet_auth_session', JSON.stringify(session));
          }
        }

        window.dispatchEvent(new CustomEvent('drivefleet_profile_sync', { detail: { email: cleanEmail, avatarUrl: updates.avatarUrl } }));
      } catch (e) {
        console.warn('Customer avatar sync error:', e);
      }
    }

    logAuditEvent({
      actor: 'CRM Officer',
      action: 'CUSTOMER_CRM_UPDATED',
      entity: `Customer ${targetEmail || id}`,
      reason: updates.status ? `Account standing updated to ${updates.status}` : 'Customer dossier records amended',
      type: 'customer',
    });
  };

  // Booking Methods
  const addBooking = (bookingData: Partial<Booking>): Booking => {
    const referenceNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: bookingData.id || `b-${Date.now()}`,
      reference: bookingData.reference || `DF-2026-${referenceNum}`,
      customerId: bookingData.customerId || (customers[0]?.id ?? 'c-adeyemi'),
      vehicleId: bookingData.vehicleId || (vehicles[0]?.id ?? 'rav4-802'),
      branchId: bookingData.branchId || 'b0000000-0000-0000-0000-000000000001',
      pickupAt: bookingData.pickupAt || new Date().toISOString(),
      returnAt:
        bookingData.returnAt || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: bookingData.status || 'confirmed',
      sourceChannel: bookingData.sourceChannel || 'staff',
      currentVersion: 1,
      createdBy: bookingData.createdBy || 'customer',
      createdByName: bookingData.createdByName || (bookingData.sourceChannel === 'customer' ? 'Customer' : 'Operations Officer'),
      createdAt: bookingData.createdAt || new Date().toISOString(),
      quote: bookingData.quote || {
        billedPeriods: 3,
        lineItems: [],
        subtotalMinor: 13500000,
        durationTier: null,
        durationDiscountPercent: 0,
        durationDiscountMinor: 0,
        afterDurationMinor: 13500000,
        promoDiscountMinor: 0,
        afterPromoMinor: 13500000,
        feesMinor: 0,
        depositMinor: 5000000,
        totalMinor: 18500000,
        currency: 'NGN',
      },
    };

    setBookings((prev) => [newBooking, ...prev.filter((b) => b.reference !== newBooking.reference)]);

    // Update customer rental count
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === newBooking.customerId ? { ...c, rentalsCount: (c.rentalsCount || 0) + 1 } : c
      )
    );

    // If staff/admin created a booking for a customer, mirror it into the customer's portal
    const cust = customers.find((c) => c.id === newBooking.customerId);
    const custEmail = cust?.email || (newBooking.customerId === 'c-adeyemi' ? 'chukwudi@drivefleet.demo' : null);
    if (custEmail) {
      const veh = vehicles.find((v) => v.id === newBooking.vehicleId);
      const customerBookingItem: CustomerBooking = {
        id: newBooking.reference,
        vehicle: veh ? `${veh.make} ${veh.model} (${veh.year})` : 'Assigned Fleet Vehicle',
        plate: veh?.plate || 'TBD',
        category: veh?.category || 'sedan',
        status: toCustomerBookingStatus(newBooking.status),
        dates: `${newBooking.quote?.billedPeriods || 3} Days (${newBooking.pickupAt.split('T')[0]} → ${newBooking.returnAt.split('T')[0]})`,
        pickupAt: newBooking.pickupAt,
        returnAt: newBooking.returnAt,
        hub: veh?.branch?.name || (newBooking.branchId.includes('2') ? 'Abuja Central Terminal' : 'Lagos Ikeja Main Hub'),
        amountMinor: newBooking.quote?.totalMinor || 15000000,
        image: veh?.images?.[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
      };
      addUserBooking(custEmail, customerBookingItem);
    }

    logAuditEvent({
      actor: newBooking.createdByName || 'System Dispatch',
      action: 'BOOKING_COMMITTED',
      entity: `Booking #${newBooking.reference}`,
      reason: `${newBooking.sourceChannel.toUpperCase()} channel reservation for ${newBooking.quote?.billedPeriods || 1} day(s)`,
      type: 'booking',
    });

    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    let updatedRef: string | undefined;
    let updatedStatus: Booking['status'] | undefined;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id || b.reference === id) {
          const updated = { ...b, ...updates, updatedAt: new Date().toISOString() };
          updatedRef = updated.reference;
          updatedStatus = updated.status;
          return updated;
        }
        return b;
      })
    );

    // Synchronize status changes back to customer account in localStorage
    if (updatedRef && updatedStatus) {
      updateCustomerBookingStatus(updatedRef, updatedStatus);
    }

    logAuditEvent({
      actor: updates.latestVersion?.actorId || 'Operations Officer',
      action: updates.status ? `BOOKING_STATUS_${updates.status.toUpperCase()}` : 'BOOKING_AMENDED',
      entity: `Booking #${updatedRef || id}`,
      reason: updates.latestVersion?.changeReason || (updates.status ? `Reservation marked as ${updates.status}` : 'Terms modified'),
      type: 'booking',
    });
  };

  const cancelBooking = (id: string, reason?: string) => {
    let cancelledRef: string | undefined;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id || b.reference === id) {
          cancelledRef = b.reference;
          return {
            ...b,
            status: 'cancelled',
            updatedAt: new Date().toISOString(),
            latestVersion: b.latestVersion
              ? { ...b.latestVersion, changeReason: reason || 'Cancelled by staff/admin' }
              : undefined,
          };
        }
        return b;
      })
    );

    if (cancelledRef) {
      updateCustomerBookingStatus(cancelledRef, 'cancelled', reason || 'Cancelled by Fleet Operations');
    }

    logAuditEvent({
      actor: 'Fleet Operations',
      action: 'BOOKING_CANCELLED',
      entity: `Booking #${cancelledRef || id}`,
      reason: reason || 'Reservation cancelled and deposit release triggered',
      type: 'booking',
    });
  };

  // Maintenance Methods
  const addMaintenanceTask = (taskData: Partial<MaintenanceTask>): MaintenanceTask => {
    const newTask: MaintenanceTask = {
      id: taskData.id || `m-${Date.now()}`,
      vehicleId: taskData.vehicleId || vehicles[0].id,
      taskType: taskData.taskType || 'Scheduled Inspection',
      reason: taskData.reason || 'Routine preventative check',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'scheduled',
      assigneeName: taskData.assigneeName || 'Senior Technician',
      scheduledStart: taskData.scheduledStart || new Date().toISOString(),
      scheduledEnd:
        taskData.scheduledEnd || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedCostMinor: taskData.estimatedCostMinor || 5000000,
      blocksAvailability: taskData.blocksAvailability ?? true,
      notes: taskData.notes || '',
      createdBy: taskData.createdBy || 'operations',
      createdByName: taskData.createdByName || 'Fleet Lead',
      createdAt: new Date().toISOString(),
    };

    setMaintenanceTasks((prev) => [newTask, ...prev]);

    // If blocks availability, adjust vehicle operational state
    if (newTask.blocksAvailability) {
      updateVehicle(newTask.vehicleId, { operationalState: 'in_maintenance' });
    }

    logAuditEvent({
      actor: newTask.createdByName || 'Fleet Lead',
      action: 'MAINTENANCE_WORK_ORDER_LOGGED',
      entity: `Vehicle #${newTask.vehicleId} - ${newTask.taskType}`,
      reason: newTask.reason || 'Preventative fleet quarantine order committed',
      type: 'maintenance',
    });

    return newTask;
  };

  const updateMaintenanceTask = (id: string, updates: Partial<MaintenanceTask>) => {
    setMaintenanceTasks((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
    );
  };

  const completeMaintenanceTask = (id: string) => {
    const task = maintenanceTasks.find((m) => m.id === id);
    if (!task) return;

    setMaintenanceTasks((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: 'completed', completedAt: new Date().toISOString() }
          : m
      )
    );

    // Release vehicle back to 'ready'
    if (task.blocksAvailability) {
      updateVehicle(task.vehicleId, { operationalState: 'ready' });
    }

    logAuditEvent({
      actor: 'Master Technician',
      action: 'MAINTENANCE_COMPLETED',
      entity: `Work Order #${id} - ${task.taskType}`,
      reason: 'Maintenance inspection completed. Vehicle signed off and restored to ready fleet.',
      type: 'maintenance',
    });
  };

  // Promo Methods
  const addPromo = (promo: Omit<PromoItem, 'usageCount'>) => {
    setPromos((prev) => [{ ...promo, usageCount: 0 }, ...prev]);
  };

  const togglePromo = (code: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.code === code ? { ...p, active: !p.active } : p))
    );
  };

  // Pricing Methods
  const addPricingOverride = (override: Omit<PricingOverrideItem, 'id'>) => {
    const item: PricingOverrideItem = {
      ...override,
      id: `po-${Date.now()}`,
    };
    setPricingOverrides((prev) => [item, ...prev]);
  };

  // Team Methods
  const addTeamMember = (member: Omit<TeamMemberItem, 'id' | 'createdAt'> & { password?: string }) => {
    const item: TeamMemberItem = {
      ...member,
      id: `tm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTeamMembers((prev) => [item, ...prev]);

    if (item.avatarUrl) {
      try {
        const overridesStr = localStorage.getItem('drivefleet_user_overrides');
        const overrides = overridesStr ? JSON.parse(overridesStr) : {};
        overrides[item.email.toLowerCase()] = { ...(overrides[item.email.toLowerCase()] || {}), avatarUrl: item.avatarUrl };
        overrides[item.id] = { ...(overrides[item.id] || {}), avatarUrl: item.avatarUrl };
        localStorage.setItem('drivefleet_user_overrides', JSON.stringify(overrides));
      } catch {}
    }

    // Register team member in authenticated users registry so they can log into the staff/admin portal
    try {
      const cleanEmail = item.email.toLowerCase();
      const registeredStr = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const registered = registeredStr ? JSON.parse(registeredStr) : [];
      if (!registered.some((r: any) => r.user?.email?.toLowerCase() === cleanEmail)) {
        registered.push({
          user: {
            id: item.id,
            email: cleanEmail,
            role: item.role,
            firstName: item.firstName,
            lastName: item.lastName,
            phone: item.phone,
            avatarUrl: item.avatarUrl,
            active: true,
            preferredBranchId: item.branch.includes('Abuja')
              ? 'b0000000-0000-0000-0000-000000000002'
              : 'b0000000-0000-0000-0000-000000000001',
            createdAt: item.createdAt,
          },
          password: member.password || (item.role === 'admin' ? 'Admin@DriveFleet2026!' : 'Staff@DriveFleet2026!'),
        });
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));
        window.dispatchEvent(new CustomEvent('drivefleet_profile_sync'));
      }
    } catch (err) {
      console.warn('Team auth registry sync error:', err);
    }

    logAuditEvent({
      actor: 'System Administrator',
      action: 'TEAM_MEMBER_PROVISIONED',
      entity: `${item.firstName} ${item.lastName} (${item.role.toUpperCase()})`,
      reason: `Provisioned with role access at ${item.branch}`,
      type: 'team',
    });
  };

  const toggleTeamMember = (id: string) => {
    setTeamMembers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  return (
    <OperationsContext.Provider
      value={{
        vehicles,
        customers,
        bookings,
        maintenanceTasks,
        promos,
        pricingOverrides,
        teamMembers,
        auditLogs,
        logAuditEvent,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addCustomer,
        updateCustomer,
        addBooking,
        updateBooking,
        cancelBooking,
        addMaintenanceTask,
        updateMaintenanceTask,
        completeMaintenanceTask,
        addPromo,
        togglePromo,
        addPricingOverride,
        addTeamMember,
        toggleTeamMember,
        checkAvailability,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return ctx;
}
