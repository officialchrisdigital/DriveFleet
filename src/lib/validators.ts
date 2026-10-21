import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Valid Nigerian phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const contactInquirySchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please enter a message with at least 10 characters'),
});

export const renterDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  licenseNumber: z.string().min(5, 'Driver license number is required'),
  licenseExpiry: z.string().min(4, 'License expiration date is required'),
  nationalId: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const vehicleCreateSchema = z.object({
  branchId: z.string().uuid('Please select a valid branch'),
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(2010).max(2030),
  plate: z.string().min(4, 'License plate is required'),
  category: z.enum(['economy', 'sedan', 'suv', 'luxury']),
  seats: z.number().int().min(1).max(15),
  transmission: z.enum(['automatic', 'manual']),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
  baseRateMinor: z.number().int().positive('Daily rate must be greater than zero'),
  mileageAllowanceKm: z.number().int().min(0),
  currentOdometerKm: z.number().int().min(0),
  operationalState: z.enum(['ready', 'in_maintenance', 'out_of_service']),
});

export const maintenanceTaskSchema = z.object({
  vehicleId: z.string().uuid('Vehicle is required'),
  taskType: z.string().min(3, 'Task type is required'),
  reason: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  scheduledStart: z.string().optional(),
  scheduledEnd: z.string().optional(),
  dueOdometerKm: z.number().optional(),
  estimatedCostMinor: z.number().int().min(0),
  notes: z.string().optional(),
  blocksAvailability: z.boolean().default(true),
});

export const promoCreateSchema = z.object({
  code: z.string().min(3, 'Promo code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive('Discount value must be greater than zero'),
  validFrom: z.string(),
  validTo: z.string(),
  minRentalDays: z.number().optional(),
  maxUses: z.number().optional(),
});
