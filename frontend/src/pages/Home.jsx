import React from 'react';
import HeroSection from '../components/HomeComponents/HeroSection.jsx';
import RoleCards from '../components/HomeComponents/RoleCards.jsx';
import ImpactSection from '../components/HomeComponents/ImpactSection.jsx';

const Home = () => {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. "Everyone Has a Role to Play" 4 Role Cards */}
      <RoleCards />

      {/* 3. Real Food. Real Impact. Metrics Bar */}
      <ImpactSection />
    </div>
  );
};

export default Home;
