import React from 'react';
import { ShieldAlert, Scale, CheckSquare2, FileCheck2, Thermometer, HeartHandshake } from 'lucide-react';

const GuidelinesCards = () => {
  const cards = [
    {
      title: 'Food Safety Standards',
      badge: 'FSSAI Standards',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: Thermometer,
      iconColor: 'bg-emerald-50 text-emerald-600',
      points: [
        '2-Hour Rule: Cooked meals must be claimed & transported within 120 mins of cooking.',
        'Temperature Control: Maintain hot food >60°C or chill rapidly to <5°C before transit.',
        'Zero Buffet Scrapings: Only untouched, properly sealed kitchen batches are accepted.',
      ],
    },
    {
      title: 'Legal & 80G Tax Protections',
      badge: 'Govt Compliant',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Scale,
      iconColor: 'bg-amber-50 text-amber-600',
      points: [
        'Good Samaritan Protection: Full civil immunity for donors providing food in good faith.',
        'Section 80G Tax Deductions: Automated tax receipts generated for every verified donation.',
        'Corporate ESG Reports: Monthly audits ready for CSR & ESG green board disclosures.',
      ],
    },
    {
      title: 'Shelter Handling Protocols',
      badge: 'Best Practices',
      badgeColor: 'bg-teal-100 text-teal-800',
      icon: HeartHandshake,
      iconColor: 'bg-teal-50 text-teal-600',
      points: [
        'Intake Verification: Shelters perform temperature & olfactory checks upon delivery.',
        'First-In, First-Out (FIFO): Prioritize consumption of shortest shelf-life meals.',
        'Capacity Guard: Automatic 15-min cascade ensures no shelter receives beyond cold storage limits.',
      ],
    },
  ];

  return (
    <div className="mt-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-xs font-semibold text-sage-600 tracking-wider">
          Compliance & Best Practices
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-forest mt-0.5">
          Essential Food Rescue Guidelines
        </h2>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Everything donors, shelters, and volunteers need to know about safety protocols and legal safeguards.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-warm-border shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${card.iconColor} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-forest mb-4">
                  {card.title}
                </h3>

                <ul className="space-y-3">
                  {card.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs text-forest/80 leading-relaxed">
                      <CheckSquare2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-warm-border/60 flex items-center gap-1.5 text-[11px] font-bold text-sage-700">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Verified by MealBridge Safety Board</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuidelinesCards;
