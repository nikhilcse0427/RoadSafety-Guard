const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const accidentController = require('../controllers/accidentController');

const router = express.Router();

// @route   POST /api/accidents
// @desc    Create a new accident report
// @access  Private
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('severity').isIn(['Low', 'Moderate', 'High', 'Critical']).withMessage('Invalid severity level'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['Overspeeding', 'Weather conditions', 'Drunk driving', 'Distracted driving', 'Other']).withMessage('Invalid category')
], accidentController.createAccident);

// @route   GET /api/accidents
// @desc    Get all accident reports with pagination and filtering
// @access  Private
router.get('/', auth, accidentController.getAccidents);

// @route   GET /api/accidents/recent
// @desc    Get recent accidents for dashboard
// @access  Private
router.get('/recent', auth, accidentController.getRecentAccidents);

// @route   GET /api/accidents/:id
// @desc    Get single accident report
// @access  Private
router.get('/:id', auth, accidentController.getAccidentById);

// @route   PUT /api/accidents/:id
// @desc    Update accident report
// @access  Private
router.put('/:id', auth, accidentController.updateAccident);

// @route   DELETE /api/accidents/:id
// @desc    Delete accident report
// @access  Private (Admin only)
router.delete('/:id', auth, accidentController.deleteAccident);

module.exports = router;
