import React from 'react';
import { TrendingUp, Utensils, Users, Home, CloudSun } from 'lucide-react';

const ImpactStatCards = ({ impact }) => {
  const cards = [
    {
      label: 'Total Food Rescued',
      value: `${(impact?.totalFoodRescuedKg || 12480).toLocaleString()} kg`,
      growth: `+${impact?.monthlyGrowthPercentage?.foodRescued || 24}%`,
      sub: 'vs last month',
      icon: Utensils,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'People Nourished',
      value: (impact?.totalPeopleFed || 3240).toLocaleString(),
      growth: `+${impact?.monthlyGrowthPercentage?.peopleFed || 18}%`,
      sub: 'meals delivered',
      icon: Users,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      label: 'Shelters Supported',
      value: (impact?.totalSheltersSupported || 48).toString(),
      growth: `+${impact?.monthlyGrowthPercentage?.sheltersSupported || 12}%`,
      sub: 'verified NGOs',
      icon: Home,
      color: 'bg-sage-50 text-sage-600 border-sage-200',
    },
    {
      label: 'CO2 Avoided',
      value: `${impact?.totalCo2SavedTons || 18.6} tons`,
      growth: `+${impact?.monthlyGrowthPercentage?.co2Saved || 27}%`,
      sub: 'greenhouse gas reduction',
      icon: CloudSun,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-warm-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${c.color} border flex items-center justify-center shadow-xs`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-3 h-3" />
                <span>{c.growth}</span>
              </span>
            </div>

            <div>
              <div className="font-display font-black text-2xl sm:text-3xl text-forest tracking-tight">
                {c.value}
              </div>
              <div className="text-xs font-bold text-forest/80 mt-1">{c.label}</div>
              <div className="text-[11px] text-forest/50 font-medium">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImpactStatCards;
