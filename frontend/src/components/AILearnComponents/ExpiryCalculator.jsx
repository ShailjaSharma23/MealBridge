import React, { useState } from 'react';
import { Gauge, Clock, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import apiClient from '../../services/apiClient';

const ExpiryCalculator = () => {
  const [foodType, setFoodType] = useState('Cooked Rice');
  const [hoursCooked, setHoursCooked] = useState(2.0);
  const [storageType, setStorageType] = useState('room_temp');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    safetyScore: 85,
    status: 'Safe',
    urgencyClass: 'safe',
    recommendation: 'Donate Within 2.0 Hours',
    temperatureNote: 'Room Temperature (~25°C)',
    proTip: 'Keep cooked food covered. If refrigerated within 2 hours, shelf life extends up to 48 hours.',
  });

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/ai/calculate-expiry', {
        foodType,
        hoursSinceCooked: hoursCooked,
      });

      if (res.data.success && res.data.calculation) {
        setResult(res.data.calculation);
      }
    } catch (err) {
      console.warn('Fallback calculation:', err.message);
      // Fallback calculation logic
      let score = Math.max(15, Math.round(100 - hoursCooked * 22));
      let status = score > 60 ? 'Safe' : score > 35 ? 'Moderate Risk' : 'High Risk';
      let urgencyClass = score > 60 ? 'safe' : score > 35 ? 'warning' : 'danger';
      setResult({
        safetyScore: score,
        status,
        urgencyClass,
        recommendation: score > 50 ? `Donate within ${(4 - hoursCooked).toFixed(1)} hrs` : 'Unsafe for consumption',
        temperatureNote: storageType === 'refrigerated' ? 'Refrigerated (<5°C)' : 'Room Temperature (~25°C)',
        proTip: 'Maintain temperature control (<5°C or >60°C) to prevent rapid microbial growth.',
      });
    } finally {
      setLoading(false);
    }
  };

  // SVG Gauge calculations (radius = 50, circumference = 2 * PI * 50 = 314.159)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.safetyScore / 100) * circumference;

  const getScoreColor = () => {
    if (result.safetyScore >= 70) return '#10B981'; // Emerald
    if (result.safetyScore >= 45) return '#F59E0B'; // Amber
    return '#EF4444'; // Rose
  };

  return (
    <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-card flex flex-col justify-between h-[560px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sunburst-100 text-sunburst-700 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-forest">
                Expiry Risk Calculator
              </h3>
              <div className="text-[11px] text-forest/60">
                AI Bacterial Growth & Safe Window Estimator
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-sage-100 text-sage-800">
            FSSAI Rule Engine
          </span>
        </div>

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 gap-4 my-5">
          {/* Food Type Selector */}
          <div>
            <label className="block text-xs font-bold text-forest mb-1">
              Food Category
            </label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full bg-warm border border-warm-border rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              <option value="Cooked Rice">Cooked Rice / Pulao</option>
              <option value="Vegetable Curry">Vegetable Curry / Gravy</option>
              <option value="Dal & Lentils">Dal & Lentils</option>
              <option value="Bread / Bakery">Bread & Bakery Goods</option>
              <option value="Fresh Fruits / Produce">Fresh Fruits & Salads</option>
              <option value="Dairy / Paneer">Dairy / Paneer Dishes</option>
              <option value="Cooked Pasta">Cooked Pasta & Noodles</option>
            </select>
          </div>

          {/* Storage Condition */}
          <div>
            <label className="block text-xs font-bold text-forest mb-1">
              Holding Temperature
            </label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value)}
              className="w-full bg-warm border border-warm-border rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              <option value="room_temp">Room Temperature (~25°C)</option>
              <option value="refrigerated">Refrigerated (&lt;5°C)</option>
              <option value="hot_holding">Hot Insulated (&gt;60°C)</option>
            </select>
          </div>
        </div>

        {/* Hours Elapsed Slider */}
        <div className="bg-warm/60 p-4 rounded-2xl border border-warm-border/80 mb-5">
          <div className="flex justify-between items-center text-xs font-bold text-forest mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sage-600" />
              <span>Hours Since Preparation:</span>
            </span>
            <span className="font-mono text-base font-extrabold text-sunburst-600">
              {hoursCooked} hrs
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="8.0"
            step="0.5"
            value={hoursCooked}
            onChange={(e) => setHoursCooked(parseFloat(e.target.value))}
            className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
          />

          <div className="flex justify-between text-[10px] text-forest/50 font-bold mt-1">
            <span>Just Cooked (0.5h)</span>
            <span>2.0h (Safety Limit)</span>
            <span>8.0h (Max)</span>
          </div>
        </div>
      </div>

      {/* SVG Score Gauge & Output */}
      <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 flex items-center gap-6">
        {/* Circular SVG Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={getScoreColor()}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display font-black text-2xl text-forest leading-none">
              {result.safetyScore}%
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-forest/60">
              Safety Score
            </span>
          </div>
        </div>

        {/* Gauge Text Feedback */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider mb-1"
               style={{ backgroundColor: `${getScoreColor()}20`, color: getScoreColor() }}>
            {result.safetyScore >= 60 ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>{result.status}</span>
          </div>

          <div className="font-display font-extrabold text-sm text-forest leading-snug">
            {result.recommendation}
          </div>

          <div className="text-[11px] text-forest/70 mt-1 leading-relaxed">
            {result.proTip}
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mt-4">
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full btn-sage py-3 rounded-2xl text-xs font-bold shadow-sm hover:shadow-hover flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Microbiological Curve...' : 'Re-Calculate Safety Window'}</span>
        </button>
      </div>
    </div>
  );
};

export default ExpiryCalculator;
