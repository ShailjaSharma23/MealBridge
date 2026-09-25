import React from 'react';
import { Award, PackageCheck, Users, ShieldCheck } from 'lucide-react';

const VolunteerStats = ({ stats }) => {
  const completed = stats?.completedRescuesCount ?? 0;
  const kgDelivered = stats?.totalKgDelivered ?? 0;
  const sheltersServed = stats?.communitiesServed ?? 0;
  const certs = stats?.certificatesEarned ?? 0;
  const isNew = stats?.isNewUser || completed === 0;

  const statItems = [
    {
      label: 'Deliveries Completed',
      value: completed,
      sub: completed === 0 ? 'Ready for Mission 1' : 'All On-Time',
      icon: PackageCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Food Rescued',
      value: `${kgDelivered} kg`,
      sub: kgDelivered === 0 ? 'Start Delivering' : 'Surplus Saved',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      label: 'Shelters Served',
      value: sheltersServed,
      sub: 'Neighborhood Centers',
      icon: Users,
      color: 'bg-sage-50 text-sage-600 border-sage-200',
    },
    {
      label: 'Impact Certificates',
      value: certs,
      sub: certs === 0 ? 'Complete 1 to Unlock' : 'Verified Volunteer',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-border shadow-card mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider">
            Your Track Record
          </div>
          <h3 className="font-display font-black text-2xl text-forest">
            Volunteer Rescue Milestones
          </h3>
        </div>
        <div className="text-xs font-bold text-forest/60">
          Rank:{' '}
          <span className="text-sunburst-600 font-extrabold">
            {completed >= 10
              ? '🌟 Master Courier'
              : completed >= 3
              ? '⚡ Active Volunteer'
              : '🌱 Rookie Courier'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-warm/60 border border-warm-border/80 flex flex-col items-center text-center hover:bg-white transition-all duration-200 shadow-sm"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${item.color} border flex items-center justify-center mb-3 shadow-xs`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-forest tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-bold text-forest/80 mt-1">{item.label}</div>
              <div className="text-[11px] text-forest/50 font-medium">{item.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VolunteerStats;
