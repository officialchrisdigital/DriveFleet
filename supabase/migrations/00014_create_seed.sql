-- Comprehensive Demonstration Dataset for DriveFleet Capstone
-- Anchored dynamically to NOW()

DO $$
DECLARE
  v_org_id UUID := '11111111-1111-1111-1111-111111111111';
  v_branch_ikeja UUID := 'b0000000-0000-0000-0000-000000000001';
  v_branch_abuja UUID := 'b0000000-0000-0000-0000-000000000002';
  v_user_admin UUID := 'a0000000-0000-0000-0000-000000000001';
  v_user_staff UUID := 's0000000-0000-0000-0000-000000000001';
  v_user_customer UUID := 'c0000000-0000-0000-0000-000000000001';
  v_crm_chukwudi UUID := '90000000-0000-0000-0000-000000000001';
  v_veh_rav4 UUID := '80000000-0000-0000-0000-000000000001';
  v_veh_camry UUID := '80000000-0000-0000-0000-000000000002';
  v_veh_c300 UUID := '80000000-0000-0000-0000-000000000003';
  v_veh_tucson UUID := '80000000-0000-0000-0000-000000000004';
  v_veh_rio UUID := '80000000-0000-0000-0000-000000000005';
  v_veh_prado UUID := '80000000-0000-0000-0000-000000000006';
  v_veh_corolla UUID := '80000000-0000-0000-0000-000000000007';
  v_veh_civic UUID := '80000000-0000-0000-0000-000000000008';
  v_booking_1 UUID := '70000000-0000-0000-0000-000000000001';
