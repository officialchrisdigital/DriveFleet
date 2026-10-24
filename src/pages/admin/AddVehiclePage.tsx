import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { VehicleCategory, TransmissionType, FuelType } from '@/lib/types';
import {
  Car, ArrowLeft, CheckCircle2, ShieldCheck,
  DollarSign, MapPin, Gauge
} from 'lucide-react';

export function AddVehiclePage() {
  const { addVehicle } = useOperations();
  const navigate = useNavigate();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2025);
  const [plate, setPlate] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('suv');
  const [branchCity, setBranchCity] = useState<'Lagos' | 'Abuja'>('Lagos');
  const [dailyRateNaira, setDailyRateNaira] = useState(55000);
  const [odometer, setOdometer] = useState(15000);
  const [seats, setSeats] = useState(5);
  const [transmission, setTransmission] = useState<TransmissionType>('automatic');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) {
      setError('Vehicle make and model are required.');
      return;
    }
    if (!plate.trim()) {
      setError('License plate number is required.');
      return;
    }

    const branchId =
      branchCity === 'Abuja'
        ? 'b0000000-0000-0000-0000-000000000002'
        : 'b0000000-0000-0000-0000-000000000001';

    const defaultImages: Record<VehicleCategory, string> = {
      suv: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      sedan: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
      luxury: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
      economy: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    };

    const newVehicle = addVehicle({
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
        createdAt: new Date().toISOString(),
      },
      baseRateMinor: dailyRateNaira * 100,
      currentOdometerKm: Number(odometer),
      seats: Number(seats),
      transmission,
      fuelType,
      operationalState: 'ready',
      images: imageUrl.trim() ? [imageUrl.trim()] : [defaultImages[category]],
    });

    navigate(`/admin/vehicles/${newVehicle.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to="/admin/vehicles"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Provision New Fleet Vehicle
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin inventory intake form for plate registration, hub assignment, and tariff governance.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <span>Vehicle Specifications & Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Make <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Toyota"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Prado TXL"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Model Year</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                License Plate <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="e.g. LAG-912-PR"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dispatch Hub Node</label>
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
            <span>Tariff & Odometer Telemetry</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily Base Rate (₦) <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Odometer (km)
              </label>
              <input
                type="number"
                min={0}
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passenger Capacity</label>
              <input
                type="number"
                min={2}
                max={15}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="petrol">Petrol (PMS)</option>
                <option value="diesel">Diesel (AGO)</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric (EV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Photo URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Optional (defaults to category photo)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            to="/admin/vehicles"
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Provision Vehicle into Active Fleet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
