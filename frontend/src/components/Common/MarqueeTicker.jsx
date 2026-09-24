import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarqueeTicker = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 my-4">
      <div className="flex items-center justify-between bg-sage-200/50 backdrop-blur-sm border border-sage-300/60 rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm text-forest font-medium shadow-sm overflow-hidden">
        {/* Live Indicator Pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage-600"></span>
          </span>
          <span className="font-extrabold tracking-wider text-forest uppercase text-[11px]">LIVE</span>
          <span className="text-forest/30 mx-1">|</span>
        </div>

        {/* Scrolling Ticker Message */}
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap mx-3 flex-1">
          <Bell className="w-3.5 h-3.5 text-forest/70 flex-shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-forest">3 mins ago:</strong> Bistro 42 posted 15kg cooked meals &rarr;{' '}
            <span className="text-sage-800 font-semibold">Matched to Hope Shelter</span>
          </span>
        </div>

        {/* View All Action */}
        <Link
          to="/receive"
          className="flex items-center gap-1 font-semibold text-forest/80 hover:text-forest transition-colors flex-shrink-0 text-xs"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default MarqueeTicker;