BEGIN
  -- 1. Organization & Branches
  INSERT INTO public.organizations (id, name, currency, timezone)
  VALUES (v_org_id, 'DriveFleet Technologies Ltd', 'NGN', 'Africa/Lagos')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.branches (id, org_id, name, city, address, phone, active)
  VALUES
    (v_branch_ikeja, v_org_id, 'Lagos Ikeja Main Hub', 'Lagos', '45 Isaac John Street, GRA Ikeja, Lagos', '+234 1 290 8400', true),
    (v_branch_abuja, v_org_id, 'Abuja Central Terminal', 'Abuja', 'Plot 102 Diplomatic Zone, Central Business District, Abuja', '+234 9 400 3533', true)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.org_settings (org_id, turnaround_buffer_minutes)
  VALUES (v_org_id, 0)
  ON CONFLICT (org_id) DO NOTHING;

  -- 2. Staff, Admin, and Customer User Profiles
  INSERT INTO public.users (id, email, role, first_name, last_name, phone, active)
  VALUES
    (v_user_admin, 'marcus.vance@drivefleet.demo', 'admin', 'Marcus', 'Vance', '+234 809 999 8877', true),
    (v_user_staff, 'amara.kalu@drivefleet.demo', 'staff', 'Amara', 'Kalu', '+234 802 111 2233', true),
    (v_user_customer, 'c.adeyemi@enterprise-lagos.ng', 'customer', 'Chukwudi', 'Adeyemi', '+234 803 555 0192', true)
  ON CONFLICT (id) DO NOTHING;

  -- 3. CRM Customers
  INSERT INTO public.crm_customers (id, first_name, last_name, email, phone, linked_user_id, created_by, renter_details)
  VALUES
    (v_crm_chukwudi, 'Chukwudi', 'Adeyemi', 'c.adeyemi@enterprise-lagos.ng', '+234 803 555 0192', v_user_customer, v_user_admin,
     '{"licenseNumber": "FRSC-LAG-8492018B", "licenseExpiry": "2028-08-24", "nationalId": "NIMC-9402", "verifiedOnline": true}')
  ON CONFLICT (id) DO NOTHING;

  -- 4. Vehicles (12 Fleet Units across Lagos and Abuja)
  INSERT INTO public.vehicles (id, branch_id, make, model, year, plate, category, seats, transmission, fuel_type, base_rate_minor, mileage_allowance_km, current_odometer_km, operational_state)
  VALUES
    (v_veh_rav4, v_branch_ikeja, 'Toyota', 'RAV4 XLE AWD', 2024, 'LAG-802-AB', 'suv', 5, 'automatic', 'hybrid', 4500000, 200, 18420, 'ready'),
    (v_veh_camry, v_branch_ikeja, 'Toyota', 'Camry XLE', 2024, 'LAG-104-AB', 'sedan', 5, 'automatic', 'petrol', 4800000, 200, 39850, 'ready'),
    (v_veh_c300, v_branch_ikeja, 'Mercedes-Benz', 'C300 AMG', 2023, 'LAG-992-ZZ', 'luxury', 5, 'automatic', 'petrol', 9500000, 150, 18400, 'ready'),
    (v_veh_tucson, v_branch_abuja, 'Hyundai', 'Tucson AWD', 2023, 'ABJ-119-KL', 'suv', 5, 'automatic', 'petrol', 5500000, 200, 12600, 'ready'),
    (v_veh_rio, v_branch_ikeja, 'Kia', 'Rio EX', 2022, 'LAG-330-MT', 'economy', 5, 'automatic', 'petrol', 2400000, 180, 51200, 'in_maintenance'),
    (v_veh_prado, v_branch_abuja, 'Toyota', 'Land Cruiser Prado TX', 2024, 'ABJ-771-PR', 'luxury', 7, 'automatic', 'diesel', 12000000, 250, 31500, 'ready'),
    (v_veh_corolla, v_branch_ikeja, 'Toyota', 'Corolla LE', 2023, 'LAG-482-XY', 'economy', 5, 'automatic', 'petrol', 3500000, 200, 24150, 'ready'),
    (v_veh_civic, v_branch_ikeja, 'Honda', 'Civic Touring', 2021, 'LAG-504-HC', 'sedan', 5, 'automatic', 'petrol', 3000000, 200, 88320, 'ready')
  ON CONFLICT (id) DO NOTHING;

  -- 5. Promos
  INSERT INTO public.promos (code, discount_type, discount_value, valid_from, valid_to, min_rental_days, max_uses, current_uses, active)
  VALUES
    ('FLEETDEMO10', 'percentage', 10, '2026-01-01', '2026-12-31', 1, 1000, 14, true),
    ('EXPIRED20', 'percentage', 20, '2025-01-01', '2025-12-31', 3, 50, 50, false)
  ON CONFLICT (code) DO NOTHING;

  -- 6. Booking #DF-2026-9812 (Upcoming Confirmed)
  INSERT INTO public.bookings (id, reference, customer_id, vehicle_id, branch_id, pickup_at, return_at, status, source_channel, created_by, idempotency_key, current_version)
  VALUES (
    v_booking_1, 'DF-2026-9812', v_crm_chukwudi, v_veh_rav4, v_branch_ikeja,
    now() + interval '4 days', now() + interval '7 days', 'confirmed', 'customer', v_user_customer,
    'idem_df_checkout_9812_4f8a9e2c', 1
  ) ON CONFLICT (id) DO NOTHING;

  -- 7. Snapshot quote for booking
  INSERT INTO public.booking_versions (
    booking_id, version_number, billed_periods, line_items,
    subtotal_minor, duration_discount_minor, duration_tier,
    promo_discount_minor, fees_minor, deposit_minor, total_minor, currency, applied_rules, actor_id
  ) VALUES (
    v_booking_1, 1, 3,
    '[{"periodIndex":1,"periodDate":"2026-10-23","rateMinor":4500000,"ruleApplied":"Base Weekday Rate (Fri)","isWeekend":false},
      {"periodIndex":2,"periodDate":"2026-10-24","rateMinor":4950000,"ruleApplied":"Weekend Surcharge (+10%)","isWeekend":true},
      {"periodIndex":3,"periodDate":"2026-10-25","rateMinor":4950000,"ruleApplied":"Weekend Surcharge (+10%)","isWeekend":true}]'::jsonb,
    14400000, 0, null, 1440000, 0, 5000000, 12960000, 'NGN', '{"promo": "FLEETDEMO10"}'::jsonb, v_user_customer
  ) ON CONFLICT (booking_id, version_number) DO NOTHING;

END $$;
