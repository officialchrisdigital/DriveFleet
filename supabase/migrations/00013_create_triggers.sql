-- Essential Safety Triggers & Guards

-- 1. Last Active Admin Protection Trigger
CREATE OR REPLACE FUNCTION public.check_last_admin_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_remaining_admins INT;
BEGIN
  IF OLD.role = 'admin' AND (NEW.role <> 'admin' OR NEW.active = false) THEN
    SELECT COUNT(*) INTO v_remaining_admins
    FROM public.users
    WHERE role = 'admin' AND active = true AND id <> OLD.id;

    IF v_remaining_admins < 1 THEN
      RAISE EXCEPTION 'LAST_ADMIN_PROTECTED: Cannot demote or deactivate the last remaining active administrator.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_last_admin_protect ON public.users;
CREATE TRIGGER trg_last_admin_protect
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.check_last_admin_trigger();

-- 2. Inspection Odometer Monotonicity & Vehicle Reading Sync
CREATE OR REPLACE FUNCTION public.sync_inspection_odometer_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_current_km INT;
  v_pickup_km INT;
BEGIN
  SELECT current_odometer_km INTO v_current_km
  FROM public.vehicles
  WHERE id = NEW.vehicle_id;

  IF NEW.type = 'pickup' THEN
    IF NEW.odometer_km < v_current_km THEN
      RAISE EXCEPTION 'ODOMETER_REGRESSION: Pickup mileage (% km) cannot be less than vehicle recorded odometer (% km)',
        NEW.odometer_km, v_current_km;
    END IF;
  ELSIF NEW.type = 'return' THEN
    SELECT odometer_km INTO v_pickup_km
    FROM public.inspections
    WHERE booking_id = NEW.booking_id AND type = 'pickup';

    IF v_pickup_km IS NOT NULL AND NEW.odometer_km < v_pickup_km THEN
      RAISE EXCEPTION 'ODOMETER_REGRESSION: Return mileage (% km) cannot be less than pickup mileage (% km)',
        NEW.odometer_km, v_pickup_km;
    END IF;
  END IF;

  -- Advance vehicle recorded odometer
  UPDATE public.vehicles
  SET current_odometer_km = NEW.odometer_km,
      updated_at = now()
  WHERE id = NEW.vehicle_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_inspection_odometer ON public.inspections;
CREATE TRIGGER trg_inspection_odometer
BEFORE INSERT ON public.inspections
FOR EACH ROW
EXECUTE FUNCTION public.sync_inspection_odometer_trigger();
