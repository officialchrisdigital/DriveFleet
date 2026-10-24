import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { VehicleCategory, TransmissionType, FuelType, VehicleOperationalState } from '@/lib/types';
import {
  Car, ArrowLeft, CheckCircle2, DollarSign,
  MapPin, Gauge, Settings
} from 'lucide-react';

export function EditVehiclePage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { vehicles, updateVehicle } = useOperations();
  const navigate = useNavigate();

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [plate, setPlate] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('suv');
  const [branchCity, setBranchCity] = useState<'Lagos' | 'Abuja'>('Lagos');
  const [dailyRateNaira, setDailyRateNaira] = useState(50000);
  const [odometer, setOdometer] = useState(15000);
  const [seats, setSeats] = useState(5);
  const [transmission, setTransmission] = useState<TransmissionType>('automatic');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [operationalState, setOperationalState] = useState<VehicleOperationalState>('ready');

  useEffect(() => {
    if (vehicle) {
      setMake(vehicle.make);
      setModel(vehicle.model);
      setYear(vehicle.year);
      setPlate(vehicle.plate);
      setCategory(vehicle.category);
      setBranchCity(vehicle.branch?.city === 'Abuja' ? 'Abuja' : 'Lagos');
      setDailyRateNaira(vehicle.baseRateMinor / 100);
      setOdometer(vehicle.currentOdometerKm);
      setSeats(vehicle.seats);
      setTransmission(vehicle.transmission);
      setFuelType(vehicle.fuelType);
      setOperationalState(vehicle.operationalState);
    }
  }, [vehicle]);

  if (!vehicle) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-900">Vehicle Not Found</h2>
        <Link to="/admin/vehicles" className="text-xs text-blue-600 font-bold mt-2 inline-block">
          Return to Fleet Register
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const branchId =
      branchCity === 'Abuja'
        ? 'b0000000-0000-0000-0000-000000000002'
        : 'b0000000-0000-0000-0000-000000000001';

    updateVehicle(vehicle.id, {
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      plate: plate.trim().toUpperCase(),
      category,
      branchId,
      branch: {
        id: branchId,
        orgId: 'org-001',
        name: branchCity === 'Abuja' ? 'Abuja Central Terminal' : 'Lagos Ikeja Main Hub',
        city: branchCity,
        active: true,
        createdAt: vehicle.branch?.createdAt || new Date().toISOString(),
      },
      baseRateMinor: dailyRateNaira * 100,
      currentOdometerKm: Number(odometer),
      seats: Number(seats),
      transmission,
      fuelType,
      operationalState,
    });

    navigate(`/admin/vehicles/${vehicle.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to={`/admin/vehicles/${vehicle.id}`}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Edit Vehicle Record ({vehicle.plate})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">VIN/ID: {vehicle.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <span>Specifications & Identification</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Make</label>
              <input
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Model</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
              <input
                type="number"
                min={2018}
                max={2027}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Plate Number</label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="suv">SUV / 4x4</option>
                <option value="sedan">Executive Sedan</option>
                <option value="luxury">Luxury / VIP Diplomatic</option>
                <option value="economy">Economy Compact</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hub Location</label>
              <select
                value={branchCity}
                onChange={(e) => setBranchCity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Lagos">Lagos – Ikeja Main Hub</option>
                <option value="Abuja">Abuja – Central Terminal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Telemetry */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Tariff, Telemetry & Status</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Base Rate (₦)</label>
              <input
                type="number"
                min={10000}
                step={1000}
                value={dailyRateNaira}
                onChange={(e) => setDailyRateNaira(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Odometer (km)</label>
              <input
                type="number"
                min={0}
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operational State</label>
              <select
                value={operationalState}
                onChange={(e) => setOperationalState(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ready">Ready for Dispatch</option>
                <option value="in_maintenance">In Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            to={`/admin/vehicles/${vehicle.id}`}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Update Vehicle Record</span>
          </button>
        </div>
      </form>
    </div>
  );
}
