export type UserRole = 'customer' | 'staff' | 'admin';

export type BookingStatus = 'draft' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type VehicleOperationalState = 'ready' | 'in_maintenance' | 'out_of_service';
export type VehicleCategory = 'economy' | 'sedan' | 'suv' | 'luxury';
export type TransmissionType = 'automatic' | 'manual';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type PricingRuleType = 'base' | 'weekend' | 'override' | 'duration_tier';
export type PricingScope = 'global' | 'category' | 'vehicle';

export interface User {
  id: string;
  authId?: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  active: boolean;
  preferredBranchId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Branch {
  id: string;
  orgId: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  operatingHours?: Record<string, string>;
  active: boolean;
  createdAt: string;
}

export interface RenterDetails {
  licenseNumber?: string;
  licenseExpiry?: string;
  nationalId?: string;
  dateOfBirth?: string;
  verifiedOnline?: boolean;
}

export interface CrmCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  avatarUrl?: string;
  status?: 'active' | 'flagged' | 'vip';
  rentalsCount?: number;
  notesCount?: number;
  notes?: CrmNote[];
  renterDetails: RenterDetails;
  linkedUserId?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CrmNote {
  id: string;
  customerId: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: string;
}

export interface ServiceThresholds {
  intervalKm?: number;
  intervalDays?: number;
  lastServiceKm?: number;
  lastServiceDate?: string;
  nextServiceKm?: number;
  nextServiceDate?: string;
}

export interface Vehicle {
  id: string;
  branchId: string;
  branch?: Branch;
  make: string;
  model: string;
  year: number;
  plate: string;
  plateNormalized?: string;
  category: VehicleCategory;
  seats: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  baseRateMinor: number; // in kobo (100 kobo = 1 NGN)
  mileageAllowanceKm: number;
  currentOdometerKm: number;
  operationalState: VehicleOperationalState;
  archived: boolean;
  serviceThresholds: ServiceThresholds;
  images?: string[];
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VehicleImage {
  id: string;
  vehicleId: string;
  storagePath: string;
  displayOrder: number;
  createdAt?: string;
}

export interface VehicleStateHistory {
  id: string;
  vehicleId: string;
  priorState?: string;
  newState: string;
  reason?: string;
  actorId?: string;
  actorName?: string;
  effectiveAt: string;
}

export interface QuoteLineItem {
  periodIndex: number;
  periodDate: string; // YYYY-MM-DD
  rateMinor: number;
  ruleApplied: string;
  isWeekend: boolean;
  isOverride: boolean;
}

export interface QuoteCalculation {
  billedPeriods: number;
  lineItems: QuoteLineItem[];
  subtotalMinor: number;
  durationTier: string | null;
  durationDiscountPercent: number;
  durationDiscountMinor: number;
  afterDurationMinor: number;
  promoCode?: string;
  promoDiscountMinor: number;
  afterPromoMinor: number;
  feesMinor: number;
  depositMinor: number;
  totalMinor: number;
  currency: string;
}

export interface BookingVersion {
  id: string;
  bookingId: string;
  versionNumber: number;
  billedPeriods: number;
  lineItems: QuoteLineItem[];
  subtotalMinor: number;
  durationDiscountMinor: number;
  durationTier?: string;
  promoId?: string;
  promoDiscountMinor: number;
  feesMinor: number;
  depositMinor: number;
  totalMinor: number;
  currency: string;
  appliedRules?: Record<string, any>;
  changeReason?: string;
  actorId?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  reference: string; // DF-YYYY-NNNN
  customerId: string;
  customer?: CrmCustomer;
  vehicleId: string;
  vehicle?: Vehicle;
  branchId: string;
  branch?: Branch;
  pickupAt: string; // ISO string UTC
  returnAt: string; // ISO string UTC
  status: BookingStatus;
  sourceChannel: 'customer' | 'staff';
  createdBy?: string;
  createdByName?: string;
  idempotencyKey?: string;
  currentVersion: number;
  quote?: QuoteCalculation;
  latestVersion?: BookingVersion;
  createdAt: string;
  updatedAt?: string;
}

export interface CheckoutAttempt {
  id: string;
  bookingId?: string;
  idempotencyKey: string;
  simulatedOutcome: 'success' | 'conflict' | 'failure';
  attemptedAt: string;
}

export interface Inspection {
  id: string;
  bookingId: string;
  vehicleId: string;
  type: 'pickup' | 'return';
  actualTime: string;
  odometerKm: number;
  fuelLevel: string; // e.g., '8/8 Full', '6/8', etc.
  checklist: Record<string, boolean>;
  conditionNotes?: string;
  damagePhotos: string[];
  extrasBreakdown?: string;
  extrasChargeMinor?: number;
  staffId: string;
  staffName?: string;
  createdAt: string;
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  taskType: string;
  reason?: string;
  status: MaintenanceStatus;
  priority: Priority;
  assigneeId?: string;
  assigneeName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  dueDate?: string;
  dueOdometerKm?: number;
  estimatedCostMinor: number;
  actualCostMinor?: number;
  notes?: string;
  blocksAvailability: boolean;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MaintenanceHistory {
  id: string;
  taskId: string;
  action: string;
  notes?: string;
  actorId: string;
  createdAt: string;
}

export interface PricingRule {
  id: string;
  type: PricingRuleType;
  scope: PricingScope;
  scopeId?: string;
  effectiveStart: string; // YYYY-MM-DD
  effectiveEnd: string; // YYYY-MM-DD
  priority: number;
  rateMinor?: number;
  percentage?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Promo {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 10 for 10%) or minor units
  validFrom: string;
  validTo: string;
  minRentalDays?: number;
  maxUses?: number;
  currentUses: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromoRedemption {
  id: string;
  promoId: string;
  bookingId: string;
  discountAppliedMinor: number;
  redeemedAt: string;
}

export interface AuditEntry {
  id: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  entityType: string;
  entityId: string;
  action: string;
  reason?: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
}

export interface OrgSettings {
  id: string;
  orgId: string;
  bookingPolicy: {
    minRentalHours?: number;
    maxRentalDays?: number;
    allowWeekendPickup?: boolean;
  };
  cancellationPolicy: {
    cutoffHours: number; // e.g. 24
    feePercentage?: number;
  };
  mileageSettings: {
    defaultAllowanceKm: number; // e.g. 200
    excessRateMinor: number; // e.g. 15000 (NGN 150/km)
  };
  maintenanceSettings: {
    serviceIntervalKm?: number;
    serviceIntervalDays?: number;
  };
  demoCheckoutSettings: {
    enabled: boolean;
    requireSimulatedCard?: boolean;
  };
  turnaroundBufferMinutes: number; // default 0
  updatedAt?: string;
  updatedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  reason: string;
  timestamp: string;
  type: 'booking' | 'vehicle' | 'customer' | 'maintenance' | 'pricing' | 'team' | 'inspection' | 'system';
}
