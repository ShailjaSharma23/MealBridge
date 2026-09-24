import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-warm-border bg-gradient-to-b from-transparent to-sage-50/80 relative overflow-hidden">
      {/* Decorative Landscape SVG Background */}
      <div className="w-full text-sage-200/60 pointer-events-none -mb-1">
        <svg viewBox="0 0 1440 120" fill="currentColor" className="w-full h-auto">
          <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo & Tagline */}
          <div>
            <div className="font-display font-extrabold text-xl text-forest flex items-center justify-center md:justify-start gap-1.5">
              MealBridge 🌉
            </div>
            <p className="text-xs text-forest/70 mt-1 max-w-sm">
              Connecting surplus restaurant and grocery meals to local shelters in real time before edible food is wasted.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-forest/70">
            <Link to="/" className="hover:text-forest transition-colors">Home</Link>
            <Link to="/donate" className="hover:text-forest transition-colors">Donate Food</Link>
            <Link to="/receive" className="hover:text-forest transition-colors">Shelter Portal</Link>
            <Link to="/volunteer" className="hover:text-forest transition-colors">Volunteer Board</Link>
            <Link to="/ai-learn" className="hover:text-forest transition-colors">AI Learning Hub</Link>
            <Link to="/impact" className="hover:text-forest transition-colors">City Impact</Link>
          </div>

          {/* Team & Hackathon Badges */}
          <div className="flex flex-col items-center md:items-end gap-1.5">
            <div className="text-xs font-medium text-forest/60 flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for AmiHacks 1.0
            </div>
            <div className="text-[11px] text-forest/50">
              By Yash Bhatt, Shailja Sharma & Team
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-sage-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-forest/40">
          <span>&copy; {new Date().getFullYear()} MealBridge. All rights reserved.</span>
          <span className="italic mt-2 sm:mt-0 font-display text-sage-600">Less Waste &rarr; More Hope</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
