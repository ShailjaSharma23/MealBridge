import React from 'react';

export { default as Home } from './Home.jsx';

export { default as DonorPortal } from './DonorPortal.jsx';

export { default as ShelterPortal } from './ShelterPortal.jsx';

export const VolunteerPortal = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-extrabold text-forest">Volunteer Portal</h1>
  </div>
);

export const AILearningHub = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-extrabold text-forest">AI Learning Hub</h1>
  </div>
);

export const ImpactDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-extrabold text-forest">Impact Dashboard</h1>
  </div>
);
