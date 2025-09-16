const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  dateTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['Overspeeding', 'Weather conditions', 'Drunk driving', 'Distracted driving', 'Other'],
    required: true
  },
  casualties: {
    fatalities: {
      type: Number,
      default: 0,
      min: 0
    },
    injuries: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  vehicles: [{
    type: {
      type: String,
      enum: ['Car', 'Truck', 'Motorcycle', 'Bicycle', 'Bus', 'Other']
    },
    damage: {
      type: String,
      enum: ['Minor', 'Moderate', 'Severe', 'Total']
    }
  }],
  weather: {
    condition: {
      type: String,
      enum: ['Clear', 'Rainy', 'Foggy', 'Snowy', 'Stormy']
    },
    visibility: Number
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Reported', 'Under Investigation', 'Resolved', 'Closed'],
    default: 'Reported'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  images: [String], // URLs to uploaded images
  witnesses: [{
    name: String,
    contact: String,
    statement: String
  }],
  emergencyServices: {
    police: Boolean,
    ambulance: Boolean,
    fire: Boolean
  }
}, {
  timestamps: true
});

// Index for location-based queries
accidentSchema.index({ coordinates: '2dsphere' });
accidentSchema.index({ dateTime: -1 });
accidentSchema.index({ severity: 1 });

module.exports = mongoose.model('Accident', accidentSchema);
