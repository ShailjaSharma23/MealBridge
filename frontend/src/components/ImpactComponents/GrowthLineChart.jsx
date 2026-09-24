import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const GrowthLineChart = ({ data }) => {
  const fallbackData = [
    { month: 'Jan', foodRescuedKg: 5200 },
    { month: 'Feb', foodRescuedKg: 7800 },
    { month: 'Mar', foodRescuedKg: 9400 },
    { month: 'Apr', foodRescuedKg: 11200 },
    { month: 'May', foodRescuedKg: 13600 },
    { month: 'Jun', foodRescuedKg: 16800 },
  ];

  const chartData = data && data.length > 0 ? data : fallbackData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-forest text-white p-3 rounded-2xl shadow-xl text-xs border border-white/10">
          <div className="font-bold text-sunburst-400">{label} 2026</div>
          <div className="text-sm font-black mt-0.5">
            {payload[0].value.toLocaleString()} kg Rescued
          </div>
          <div className="text-[10px] text-white/70">~{(payload[0].value * 2.6).toLocaleString()} Meals Delivered</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-warm-border shadow-card flex flex-col justify-between h-[380px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider">
            Trajectory
          </div>
          <h3 className="font-display font-black text-xl text-forest">
            Monthly Food Rescued Growth
          </h3>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+223% Since Jan</span>
        </div>
      </div>

      <div className="flex-1 w-full -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sageAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8BA888" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8BA888" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F0" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="foodRescuedKg"
              stroke="#8BA888"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#sageAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthLineChart;
