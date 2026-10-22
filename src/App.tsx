import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { PagePlaceholder } from './components/shared/PagePlaceholder';
import { CustomerRoute, StaffRoute, AdminOnlyRoute } from './components/auth/ProtectedRoute';

// Interactive Milestone 2 Pages
import { HomePage } from './pages/public/HomePage';
import { VehiclesPage } from './pages/public/VehiclesPage';
import { VehicleDetailPage } from './pages/public/VehicleDetailPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';

// Authentication Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

// Booking & Account
import { BookingWizardPage } from './pages/booking/BookingWizardPage';
import { CheckoutSimulatorPage } from './pages/booking/CheckoutSimulatorPage';
import { BookingConfirmationPage } from './pages/booking/BookingConfirmationPage';
import { AccountOverviewPage } from './pages/account/AccountOverviewPage';
import { MyBookingsPage } from './pages/account/MyBookingsPage';
import { ProfilePage } from './pages/account/ProfilePage';

// Interactive Milestone 3 Operations Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { FleetRegisterPage } from './pages/admin/FleetRegisterPage';
import { DispatchCalendarPage } from './pages/admin/DispatchCalendarPage';
import { PickupHandoverPage } from './pages/admin/PickupHandoverPage';
import { ReturnInspectionPage } from './pages/admin/ReturnInspectionPage';
import { CustomerCrmPage } from './pages/admin/CustomerCrmPage';
import { MaintenanceRegistryPage } from './pages/admin/MaintenanceRegistryPage';

// Interactive Milestone 4 Management Pages
import { OperationalReportsPage } from './pages/admin/OperationalReportsPage';
import { PricingManagementPage } from './pages/admin/PricingManagementPage';
import { PromosManagementPage } from './pages/admin/PromosManagementPage';
import { TeamManagementPage } from './pages/admin/TeamManagementPage';
import { OrgSettingsPage } from './pages/admin/OrgSettingsPage';
import { AuditTrailPage } from './pages/admin/AuditTrailPage';

