const Accident = require('../models/Accident');

exports.getDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    const matchStage = {};
    if (Object.keys(dateFilter).length > 0) matchStage.dateTime = dateFilter;

    const [
      totalAccidents,
      severityStats,
      categoryStats,
      monthlyTrend,
      recentAccidents,
    ] = await Promise.all([
      Accident.countDocuments(matchStage),
      Accident.aggregate([{ $match: matchStage }, { $group: { _id: '$severity', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Accident.aggregate([{ $match: matchStage }, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Accident.aggregate([
        { $match: matchStage },
        { $group: { _id: { year: { $year: '$dateTime' }, month: { $month: '$dateTime' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
      Accident.find(matchStage).populate('reportedBy', 'username email profile').sort({ dateTime: -1 }).limit(5),
    ]);

    const highRiskLocations = await Accident.aggregate([
      { $match: { ...matchStage, 'coordinates.latitude': { $type: 'number' }, 'coordinates.longitude': { $type: 'number' } } },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          avgSeverity: {
            $avg: {
              $cond: [
                { $eq: ['$severity', 'High'] }, 3,
                { $cond: [ { $eq: ['$severity', 'Moderate'] }, 2, { $cond: [ { $eq: ['$severity', 'Low'] }, 1, 4 ] } ] }
              ]
            }
          },
          avgLat: { $avg: '$coordinates.latitude' },
          avgLng: { $avg: '$coordinates.longitude' },
        }
      },
      { $match: { count: { $gte: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const casualtiesStats = await Accident.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalFatalities: { $sum: '$casualties.fatalities' }, totalInjuries: { $sum: '$casualties.injuries' }, avgFatalities: { $avg: '$casualties.fatalities' }, avgInjuries: { $avg: '$casualties.injuries' } } }
    ]);

    res.json({
      totalAccidents,
      severityStats,
      categoryStats,
      monthlyTrend,
      recentAccidents,
      highRiskLocations,
      casualtiesStats: casualtiesStats[0] || { totalFatalities: 0, totalInjuries: 0, avgFatalities: 0, avgInjuries: 0 },
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    const matchStage = {};
    if (Object.keys(dateFilter).length > 0) matchStage.dateTime = dateFilter;

    let groupBy;
    switch (period) {
      case 'day':
        groupBy = { year: { $year: '$dateTime' }, month: { $month: '$dateTime' }, day: { $dayOfMonth: '$dateTime' } };
        break;
      case 'week':
        groupBy = { year: { $year: '$dateTime' }, week: { $week: '$dateTime' } };
        break;
      case 'month':
      default:
        groupBy = { year: { $year: '$dateTime' }, month: { $month: '$dateTime' } };
        break;
    }

    const trends = await Accident.aggregate([
      { $match: matchStage },
      { $group: { _id: groupBy, count: { $sum: 1 }, fatalities: { $sum: '$casualties.fatalities' }, injuries: { $sum: '$casualties.injuries' } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } },
    ]);
    res.json(trends);
  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({ message: 'Server error fetching trends' });
  }
};

exports.getHeatmap = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    const matchStage = { coordinates: { $exists: true, $ne: null } };
    if (Object.keys(dateFilter).length > 0) matchStage.dateTime = dateFilter;

    const heatmapData = await Accident.find(matchStage, { coordinates: 1, severity: 1, dateTime: 1, title: 1, location: 1 }).sort({ dateTime: -1 });
    res.json(heatmapData);
  } catch (error) {
    console.error('Heatmap analytics error:', error);
    res.status(500).json({ message: 'Server error fetching heatmap data' });
  }
};


