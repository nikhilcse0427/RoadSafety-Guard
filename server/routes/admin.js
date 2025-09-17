import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', auth, adminController.requireAdmin, adminController.getDashboard);

// @route   GET /api/admin/accidents/pending
// @desc    Get accidents pending verification
// @access  Private (Admin only)
router.get('/accidents/pending', auth, adminController.requireAdmin, adminController.getPendingAccidents);

// @route   PUT /api/admin/accidents/:id/verify
// @desc    Verify an accident report
// @access  Private (Admin only)
router.put('/accidents/:id/verify', auth, adminController.requireAdmin, adminController.verifyAccident);

// @route   PUT /api/admin/accidents/:id/reject
// @desc    Reject an accident report
// @access  Private (Admin only)
router.put('/accidents/:id/reject', auth, adminController.requireAdmin, [body('reason').notEmpty().withMessage('Rejection reason is required')], adminController.rejectAccident);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, adminController.requireAdmin, adminController.getUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', auth, adminController.requireAdmin, [body('role').isIn(['user', 'admin', 'officer']).withMessage('Invalid role')], adminController.updateUserRole);

export default router;
