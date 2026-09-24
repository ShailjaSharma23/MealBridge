import React, { useState, useEffect } from 'react';
import ImpactStatCards from '../components/ImpactComponents/ImpactStatCards.jsx';
import GrowthLineChart from '../components/ImpactComponents/GrowthLineChart.jsx';
import CategoryDonutChart from '../components/ImpactComponents/CategoryDonutChart.jsx';
import CityRescueMap from '../components/ImpactComponents/CityRescueMap.jsx';
import RecentRescuesLedger from '../components/ImpactComponents/RecentRescuesLedger.jsx';
import apiClient from '../services/apiClient';
import { Sparkles, BarChart3, Download } from 'lucide-react';

const ImpactDashboard = () => {
  const [impactData, setImpactData] = useState(null);
  const [heatmapPoints, setHeatmapPoints] = useState([]);

  const fetchImpact = async () => {
    try {
      const res = await apiClient.get('/impact');
      if (res.data.success) {
        setImpactData(res.data.impact);
        setHeatmapPoints(res.data.heatmapPoints || []);
      }
    } catch (err) {
      console.warn('Using fallback impact data:', err.message);
    }
  };

  useEffect(() => {
    fetchImpact();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header Section matching Photo 6 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sunburst-500" />
            <span>Measuring Our Collective Footprint • Track A: Surplus-to-Shelter</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
            Real-Time Impact & <span className="text-sunburst-500">City Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 mt-1 max-w-2xl">
            Live transparency into surplus food rescued, greenhouse emissions avoided, and community shelter meals distributed across Delhi NCR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="btn-amber-outline py-2.5 px-4 text-xs font-bold rounded-2xl flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ESG Report</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Impact Metric Cards */}
      <ImpactStatCards impact={impactData} />

      {/* 3. Side-by-Side: Growth Line Chart + Categories Donut Chart */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <GrowthLineChart data={impactData?.growthTrend} />
        </div>
        <div className="lg:col-span-4">
          <CategoryDonutChart categoryBreakdown={impactData?.categoryBreakdown} />
        </div>
      </div>

      {/* 4. Spatial City Rescue Density Hotspot Map */}
      <CityRescueMap
        heatmapPoints={heatmapPoints}
        stats={impactData?.cityHeatmapStats}
      />

      {/* 5. Recent Rescues Ledger */}
      <RecentRescuesLedger />
    </div>
  );
};

export default ImpactDashboard;
