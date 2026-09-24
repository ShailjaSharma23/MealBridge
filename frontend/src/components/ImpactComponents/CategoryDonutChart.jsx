import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const CategoryDonutChart = ({ categoryBreakdown }) => {
  const chartData = [
    {
      name: 'Cooked Meals',
      value: categoryBreakdown?.cookedFood?.percentage || 42,
      kg: categoryBreakdown?.cookedFood?.kg || 5242,
      color: '#8BA888', // Sage green
    },
    {
      name: 'Bakery & Bread',
      value: categoryBreakdown?.bakery?.percentage || 28,
      kg: categoryBreakdown?.bakery?.kg || 3494,
      color: '#F59E0B', // Sunburst amber
    },
    {
      name: 'Fresh Produce',
      value: categoryBreakdown?.produce?.percentage || 18,
      kg: categoryBreakdown?.produce?.kg || 2246,
      color: '#10B981', // Emerald
    },
    {
      name: 'Dairy & Other',
      value: categoryBreakdown?.other?.percentage || 12,
      kg: categoryBreakdown?.other?.kg || 1498,
      color: '#1E352F', // Forest deep
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-forest text-white p-2.5 rounded-xl shadow-lg text-xs border border-white/10">
          <div className="font-bold">{data.name}</div>
          <div className="text-sunburst-400 font-extrabold mt-0.5">
            {data.value}% ({data.kg.toLocaleString()} kg)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-warm-border shadow-card flex flex-col justify-between h-[380px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs font-semibold text-sage-600 tracking-wider">
            Surplus Share
          </div>
          <h3 className="font-display font-black text-xl text-forest">
            Categories Rescued
          </h3>
        </div>

        <div className="w-8 h-8 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center">
          <PieIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex-1 relative flex items-center justify-center -my-2">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-black text-2xl text-forest leading-none">
            100%
          </span>
          <span className="text-[10px] font-bold text-forest/50 uppercase tracking-wider mt-0.5">
            Surplus
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-warm-border/60">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-forest/70 truncate">{item.name}</span>
            <span className="font-bold text-forest ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDonutChart;
