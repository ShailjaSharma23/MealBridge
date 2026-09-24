import React from 'react';
import { Layers, MapPin, Zap } from 'lucide-react';

const JobFilterTabs = ({ activeFilter, onFilterChange, counts }) => {
  const tabs = [
    {
      id: 'all',
      label: 'All Available',
      count: counts?.all ?? 6,
      icon: Layers,
    },
    {
      id: 'near_me',
      label: 'Near Me (<3km)',
      count: counts?.near ?? 3,
      icon: MapPin,
    },
    {
      id: 'urgent',
      label: 'Urgent (<90 mins)',
      count: counts?.urgent ?? 2,
      icon: Zap,
      urgentBadge: true,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
              isActive
                ? 'bg-forest text-white border-forest shadow-md scale-105'
                : 'bg-white text-forest/70 border-warm-border hover:bg-sage-50/70 hover:text-forest'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sunburst-400' : 'text-sage-600'}`} />
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : tab.urgentBadge
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-sage-100 text-sage-800'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default JobFilterTabs;
