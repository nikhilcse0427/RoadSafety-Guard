import express from 'express';
import auth from '../middleware/auth.js';
import analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', auth, analyticsController.getDashboard);
router.get('/trends', auth, analyticsController.getTrends);
router.get('/heatmap', auth, analyticsController.getHeatmap);

export default router;  
