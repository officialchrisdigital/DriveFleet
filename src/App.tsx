import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OperationsProvider } from './contexts/OperationsContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
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

// Interactive Operations Suite
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { FleetRegisterPage } from './pages/admin/FleetRegisterPage';
import { AddVehiclePage } from './pages/admin/AddVehiclePage';
import { VehicleDossierPage } from './pages/admin/VehicleDossierPage';
import { EditVehiclePage } from './pages/admin/EditVehiclePage';

import { DispatchCalendarPage } from './pages/admin/DispatchCalendarPage';

import { BookingsListPage } from './pages/admin/BookingsListPage';
import { StaffBookingWizardPage } from './pages/admin/StaffBookingWizardPage';
import { BookingDetailPage } from './pages/admin/BookingDetailPage';
import { EditBookingPage } from './pages/admin/EditBookingPage';
import { PickupHandoverPage } from './pages/admin/PickupHandoverPage';
import { ReturnInspectionPage } from './pages/admin/ReturnInspectionPage';

import { CustomerCrmPage } from './pages/admin/CustomerCrmPage';
import { AddCustomerPage } from './pages/admin/AddCustomerPage';
import { CustomerDetailPage } from './pages/admin/CustomerDetailPage';
import { EditCustomerPage } from './pages/admin/EditCustomerPage';

import { MaintenanceRegistryPage } from './pages/admin/MaintenanceRegistryPage';
import { AddMaintenancePage } from './pages/admin/AddMaintenancePage';
import { MaintenanceDetailPage } from './pages/admin/MaintenanceDetailPage';
import { EditMaintenancePage } from './pages/admin/EditMaintenancePage';

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
      <OperationsProvider>
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

              {/* Fleet Management */}
              <Route path="/admin/vehicles" element={<FleetRegisterPage />} />
              <Route
                path="/admin/vehicles/new"
                element={
                  <AdminOnlyRoute>
                    <AddVehiclePage />
                  </AdminOnlyRoute>
                }
              />
              <Route path="/admin/vehicles/:vehicleId" element={<VehicleDossierPage />} />
              <Route
                path="/admin/vehicles/:vehicleId/edit"
                element={
                  <AdminOnlyRoute>
                    <EditVehiclePage />
                  </AdminOnlyRoute>
                }
              />

              {/* Dispatch Calendar */}
              <Route path="/admin/calendar" element={<DispatchCalendarPage />} />

              {/* Bookings & Reservations */}
              <Route path="/admin/bookings" element={<BookingsListPage />} />
              <Route path="/admin/bookings/new" element={<StaffBookingWizardPage />} />
              <Route path="/admin/bookings/:bookingId" element={<BookingDetailPage />} />
              <Route path="/admin/bookings/:bookingId/edit" element={<EditBookingPage />} />
              <Route path="/admin/bookings/:bookingId/pickup" element={<PickupHandoverPage />} />
              <Route path="/admin/bookings/:bookingId/return" element={<ReturnInspectionPage />} />

              {/* Customer CRM */}
              <Route path="/admin/customers" element={<CustomerCrmPage />} />
              <Route path="/admin/customers/new" element={<AddCustomerPage />} />
              <Route path="/admin/customers/:customerId" element={<CustomerDetailPage />} />
              <Route path="/admin/customers/:customerId/edit" element={<EditCustomerPage />} />

              {/* Fleet Maintenance */}
              <Route path="/admin/maintenance" element={<MaintenanceRegistryPage />} />
              <Route path="/admin/maintenance/new" element={<AddMaintenancePage />} />
              <Route path="/admin/maintenance/:maintenanceId" element={<MaintenanceDetailPage />} />
              <Route path="/admin/maintenance/:maintenanceId/edit" element={<EditMaintenancePage />} />

              {/* Reports & Management (Admin & Staff authorized where permitted) */}
              <Route path="/admin/reports" element={<OperationalReportsPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
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
      </OperationsProvider>
    </AuthProvider>
  );
}
