import React from 'react';
import { Store, Home, CheckCircle2, ArrowRight } from 'lucide-react';

const RecentRescuesLedger = () => {
  const rescues = [
    {
      id: 'RES-8042',
      donor: 'Bistro 42',
      shelter: 'Hope Shelter',
      item: '15 kg Cooked Rice & Curry',
      category: 'Cooked Meals',
      time: '12 mins ago',
      status: 'Delivered',
    },
    {
      id: 'RES-8041',
      donor: 'Green Valley Cafe',
      shelter: 'Sunshine Food Bank',
      item: '12 kg Vegetable Pasta',
      category: 'Cooked Meals',
      time: '34 mins ago',
      status: 'Delivered',
    },
    {
      id: 'RES-8040',
      donor: 'Fresh Bites Bakery',
      shelter: 'Care Haven Shelter',
      item: '8 kg Assorted Bread & Sandwiches',
      category: 'Bakery',
      time: '1 hr ago',
      status: 'Delivered',
    },
    {
      id: 'RES-8039',
      donor: 'City Bites',
      shelter: 'Aashray Shelter',
      item: '10 kg Dal Tadka & Jeera Rice',
      category: 'Cooked Meals',
      time: '2 hrs ago',
      status: 'Delivered',
    },
    {
      id: 'RES-8038',
      donor: 'Healthy House Organic',
      shelter: 'Lajpat Care Home',
      item: '14 kg Fresh Salads & Fruit Medley',
      category: 'Produce',
      time: '3 hrs ago',
      status: 'Delivered',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-warm-border shadow-card mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider">
            Public Audit Trail
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-forest">
            Recent Verified Food Rescues
          </h3>
          <p className="text-xs text-forest/60 mt-0.5">
            Real-time immutable log of surplus food dispatched and safely delivered.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-warm-border text-forest/50 font-bold uppercase tracking-wider text-[11px]">
              <th className="pb-3 pl-2">Rescue ID</th>
              <th className="pb-3">Donor &rarr; Shelter</th>
              <th className="pb-3">Food Item</th>
              <th className="pb-3">Delivered</th>
              <th className="pb-3 pr-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-border/60 font-medium text-forest">
            {rescues.map((r) => (
              <tr key={r.id} className="hover:bg-warm/40 transition-colors">
                <td className="py-3.5 pl-2 font-mono font-bold text-sage-800">
                  {r.id}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-sunburst-700">{r.donor}</span>
                    <ArrowRight className="w-3 h-3 text-forest/30" />
                    <span className="text-sage-700">{r.shelter}</span>
                  </div>
                </td>
                <td className="py-3.5">
                  <div className="font-semibold">{r.item}</div>
                  <div className="text-[10px] text-forest/50">{r.category}</div>
                </td>
                <td className="py-3.5 text-forest/70 font-medium">
                  {r.time}
                </td>
                <td className="py-3.5 pr-2 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{r.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRescuesLedger;
