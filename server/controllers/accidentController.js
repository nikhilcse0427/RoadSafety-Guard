const { validationResult } = require('express-validator');
const Accident = require('../models/Accident');

exports.createAccident = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const accidentData = { ...req.body, reportedBy: req.userId };
    const accident = new Accident(accidentData);
    await accident.save();
    await accident.populate('reportedBy', 'username email profile');
    res.status(201).json({ message: 'Accident report created successfully', accident });
  } catch (error) {
    console.error('Create accident error:', error);
    res.status(500).json({ message: 'Server error creating accident report' });
  }
};

exports.getAccidents = async (req, res) => {
  try {
    const { page = 1, limit = 10, severity, category, status, startDate, endDate, location } = req.query;
    const query = {};
    if (severity) query.severity = severity;
    if (category) query.category = category;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };
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
    res.json({ accidents, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    console.error('Get accidents error:', error);
    res.status(500).json({ message: 'Server error fetching accidents' });
  }
};

exports.getRecentAccidents = async (req, res) => {
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
};

exports.getAccidentById = async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id).populate('reportedBy', 'username email profile');
    if (!accident) return res.status(404).json({ message: 'Accident report not found' });
    res.json(accident);
  } catch (error) {
    console.error('Get accident error:', error);
    res.status(500).json({ message: 'Server error fetching accident' });
  }
};

exports.updateAccident = async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id);
    if (!accident) return res.status(404).json({ message: 'Accident report not found' });
    if (accident.reportedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }
    const updatedAccident = await Accident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'username email profile');
    res.json({ message: 'Accident report updated successfully', accident: updatedAccident });
  } catch (error) {
    console.error('Update accident error:', error);
    res.status(500).json({ message: 'Server error updating accident' });
  }
};

exports.deleteAccident = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized to delete reports' });
    const accident = await Accident.findById(req.params.id);
    if (!accident) return res.status(404).json({ message: 'Accident report not found' });
    await Accident.findByIdAndDelete(req.params.id);
    res.json({ message: 'Accident report deleted successfully' });
  } catch (error) {
    console.error('Delete accident error:', error);
    res.status(500).json({ message: 'Server error deleting accident' });
  }
};


