import ImpactLog from '../models/ImpactLog.js';
import Donation from '../models/Donation.js';

/**
 * @desc   Get comprehensive city impact metrics matching Impact Dashboard UI
 * @route  GET /api/impact
 * @access Public
 */
export const getImpactMetrics = async (req, res, next) => {
  try {
    let impact = await ImpactLog.findOne();

    if (!impact) {
      // Default fallback matching exact UI mockups
      impact = {
        month: 'June 2026',
        totalFoodRescuedKg: 12480,
        totalPeopleFed: 3240,
        totalSheltersSupported: 48,
        totalCo2SavedTons: 18.6,
        monthlyGrowthPercentage: {
          foodRescued: 24,
          peopleFed: 18,
          sheltersSupported: 12,
          co2Saved: 27,
        },
        categoryBreakdown: {
          cookedFood: { kg: 5242, percentage: 42 },
          bakery: { kg: 3494, percentage: 28 },
          produce: { kg: 2246, percentage: 18 },
          other: { kg: 1498, percentage: 12 },
        },
        growthTrend: [
          { month: 'Jan', foodRescuedKg: 5200 },
          { month: 'Feb', foodRescuedKg: 7800 },
          { month: 'Mar', foodRescuedKg: 9400 },
          { month: 'Apr', foodRescuedKg: 11200 },
          { month: 'May', foodRescuedKg: 13600 },
          { month: 'Jun', foodRescuedKg: 16800 },
        ],
        cityHeatmapStats: {
          activeLocations: 48,
          ongoingPickups: 23,
          nextPickupMinutes: 12,
          topActiveAreas: [
            { name: 'Central City', level: 'High' },
            { name: 'Green Park', level: 'High' },
            { name: 'Riverside', level: 'Medium' },
            { name: 'New Delhi', level: 'Medium' },
          ],
        },
      };
    }

    // Heatmap Geo coordinates across Delhi NCR for the interactive map
    const heatmapPoints = [
      { id: 1, name: 'Bistro 42', area: 'Green Park', lat: 28.5582, lng: 77.2023, activity: 'High', type: 'donor' },
      { id: 2, name: 'Hope Shelter', area: 'Lajpat Nagar', lat: 28.5677, lng: 77.2433, activity: 'High', type: 'shelter' },
      { id: 3, name: 'Green Valley Cafe', area: 'Hauz Khas', lat: 28.5494, lng: 77.2001, activity: 'Medium', type: 'donor' },
      { id: 4, name: 'City Bites', area: 'Connaught Place', lat: 28.6315, lng: 77.2167, activity: 'High', type: 'donor' },
      { id: 5, name: 'Fresh Bites Bakery', area: 'Karol Bagh', lat: 28.6521, lng: 77.1906, activity: 'Medium', type: 'donor' },
      { id: 6, name: 'Sunshine Food Bank', area: 'Civil Lines', lat: 28.6814, lng: 77.2228, activity: 'Medium', type: 'shelter' },
      { id: 7, name: 'Care Haven Shelter', area: 'Dwarka', lat: 28.5921, lng: 77.046, activity: 'High', type: 'shelter' },
      { id: 8, name: 'Taste Hub Kitchen', area: 'Rohini', lat: 28.7041, lng: 77.1025, activity: 'High', type: 'donor' },
    ];

    res.json({
      success: true,
      impact,
      heatmapPoints,
    });
  } catch (error) {
    next(error);
  }
};
