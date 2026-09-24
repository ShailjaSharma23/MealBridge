import mongoose from 'mongoose';

const impactLogSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      default: 'June 2026',
    },
    totalFoodRescuedKg: {
      type: Number,
      required: true,
      default: 12480,
    },
    totalPeopleFed: {
      type: Number,
      required: true,
      default: 3240,
    },
    totalSheltersSupported: {
      type: Number,
      required: true,
      default: 48,
    },
    totalCo2SavedTons: {
      type: Number,
      required: true,
      default: 18.6,
    },
    // Percentage growth vs last month (as displayed in Impact Dashboard UI)
    monthlyGrowthPercentage: {
      foodRescued: { type: Number, default: 24 },
      peopleFed: { type: Number, default: 18 },
      sheltersSupported: { type: Number, default: 12 },
      co2Saved: { type: Number, default: 27 },
    },
    // Breakdown by category (matching UI Donut Chart)
    categoryBreakdown: {
      cookedFood: { kg: { type: Number, default: 5242 }, percentage: { type: Number, default: 42 } },
      bakery: { kg: { type: Number, default: 3494 }, percentage: { type: Number, default: 28 } },
      produce: { kg: { type: Number, default: 2246 }, percentage: { type: Number, default: 18 } },
      other: { kg: { type: Number, default: 1498 }, percentage: { type: Number, default: 12 } },
    },
    // 6-month growth trend (matching UI Line Chart)
    growthTrend: [
      {
        month: { type: String, required: true },
        foodRescuedKg: { type: Number, required: true },
      },
    ],
    // City-wide hotspot stats (matching UI Heatmap section)
    cityHeatmapStats: {
      activeLocations: { type: Number, default: 48 },
      ongoingPickups: { type: Number, default: 23 },
      nextPickupMinutes: { type: Number, default: 12 },
      topActiveAreas: [
        { name: { type: String, default: 'Central City' }, level: { type: String, default: 'High' } },
        { name: { type: String, default: 'Green Park' }, level: { type: String, default: 'High' } },
        { name: { type: String, default: 'Riverside' }, level: { type: String, default: 'Medium' } },
        { name: { type: String, default: 'New Delhi' }, level: { type: String, default: 'Medium' } },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const ImpactLog = mongoose.model('ImpactLog', impactLogSchema);

export default ImpactLog;
