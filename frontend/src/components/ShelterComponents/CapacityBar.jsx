import React, { useState, useEffect } from 'react';
import { Home, Refrigerator, Tag, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useRole } from '../../context/RoleContext';

const CapacityBar = ({ capacityTrigger }) => {
  const { currentUser } = useRole();
  const [capacity, setCapacity] = useState({
    name: currentUser?.name || '',
    capacityKg: currentUser?.shelterDetails?.capacityKg ?? 50,
    currentStorageUsedKg: currentUser?.shelterDetails?.currentStorageUsedKg ?? (currentUser ? 0 : 35),
    foodPreferences: currentUser?.shelterDetails?.foodPreferences?.length > 0
      ? currentUser.shelterDetails.foodPreferences
      : ['Veg Only', 'Cooked Meals Accepted'],
    percentageUsed: currentUser
      ? Math.min(100, Math.round(((currentUser?.shelterDetails?.currentStorageUsedKg ?? 0) / (currentUser?.shelterDetails?.capacityKg || 50)) * 100))
      : 70,
  });

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        const res = await apiClient.get('/shelters/capacity');
        if (res.data.success) {
          setCapacity(res.data);
        }
      } catch (err) {
        console.warn('Using default capacity data:', err.message);
      }
    };
    fetchCapacity();
  }, [capacityTrigger, currentUser]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-border shadow-card mb-10">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Shelter Capacity Usage */}
        <div className="lg:col-span-7 flex items-start gap-4">
          <div className="w-16 h-16 rounded-3xl bg-sage-50 border border-sage-200 text-sage-600 flex items-center justify-center flex-shrink-0">
            <Home className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <div className="text-xs font-semibold text-sage-600 tracking-wider">
              Together We Feed • Stronger Communities
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-forest mt-0.5">
              {capacity.name ? `${capacity.name} Capacity` : 'Shelter Capacity'}
            </h2>

            {/* Refrigerator Storage Bar */}
            <div className="mt-3 bg-warm p-4 rounded-2xl border border-warm-border">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-forest mb-2">
                <span className="flex items-center gap-2">
                  <Refrigerator className="w-4 h-4 text-sage-600" />
                  <span>Current Refrigeration Storage</span>
                </span>
                <span className="font-mono text-sage-700">
                  <strong className="text-forest text-base">{capacity.currentStorageUsedKg ?? 0}kg</strong> / {capacity.capacityKg || 50}kg Used
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-sage-100 rounded-full h-3 overflow-hidden p-0.5 border border-sage-200">
                <div
                  className="bg-sage-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, capacity.percentageUsed ?? 0))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-forest/50 mt-1.5">
                <span>0 kg</span>
                <span className="text-sage-700 font-bold">{capacity.percentageUsed ?? 0}% Used</span>
                <span>{capacity.capacityKg || 50} kg Max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Shelter Food Preferences */}
        <div className="lg:col-span-5 bg-sage-50/70 p-5 rounded-2xl border border-sage-200/80">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-forest/80 mb-3">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sage-600" />
              <span>Your Food Preferences</span>
            </span>
            <span className="text-xs text-sage-600 font-bold">Active &gt;</span>
          </div>

          {/* Preference Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {capacity.foodPreferences.map((pref) => (
              <span
                key={pref}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-forest border border-sage-300 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-500" />
                <span>{pref}</span>
              </span>
            ))}
          </div>

          <p className="text-xs text-forest/70 leading-relaxed">
            We prioritize matching with food that fits your shelter's dietary requirements and cold storage capacity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CapacityBar;
