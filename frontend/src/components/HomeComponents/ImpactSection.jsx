import React, { useState, useEffect } from 'react';
import { Utensils, Users, Home, Leaf } from 'lucide-react';
import apiClient from '../../services/apiClient';

const ImpactSection = () => {
  const [stats, setStats] = useState({
    foodRescuedKg: 12480,
    peopleFed: 3240,
    sheltersSupported: 48,
    co2SavedTons: 18.6,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/impact');
        if (res.data.success && res.data.impact) {
          setStats({
            foodRescuedKg: res.data.impact.totalFoodRescuedKg || 12480,
            peopleFed: res.data.impact.totalPeopleFed || 3240,
            sheltersSupported: res.data.impact.totalSheltersSupported || 48,
            co2SavedTons: res.data.impact.totalCo2SavedTons || 18.6,
          });
        }
      } catch (err) {
        console.warn('Using default impact stats:', err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-16 bg-white/70 border-y border-warm-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Intro Text */}
          <div className="lg:col-span-4">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
              Real Food. <br />
              <span className="text-sage-600">Real Impact.</span>
            </h2>
            <p className="mt-3 text-sm text-forest/70 leading-relaxed max-w-sm">
              Together, we can reduce food waste, feed more people and build stronger, healthier communities.
            </p>
          </div>

          {/* Right 4 Metric Badges */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* Stat 1: Food Rescued */}
            <div className="text-center p-4 rounded-3xl bg-warm border border-warm-border/80">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-3">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-forest">
                {stats.foodRescuedKg.toLocaleString()} <span className="text-sm font-semibold">kg</span>
              </div>
              <div className="text-xs text-forest/60 font-medium mt-1">Food Rescued</div>
              <div className="text-[10px] text-sage-600 font-bold mt-0.5">(this month)</div>
            </div>

            {/* Stat 2: People Fed */}
            <div className="text-center p-4 rounded-3xl bg-warm border border-warm-border/80">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100/70 text-amber-700 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-forest">
                {stats.peopleFed.toLocaleString()}
              </div>
              <div className="text-xs text-forest/60 font-medium mt-1">People Fed</div>
              <div className="text-[10px] text-sunburst-600 font-bold mt-0.5">(this month)</div>
            </div>

            {/* Stat 3: Shelters Supported */}
            <div className="text-center p-4 rounded-3xl bg-warm border border-warm-border/80">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-100/70 text-teal-700 flex items-center justify-center mb-3">
                <Home className="w-6 h-6" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-forest">
                {stats.sheltersSupported}
              </div>
              <div className="text-xs text-forest/60 font-medium mt-1">Shelters Supported</div>
              <div className="text-[10px] text-sage-600 font-bold mt-0.5">(this month)</div>
            </div>

            {/* Stat 4: CO2 Saved */}
            <div className="text-center p-4 rounded-3xl bg-warm border border-warm-border/80">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-100/70 text-orange-700 flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-forest">
                {stats.co2SavedTons} <span className="text-sm font-semibold">tons</span>
              </div>
              <div className="text-xs text-forest/60 font-medium mt-1">CO₂ Saved</div>
              <div className="text-[10px] text-sunburst-600 font-bold mt-0.5">(this month)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