// Milestone 5 System Pages
import { AccessDeniedPage, NotFoundPage } from './pages/system/SystemPages';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Customer Routes (Clean Navbar - No Demo Banners) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Customer Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Booking Flow */}
            <Route path="/book/:vehicleId" element={<BookingWizardPage />} />
            <Route
              path="/checkout"
              element={
                <CustomerRoute>
                  <CheckoutSimulatorPage />
                </CustomerRoute>
              }
            />
            <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />

            {/* Customer Account Sub-Routes (Protected) */}
            <Route
              element={
                <CustomerRoute>
                  <CustomerLayout />
                </CustomerRoute>
              }
            >
              <Route path="/account" element={<AccountOverviewPage />} />
              <Route path="/account/bookings" element={<MyBookingsPage />} />
              <Route path="/account/bookings/:bookingId" element={<BookingConfirmationPage />} />
              <Route path="/account/profile" element={<ProfilePage />} />
            </Route>

            {/* System Screens */}
            <Route path="/access-denied" element={<AccessDeniedPage />} />
          </Route>

          {/* Dedicated Operations Login (Standalone Dark Theme Portal) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Staff & Admin Operations (Protected by StaffRoute) */}
          <Route
            element={
              <StaffRoute>
                <AdminLayout />
              </StaffRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/vehicles" element={<FleetRegisterPage />} />
            <Route
              path="/admin/vehicles/new"
              element={
                <AdminOnlyRoute>
                  <PagePlaceholder
                    title="Provision New Fleet Vehicle"
                    subtitle="Admin-only form for plate, category, rates, mileage allowance, and thresholds."
                    routeCode="FR-04 /admin/vehicles/new"
                  />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/vehicles/:vehicleId"
              element={
                <PagePlaceholder
                  title="Vehicle Operational Dossier"
                  subtitle="Specs, mileage telemetry, maintenance logs, and calendar history."
                  routeCode="FR-04 /admin/vehicles/:id"
                  actions={[{ label: 'Edit Vehicle', to: '/admin/vehicles/rav4-802/edit' }]}
                />
              }
            />
            <Route
              path="/admin/vehicles/:vehicleId/edit"
              element={
                <AdminOnlyRoute>
                  <PagePlaceholder
                    title="Edit Vehicle Record"
                    subtitle="Update specifications while preserving linked booking and odometer history."
                    routeCode="FR-04 /admin/vehicles/:id/edit"
                  />
                </AdminOnlyRoute>
              }
            />
            <Route path="/admin/calendar" element={<DispatchCalendarPage />} />
            <Route
              path="/admin/bookings"
              element={
                <PagePlaceholder
                  title="Fleet Reservations & Booking Ledger"
                  subtitle="Active and upcoming customer reservations across Lagos and Abuja dispatch nodes."
                  routeCode="FR-08 /admin/bookings"
                  actions={[
                    { label: '+ Staff-Assisted Reservation', to: '/admin/bookings/new', primary: true },
                    { label: 'Booking Detail', to: '/admin/bookings/DF-2026-9812' },
                    { label: 'Pickup Handover SOP', to: '/admin/bookings/DF-2026-9812/pickup' },
                    { label: 'Return Inspection SOP', to: '/admin/bookings/DF-2026-9812/return' },
                  ]}
                />
              }
            />
            <Route
              path="/admin/bookings/new"
              element={
                <PagePlaceholder
                  title="Create Staff-Assisted Booking"
                  subtitle="Select CRM customer, available vehicle, and calculate shared quote."
                  routeCode="FR-08 /admin/bookings/new"
                />
              }
            />
            <Route
              path="/admin/bookings/:bookingId"
              element={
                <PagePlaceholder
                  title="Booking Operational Detail (#DF-2026-9812)"
                  subtitle="Customer record, assigned vehicle, timeline, quote breakdown, and internal notes."
                  routeCode="FR-08 /admin/bookings/:id"
                  actions={[
                    { label: 'Pickup Handover Form', to: '/admin/bookings/DF-2026-9812/pickup', primary: true },
                    { label: 'Return Inspection Form', to: '/admin/bookings/DF-2026-9812/return' },
                  ]}
                />
              }
            />
            <Route
              path="/admin/bookings/:bookingId/edit"
              element={
                <PagePlaceholder
                  title="Amend Reservation"
                  subtitle="Operational date adjustments, reason logging, and revalidated pricing."
                  routeCode="FR-08 /admin/bookings/:id/edit"
                />
              }
            />
            <Route path="/admin/bookings/:bookingId/pickup" element={<PickupHandoverPage />} />
            <Route path="/admin/bookings/:bookingId/return" element={<ReturnInspectionPage />} />

            <Route path="/admin/customers" element={<CustomerCrmPage />} />
            <Route
              path="/admin/customers/new"
              element={
                <PagePlaceholder
                  title="Add CRM Customer Record"
                  subtitle="Create customer contact and driver licensing dossier (independent from auth credentials)."
                  routeCode="FR-10 /admin/customers/new"
                />
              }
            />
            <Route
              path="/admin/customers/:customerId"
              element={
                <PagePlaceholder
                  title="Customer Dossier: Chukwudi Adeyemi"
                  subtitle="Enterprise corporate renter profile, verified FRSC license, and private staff notes."
                  routeCode="FR-10 /admin/customers/:id"
                />
              }
            />
            <Route
              path="/admin/customers/:customerId/edit"
              element={
                <PagePlaceholder
                  title="Edit Customer CRM Profile"
                  subtitle="Update contact or driver credentials while preserving rental history."
                  routeCode="FR-10 /admin/customers/:id/edit"
                />
              }
            />

            <Route path="/admin/maintenance" element={<MaintenanceRegistryPage />} />
            <Route
              path="/admin/maintenance/new"
              element={
                <PagePlaceholder
                  title="Schedule Maintenance Task"
                  subtitle="Assign vehicle, service type, due mileage, and availability downtime block."
                  routeCode="FR-11 /admin/maintenance/new"
                />
              }
            />
            <Route
              path="/admin/maintenance/:maintenanceId"
              element={
                <PagePlaceholder
                  title="Work Order: 40,000 km Scheduled Service"
                  subtitle="Toyota Camry (LAG-104-AB) • Status: In Progress • Downtime Block Active"
                  routeCode="FR-11 /admin/maintenance/:id"
                />
              }
            />
            <Route
              path="/admin/maintenance/:maintenanceId/edit"
              element={
                <PagePlaceholder
                  title="Update Maintenance Record"
                  subtitle="Adjust work details or mark completed to release vehicle back to Ready state."
                  routeCode="FR-11 /admin/maintenance/:id/edit"
                />
              }
            />

            {/* Admin Management Routes (AdminOnlyRoute enforced) */}
            <Route path="/admin/reports" element={<OperationalReportsPage />} />
            <Route
              path="/admin/pricing"
              element={
                <AdminOnlyRoute>
                  <PricingManagementPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/promos"
              element={
                <AdminOnlyRoute>
                  <PromosManagementPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminOnlyRoute>
                  <TeamManagementPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminOnlyRoute>
                  <OrgSettingsPage />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="/admin/activity"
              element={
                <AdminOnlyRoute>
                  <AuditTrailPage />
                </AdminOnlyRoute>
              }
            />
          </Route>

          {/* Catch-all to 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
