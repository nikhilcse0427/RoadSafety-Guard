const express = require('express');
const { body, validationResult } = require('express-validator');
const Accident = require('../models/Accident');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    const [
      totalAccidents,
      pendingVerification,
      verifiedAccidents,
      totalUsers,
      recentAccidents,
      emergencyAccidents
    ] = await Promise.all([
      Accident.countDocuments(),
      Accident.countDocuments({ isVerified: false }),
      Accident.countDocuments({ isVerified: true }),
      User.countDocuments(),
      Accident.find()
        .populate('reportedBy', 'username email')
        .sort({ dateTime: -1 })
        .limit(10),
      Accident.find({ severity: 'Critical' })
        .populate('reportedBy', 'username email')
        .sort({ dateTime: -1 })
        .limit(5)
    ]);

    res.json({
      totalAccidents,
      pendingVerification,
      verifiedAccidents,
      totalUsers,
      recentAccidents,
      emergencyAccidents
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching admin dashboard' });
  }
});

// @route   GET /api/admin/accidents/pending
// @desc    Get accidents pending verification
// @access  Private (Admin only)
router.get('/accidents/pending', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const accidents = await Accident.find({ isVerified: false })
      .populate('reportedBy', 'username email profile')
      .sort({ dateTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Accident.countDocuments({ isVerified: false });

    res.json({
      accidents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get pending accidents error:', error);
    res.status(500).json({ message: 'Server error fetching pending accidents' });
  }
});

// @route   PUT /api/admin/accidents/:id/verify
// @desc    Verify an accident report
// @access  Private (Admin only)
router.put('/accidents/:id/verify', auth, requireAdmin, async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id);
    
    if (!accident) {
      return res.status(404).json({ message: 'Accident report not found' });
    }

    const updatedAccident = await Accident.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: true,
        verifiedBy: req.userId,
        verifiedAt: new Date()
      },
      { new: true }
    ).populate('reportedBy', 'username email profile');

    res.json({
      message: 'Accident report verified successfully',
      accident: updatedAccident
    });
  } catch (error) {
    console.error('Verify accident error:', error);
    res.status(500).json({ message: 'Server error verifying accident' });
  }
});

// @route   PUT /api/admin/accidents/:id/reject
// @desc    Reject an accident report
// @access  Private (Admin only)
router.put('/accidents/:id/reject', auth, requireAdmin, [
  body('reason').notEmpty().withMessage('Rejection reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const accident = await Accident.findById(req.params.id);
    
    if (!accident) {
      return res.status(404).json({ message: 'Accident report not found' });
    }

    const updatedAccident = await Accident.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: false,
        status: 'Closed',
        rejectionReason: req.body.reason,
        verifiedBy: req.userId,
        verifiedAt: new Date()
      },
      { new: true }
    ).populate('reportedBy', 'username email profile');

    res.json({
      message: 'Accident report rejected',
      accident: updatedAccident
    });
  } catch (error) {
    console.error('Reject accident error:', error);
    res.status(500).json({ message: 'Server error rejecting accident' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    
    const query = role ? { role } : {};
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', auth, requireAdmin, [
  body('role').isIn(['user', 'admin', 'officer']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

module.exports = router;
