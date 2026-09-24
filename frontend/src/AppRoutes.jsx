import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Home,
  DonorPortal,
  ShelterPortal,
  VolunteerPortal,
  AILearningHub,
  ImpactDashboard,
} from './pages/index.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/donate" element={<DonorPortal />} />
      <Route path="/receive" element={<ShelterPortal />} />
      <Route path="/volunteer" element={<VolunteerPortal />} />
      <Route path="/ai-learn" element={<AILearningHub />} />
      <Route path="/impact" element={<ImpactDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
