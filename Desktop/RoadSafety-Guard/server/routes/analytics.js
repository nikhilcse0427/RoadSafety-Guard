const express = require('express');
const Accident = require('../models/Accident');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage.dateTime = dateFilter;
    }

    // Get basic accident statistics in parallel
    const [
      totalAccidents,
      severityStats,
      categoryStats,
      monthlyTrend,
      recentAccidents,
      timeOfDayStats,
      weatherStats
    ] = await Promise.all([
      // Total accidents count
      Accident.countDocuments(matchStage),

      // Severity distribution
      Accident.aggregate([
        { $match: matchStage },
        { $group: { _id: '$severity', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Category distribution
      Accident.aggregate([
        { $match: matchStage },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Monthly trend (last 12 months)
      Accident.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$dateTime' },
              month: { $month: '$dateTime' }
            },
            count: { $sum: 1 },
            fatalities: { $sum: '$casualties.fatalities' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),

      // Recent accidents
      Accident.find(matchStage)
        .populate('reportedBy', 'username email profile')
        .sort({ dateTime: -1 })
        .limit(5),

      // NEW: Temporal Risk Analysis (Time of Day Breakdown)
      Accident.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $and: [{ $gte: [{ $hour: '$dateTime' }, 6] }, { $lt: [{ $hour: '$dateTime' }, 12] }] }, then: 'Morning (6A-12P)' },
                  { case: { $and: [{ $gte: [{ $hour: '$dateTime' }, 12] }, { $lt: [{ $hour: '$dateTime' }, 17] }] }, then: 'Afternoon (12P-5P)' },
                  { case: { $and: [{ $gte: [{ $hour: '$dateTime' }, 17] }, { $lt: [{ $hour: '$dateTime' }, 21] }] }, then: 'Evening (5P-9P)' }
                ],
                default: 'Night (9P-6A)'
              }
            },
            count: { $sum: 1 },
            injuries: { $sum: '$casualties.injuries' }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // NEW: Weather Correlation
      Accident.aggregate([
        { $match: matchStage },
        { $group: { _id: '$weather.condition', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Calculate high-risk locations (Improved to return actual distinct hotspots regardless of frequency for smaller DBs, weighted by severity)
    const highRiskLocations = await Accident.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          severityScore: {
            $sum: {
              $cond: [
                { $eq: ['$severity', 'Critical'] }, 4,
                {
                  $cond: [
                    { $eq: ['$severity', 'High'] }, 3,
                    {
                      $cond: [
                        { $eq: ['$severity', 'Moderate'] }, 2,
                        1
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      { $sort: { severityScore: -1, count: -1 } },
      { $limit: 6 } // Top 6 hotspots
    ]);

    // Calculate casualties statistics
    const casualtiesStats = await Accident.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalFatalities: { $sum: '$casualties.fatalities' },
          totalInjuries: { $sum: '$casualties.injuries' },
          avgFatalities: { $avg: '$casualties.fatalities' },
          avgInjuries: { $avg: '$casualties.injuries' }
        }
      }
    ]);

    res.json({
      totalAccidents,
      severityStats,
      categoryStats,
      monthlyTrend,
      recentAccidents,
      timeOfDayStats,
      weatherStats,
      highRiskLocations,
      casualtiesStats: casualtiesStats[0] || {
        totalFatalities: 0,
        totalInjuries: 0,
        avgFatalities: 0,
        avgInjuries: 0
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// @route   GET /api/analytics/trends
// @desc    Get accident trends over time
// @access  Private
router.get('/trends', auth, async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage.dateTime = dateFilter;
    }

    let groupBy;
    switch (period) {
      case 'day':
        groupBy = {
          year: { $year: '$dateTime' },
          month: { $month: '$dateTime' },
          day: { $dayOfMonth: '$dateTime' }
        };
        break;
      case 'week':
        groupBy = {
          year: { $year: '$dateTime' },
          week: { $week: '$dateTime' }
        };
        break;
      case 'month':
      default:
        groupBy = {
          year: { $year: '$dateTime' },
          month: { $month: '$dateTime' }
        };
        break;
    }

    const trends = await Accident.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          fatalities: { $sum: '$casualties.fatalities' },
          injuries: { $sum: '$casualties.injuries' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({ message: 'Server error fetching trends' });
  }
});

// @route   GET /api/analytics/heatmap
// @desc    Get accident heatmap data
// @access  Private
router.get('/heatmap', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = { coordinates: { $exists: true, $ne: null } };
    if (Object.keys(dateFilter).length > 0) {
      matchStage.dateTime = dateFilter;
    }

    const heatmapData = await Accident.find(matchStage, {
      coordinates: 1,
      severity: 1,
      dateTime: 1,
      title: 1
    }).sort({ dateTime: -1 });

    res.json(heatmapData);
  } catch (error) {
    console.error('Heatmap analytics error:', error);
    res.status(500).json({ message: 'Server error fetching heatmap data' });
  }
});

module.exports = router;
