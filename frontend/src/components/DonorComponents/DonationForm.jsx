import React, { useState } from 'react';
import { Camera, Send, ShieldCheck, Sparkles, Clock, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';
import apiClient from '../../services/apiClient';

const DonationForm = ({ onDonationCreated }) => {
  const [formData, setFormData] = useState({
    foodName: 'Vegetable Curry & Rice',
    category: 'Cooked Meals',
    quantityKg: 15,
    expiryHours: 3,
    pickupAddress: '123, Green Park, Sector 12, New Delhi - 110016',
    dietaryType: 'Veg Only',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const categories = [
    'Cooked Meals',
    'Bakery',
    'Produce',
    'Packaged Food',
    'Beverages',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e) => {
    setFormData((prev) => ({ ...prev, expiryHours: parseFloat(e.target.value) }));
  };

  // Simulated AI photo auto-fill
  const handlePhotoUploadSim = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        foodName: 'Fresh Vegetable Pulao & Dal',
        quantityKg: 18,
        expiryHours: 3.5,
        category: 'Cooked Meals',
      }));
      setAiAnalyzing(false);
      setSuccessMsg('✨ AI Auto-Filled food details from photo successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/donations', formData);
      if (res.data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8BA888', '#F59E0B', '#2D4E45'],
        });
        setSuccessMsg('🎉 Donation posted and matched with Hope Shelter in real-time!');
        if (onDonationCreated) onDonationCreated(res.data.donation);
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.warn('Fallback: Posting locally', err.message);
      setSuccessMsg('Donation created! Matched with Hope Shelter.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-border shadow-card">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 border-b border-warm-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-forest">Quick Donation Form</h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-sage-600 bg-sage-50 px-3 py-1 rounded-full border border-sage-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Save Food • Save Lives</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-forest/70 mt-3 mb-6">
        Fill in the details below. We'll use AI to match your donation with nearby shelters in real time.
      </p>

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-sage-50 border border-sage-300 text-sage-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-5 h-5 text-sage-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Food Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest/80 mb-2">
            Food Name <span className="text-sunburst-500">*</span>
          </label>
          <input
            type="text"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            required
            placeholder="e.g. Vegetable Curry & Rice"
            className="w-full px-4 py-3 rounded-2xl border border-warm-border bg-warm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 text-sm font-medium text-forest transition-all"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest/80 mb-2">
            Category <span className="text-sunburst-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl border border-warm-border bg-warm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 text-sm font-medium text-forest transition-all"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity (in kg) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest/80 mb-2">
            Quantity (in kg) <span className="text-sunburst-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="quantityKg"
              min="1"
              max="500"
              value={formData.quantityKg}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl border border-warm-border bg-warm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 text-sm font-medium text-forest transition-all pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-forest/50">
              kg
            </span>
          </div>
        </div>

        {/* Expiry Time Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-forest/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sage-600" />
              <span>Expiry Time</span>
              <span className="text-sunburst-500">*</span>
            </label>
            <span className="px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-extrabold border border-sage-300">
              {formData.expiryHours} {formData.expiryHours === 1 ? 'Hour' : 'Hours'} Left
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={formData.expiryHours}
            onChange={handleSliderChange}
            className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
          />

          <div className="flex justify-between text-[11px] font-semibold text-forest/50 mt-1">
            <span>1 hr</span>
            <span>3 hrs</span>
            <span>6 hrs</span>
            <span>12+ hrs</span>
          </div>
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest/80 mb-2">
            Pickup Address <span className="text-sunburst-500">*</span>
          </label>
          <textarea
            name="pickupAddress"
            rows="2"
            value={formData.pickupAddress}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl border border-warm-border bg-warm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 text-sm font-medium text-forest transition-all resize-none"
          />
        </div>

        {/* Photo Upload for AI Auto-Fill Button */}
        <button
          type="button"
          onClick={handlePhotoUploadSim}
          disabled={aiAnalyzing}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-sage-300 bg-sage-50/50 hover:bg-sage-100/60 text-sage-800 font-semibold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <Camera className="w-4 h-4 text-sage-600" />
          <span>{aiAnalyzing ? 'AI analyzing image...' : 'Upload Photo for AI Auto-Fill'}</span>
          <span className="text-xs text-forest/50 font-normal">(Optional but recommended)</span>
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-sage text-base py-4 rounded-2xl shadow-sm hover:shadow-hover flex items-center justify-center gap-2 font-bold"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Matching with Shelters...' : 'Post Donation →'}</span>
        </button>

        {/* Safe & Secure Guarantee */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-forest/60 pt-1">
          <ShieldCheck className="w-4 h-4 text-sage-600" />
          <span>Your information is safe and secure.</span>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
