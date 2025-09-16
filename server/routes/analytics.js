const express = require('express');
const auth = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/dashboard', auth, analyticsController.getDashboard);
router.get('/trends', auth, analyticsController.getTrends);
router.get('/heatmap', auth, analyticsController.getHeatmap);

module.exports = router;
