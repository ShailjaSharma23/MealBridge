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
import RoleGuard from './components/Common/RoleGuard.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/donate"
        element={
          <RoleGuard allowedRole="donor">
            <DonorPortal />
          </RoleGuard>
        }
      />
      <Route
        path="/receive"
        element={
          <RoleGuard allowedRole="shelter">
            <ShelterPortal />
          </RoleGuard>
        }
      />
      <Route
        path="/volunteer"
        element={
          <RoleGuard allowedRole="volunteer">
            <VolunteerPortal />
          </RoleGuard>
        }
      />
      <Route path="/ai-learn" element={<AILearningHub />} />
      <Route path="/impact" element={<ImpactDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
