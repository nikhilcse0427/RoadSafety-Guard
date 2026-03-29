const express = require('express');
const { body, validationResult } = require('express-validator');
const Accident = require('../models/Accident');
const auth = require('../middleware/auth');

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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const accidentData = {
      ...req.body,
      reportedBy: req.userId
    };

    const accident = new Accident(accidentData);
    await accident.save();

    // Populate the reportedBy field
    await accident.populate('reportedBy', 'username email profile');

    res.status(201).json({
      message: 'Accident report created successfully',
      accident
    });
  } catch (error) {
    console.error('Create accident error:', error);
    res.status(500).json({ message: 'Server error creating accident report' });
  }
});

// @route   GET /api/accidents
// @desc    Get all accident reports with pagination and filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      severity,
      category,
      status,
      startDate,
      endDate,
      location
    } = req.query;

    const query = {};

    // Apply filters
    if (severity) query.severity = severity;
    if (category) query.category = category;
    if (status) query.status = status;
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (startDate || endDate) {
      query.dateTime = {};
      if (startDate) query.dateTime.$gte = new Date(startDate);
      if (endDate) query.dateTime.$lte = new Date(endDate);
    }

    const accidents = await Accident.find(query)
      .populate('reportedBy', 'username email profile')
      .sort({ dateTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Accident.countDocuments(query);

    res.json({
      accidents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get accidents error:', error);
    res.status(500).json({ message: 'Server error fetching accidents' });
  }
});

// @route   GET /api/accidents/recent
// @desc    Get recent accidents for dashboard
// @access  Private
router.get('/recent', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const accidents = await Accident.find()
      .populate('reportedBy', 'username email profile')
      .sort({ dateTime: -1 })
      .limit(limit);

    res.json(accidents);
  } catch (error) {
    console.error('Get recent accidents error:', error);
    res.status(500).json({ message: 'Server error fetching recent accidents' });
  }
});

// @route   GET /api/accidents/:id
// @desc    Get single accident report
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id)
      .populate('reportedBy', 'username email profile');

    if (!accident) {
      return res.status(404).json({ message: 'Accident report not found' });
    }

    res.json(accident);
  } catch (error) {
    console.error('Get accident error:', error);
    res.status(500).json({ message: 'Server error fetching accident' });
  }
});

// @route   PUT /api/accidents/:id
// @desc    Update accident report
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id);

    if (!accident) {
      return res.status(404).json({ message: 'Accident report not found' });
    }

    // Check if user is the reporter or admin
    if (accident.reportedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    const updatedAccident = await Accident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'username email profile');

    res.json({
      message: 'Accident report updated successfully',
      accident: updatedAccident
    });
  } catch (error) {
    console.error('Update accident error:', error);
    res.status(500).json({ message: 'Server error updating accident' });
  }
});

// @route   DELETE /api/accidents/:id
// @desc    Delete accident report
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete reports' });
    }

    const accident = await Accident.findById(req.params.id);

    if (!accident) {
      return res.status(404).json({ message: 'Accident report not found' });
    }

    await Accident.findByIdAndDelete(req.params.id);

    res.json({ message: 'Accident report deleted successfully' });
  } catch (error) {
    console.error('Delete accident error:', error);
    res.status(500).json({ message: 'Server error deleting accident' });
  }
});

module.exports = router;
