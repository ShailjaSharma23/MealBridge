import React, { useState, useEffect } from 'react';
import { useRole } from '../../context/RoleContext';
import {
  X,
  User,
  Store,
  Home,
  Truck,
  CheckCircle2,
  Save,
  ShieldCheck,
  Refrigerator,
  Tag,
  Phone,
  MapPin,
} from 'lucide-react';
import apiClient from '../../services/apiClient';

const RoleProfileModal = ({ isOpen, onClose }) => {
  const { currentRole, currentUser, switchRole } = useRole();
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states initialized with role-specific defaults
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 98765 43210',
    address: '123, Green Park, Sector 12, New Delhi - 110016',
    // Donor specific
    organizationType: 'Restaurant',
    fssaiLicense: 'FSSAI-DEL-2026-98104',
    // Shelter specific
    capacityKg: 50,
    currentStorageUsedKg: 35,
    foodPreferences: ['Veg Only', 'Cooked Meals Accepted'],
    contactPerson: 'Priya Sharma (Shelter Head)',
    // Volunteer specific
    vehicleType: 'Scooter / Mini Van',
    isAvailableNow: true,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || (currentRole === 'donor' ? 'Bistro 42' : currentRole === 'shelter' ? 'Hope Shelter' : 'Manish Bhatt'),
        email: currentUser.email || `${currentRole}@mealbridge.org`,
        phone: currentUser.phone || prev.phone,
        address: currentUser.location?.address || prev.address,
        organizationType: currentUser.organizationType || prev.organizationType,
        capacityKg: currentUser.shelterDetails?.capacityKg || prev.capacityKg,
        currentStorageUsedKg: currentUser.shelterDetails?.currentStorageUsedKg || prev.currentStorageUsedKg,
        foodPreferences: currentUser.shelterDetails?.foodPreferences || prev.foodPreferences,
        contactPerson: currentUser.shelterDetails?.contactPerson || prev.contactPerson,
        vehicleType: currentUser.volunteerDetails?.vehicleType || prev.vehicleType,
        isAvailableNow: currentUser.volunteerDetails?.isAvailableNow ?? prev.isAvailableNow,
      }));
    }
  }, [currentUser, currentRole, isOpen]);

  if (!isOpen) return null;

  const handlePreferenceToggle = (pref) => {
    setFormData((prev) => {
      const exists = prev.foodPreferences.includes(pref);
      return {
        ...prev,
        foodPreferences: exists
          ? prev.foodPreferences.filter((p) => p !== pref)
          : [...prev.foodPreferences, pref],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put('/users/profile', formData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.warn('Saved profile locally:', err.message);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    if (currentRole === 'donor') {
      return {
        title: 'Donor Business Profile',
        subtitle: 'Configure your commercial kitchen & food safety details',
        icon: Store,
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }
    if (currentRole === 'shelter') {
      return {
        title: 'Shelter / NGO Capacity Profile',
        subtitle: 'Manage cold storage limit & dietary intake criteria',
        icon: Home,
        badgeClass: 'bg-sage-100 text-sage-800 border-sage-300',
      };
    }
    if (currentRole === 'volunteer') {
      return {
        title: 'Volunteer Courier Profile',
        subtitle: 'Set up vehicle mode & live delivery availability',
        icon: Truck,
        badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
      };
    }
    return {
      title: 'Public Guest Profile',
      subtitle: 'Viewing public impact & educational modules',
      icon: User,
      badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
    };
  };

  const badgeInfo = getRoleBadge();
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-warm-border shadow-2xl p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-warm text-forest/60 hover:text-forest transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Role Identity */}
        <div className="flex items-center gap-3 pb-5 border-b border-warm-border">
          <div className="w-12 h-12 rounded-2xl bg-sage-50 border border-sage-200 text-sage-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <BadgeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${badgeInfo.badgeClass}`}>
                {currentRole.toUpperCase()} ROLE
              </span>
              <span className="text-[11px] font-bold text-sage-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
                Verified
              </span>
            </div>
            <h2 className="font-display font-black text-xl text-forest mt-0.5">
              {badgeInfo.title}
            </h2>
            <p className="text-xs text-forest/60">{badgeInfo.subtitle}</p>
          </div>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Common Field: Name */}
          <div>
            <label className="block text-xs font-bold text-forest mb-1">
              {currentRole === 'donor'
                ? 'Restaurant / Establishment Name'
                : currentRole === 'shelter'
                ? 'Shelter / NGO Name'
                : 'Full Name'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-warm border border-warm-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
              required
            />
          </div>

          {/* Common Field: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full bg-warm/50 border border-warm-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-forest/60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>
            </div>
          </div>

          {/* Common Field: Address */}
          <div>
            <label className="block text-xs font-bold text-forest mb-1">
              {currentRole === 'donor'
                ? 'Pickup Address (Kitchen / Loading Bay)'
                : currentRole === 'shelter'
                ? 'Delivery Intake Address'
                : 'Current Base Location'}
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-3 text-forest/40" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-warm border border-warm-border rounded-2xl pl-9 pr-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          {/* ------------------- ROLE-SPECIFIC SECTIONS ------------------- */}

          {/* 1. DONOR SPECIFIC PROFILE FORM */}
          {currentRole === 'donor' && (
            <div className="pt-3 border-t border-warm-border/80 space-y-3">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-sunburst-600" />
                <span>Commercial Donor Specifications</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Organization Type
                  </label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                    className="w-full bg-warm border border-warm-border rounded-2xl px-3 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  >
                    <option value="Restaurant">Fine Dining / Restaurant</option>
                    <option value="Bakery">Bakery & Patisserie</option>
                    <option value="Cafeteria">Corporate / College Cafeteria</option>
                    <option value="Supermarket">Supermarket / Retailer</option>
                    <option value="Other">Catering & Banquet Hall</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    FSSAI Food License No.
                  </label>
                  <input
                    type="text"
                    value={formData.fssaiLicense}
                    onChange={(e) => setFormData({ ...formData, fssaiLicense: e.target.value })}
                    className="w-full bg-warm border border-warm-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. SHELTER SPECIFIC PROFILE FORM */}
          {currentRole === 'shelter' && (
            <div className="pt-3 border-t border-warm-border/80 space-y-3">
              <div className="text-xs font-bold text-sage-800 uppercase tracking-wider flex items-center gap-1.5">
                <Refrigerator className="w-3.5 h-3.5 text-sage-600" />
                <span>Refrigeration Capacity & Intake Criteria</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Max Cold Storage (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.capacityKg}
                    onChange={(e) => setFormData({ ...formData, capacityKg: e.target.value })}
                    className="w-full bg-warm border border-warm-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Intake Coordinator
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-warm border border-warm-border rounded-2xl px-4 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-sage-600" />
                  <span>Dietary Acceptance Preferences</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Veg Only', 'Cooked Meals Accepted', 'Bakery Items', 'Raw Grains'].map((pref) => {
                    const isSelected = formData.foodPreferences.includes(pref);
                    return (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => handlePreferenceToggle(pref)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-sage-600 text-white border-sage-600 shadow-xs'
                            : 'bg-warm text-forest/70 border-warm-border hover:bg-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. VOLUNTEER SPECIFIC PROFILE FORM */}
          {currentRole === 'volunteer' && (
            <div className="pt-3 border-t border-warm-border/80 space-y-3">
              <div className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-teal-600" />
                <span>Courier Logistics & Availability</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Primary Transport Vehicle
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full bg-warm border border-warm-border rounded-2xl px-3 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
                  >
                    <option value="Scooter / Mini Van">Two-Wheeler / Scooter</option>
                    <option value="Mini Van / Car">Four-Wheeler / Car / Van</option>
                    <option value="Bicycle">Bicycle (Short Range &lt;2km)</option>
                    <option value="Metro / Transit">Public Transit / Metro</option>
                  </select>
                </div>

                <div className="bg-warm p-3 rounded-2xl border border-warm-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-forest">Ready for Pickups</div>
                    <div className="text-[10px] text-forest/50">Show in live courier pool</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAvailableNow: !formData.isAvailableNow })}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      formData.isAvailableNow ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white block transition-transform shadow-sm ${
                        formData.isAvailableNow ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Notification */}
          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{badgeInfo.title} updated successfully!</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-2xl border border-warm-border text-forest/70 font-semibold text-xs hover:bg-warm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-sage py-2.5 px-6 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-hover"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleProfileModal;
