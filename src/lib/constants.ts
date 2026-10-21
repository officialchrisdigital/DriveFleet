import { BookingStatus, VehicleOperationalState, VehicleCategory, Priority } from './types';

export const BUSINESS_TIMEZONE = 'Africa/Lagos';
export const DEFAULT_CURRENCY = 'NGN';
export const CURRENCY_SYMBOL = '₦';

export const ROUTES = {
  // Public
  HOME: '/',
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: '/vehicles/:vehicleId',
  HOW_IT_WORKS: '/how-it-works',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  ADMIN_LOGIN: '/admin/login',

  // Booking Flow
  BOOK: '/book/:vehicleId',
  CHECKOUT: '/checkout',
  BOOKING_CONFIRMATION: '/booking-confirmation/:bookingId',

  // Customer Portal
  ACCOUNT: '/account',
  ACCOUNT_BOOKINGS: '/account/bookings',
  ACCOUNT_BOOKING_DETAIL: '/account/bookings/:bookingId',
  ACCOUNT_PROFILE: '/account/profile',

  // Staff / Admin Operations
  ADMIN_DASHBOARD: '/admin',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_VEHICLES_NEW: '/admin/vehicles/new',
  ADMIN_VEHICLE_DETAIL: '/admin/vehicles/:vehicleId',
  ADMIN_VEHICLE_EDIT: '/admin/vehicles/:vehicleId/edit',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_BOOKINGS_NEW: '/admin/bookings/new',
  ADMIN_BOOKING_DETAIL: '/admin/bookings/:bookingId',
  ADMIN_BOOKING_EDIT: '/admin/bookings/:bookingId/edit',
  ADMIN_BOOKING_PICKUP: '/admin/bookings/:bookingId/pickup',
  ADMIN_BOOKING_RETURN: '/admin/bookings/:bookingId/return',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CUSTOMERS_NEW: '/admin/customers/new',
  ADMIN_CUSTOMER_DETAIL: '/admin/customers/:customerId',
  ADMIN_CUSTOMER_EDIT: '/admin/customers/:customerId/edit',
  ADMIN_MAINTENANCE: '/admin/maintenance',
  ADMIN_MAINTENANCE_NEW: '/admin/maintenance/new',
  ADMIN_MAINTENANCE_DETAIL: '/admin/maintenance/:maintenanceId',
  ADMIN_MAINTENANCE_EDIT: '/admin/maintenance/:maintenanceId/edit',
  ADMIN_REPORTS: '/admin/reports',

  // Admin-Only Management
  ADMIN_PRICING: '/admin/pricing',
  ADMIN_PROMOS: '/admin/promos',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ACTIVITY: '/admin/activity',

  // System
  ACCESS_DENIED: '/access-denied',
  NOT_FOUND: '/404',
} as const;

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'outline' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

export const VEHICLE_STATE_CONFIG: Record<VehicleOperationalState, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  ready: { label: 'Ready for Pickup', variant: 'success' },
  in_maintenance: { label: 'In Maintenance', variant: 'warning' },
  out_of_service: { label: 'Out of Service', variant: 'destructive' },
};

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, string> = {
  economy: 'Economy Hatch/Sedan',
  sedan: 'Executive Sedan',
  suv: 'Compact SUV / AWD',
  luxury: 'Luxury Saloon / SUV',
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-slate-600 bg-slate-100' },
  medium: { label: 'Medium', color: 'text-blue-600 bg-blue-50' },
  high: { label: 'High', color: 'text-amber-600 bg-amber-50' },
  urgent: { label: 'Urgent', color: 'text-red-600 bg-red-50' },
};

export const DEMO_NOTICE = 'Demo Mode — All bookings, charges, and fleet operations are simulated. No real credit card or cash transaction will take place.';
