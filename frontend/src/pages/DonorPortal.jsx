import React, { useState } from 'react';
import DonationForm from '../components/DonorComponents/DonationForm.jsx';
import ProgressTracker from '../components/DonorComponents/ProgressTracker.jsx';
import ESGCertificateCard from '../components/DonorComponents/ESGCertificateCard.jsx';

const DonorPortal = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDonationCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner Tagline & Header matching Photo 2 */}
      <div className="grid lg:grid-cols-12 gap-8 items-center mb-8">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-sage-600 tracking-wider mb-2">
            <span>Good Food</span>
            <span className="text-sage-300">•</span>
            <span>Less Waste</span>
            <span className="text-sage-300">•</span>
            <span>Stronger Communities</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-forest tracking-tight">
            Donate <span className="text-sunburst-500">Surplus Food</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-forest/75 max-w-2xl leading-relaxed">
            Your extra food can bring smiles, reduce waste and create a healthier community. Fill in the details below and make an impact in just <strong>30 seconds</strong>!
          </p>
        </div>

        {/* Right Top Card Decoration */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="relative p-4 rounded-3xl bg-amber-50/80 border border-sunburst-200 shadow-sm text-center max-w-xs w-full">
            <div className="text-xs font-bold text-forest/80 italic mb-1">
              Food Rescue Starts Here ➔
            </div>
            <div className="font-display font-extrabold text-lg text-forest flex items-center justify-center gap-1.5">
              MealBridge 🌉
            </div>
            <div className="text-xs text-sage-700 font-semibold mt-0.5">
              Good Food • Great Impact
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Active Tracker on Right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <DonationForm onDonationCreated={handleDonationCreated} />
        </div>
        <div className="lg:col-span-5">
          <ProgressTracker refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Bottom Full-Width Section: Download ESG & Tax Deduction Certificate */}
      <ESGCertificateCard />
    </div>
  );
};

export default DonorPortal;
