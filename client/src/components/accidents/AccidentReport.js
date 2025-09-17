import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AccidentReport = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    dateTime: new Date().toISOString().slice(0, 16),
    severity: '',
    description: '',
    category: '',
    casualties: {
      fatalities: 0,
      injuries: 0,
    },
    vehicles: [{
      type: '',
      damage: '',
    }],
    weather: {
      condition: '',
      visibility: '',
    },
    emergencyServices: {
      police: false,
      ambulance: false,
      fire: false,
    },
    coordinates: {
      latitude: '',
      longitude: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('coordinates.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [key]: value,
        },
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleVehicleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map((vehicle, i) =>
        i === index ? { ...vehicle, [field]: value } : vehicle
      ),
    }));
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, { type: '', damage: '' }],
    }));
  };

  const removeVehicle = (index) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate coordinates
    const lat = parseFloat(formData.coordinates.latitude);
    const lng = parseFloat(formData.coordinates.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid latitude and longitude');
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${API_URL}/api/accidents`, {
        ...formData,
        coordinates: { latitude: lat, longitude: lng },
      });
      toast.success('Accident report submitted successfully!');
      navigate('/accidents');
    } catch (error) {
      console.error('Error submitting accident report:', error);
      toast.error('Failed to submit accident report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-8-8V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">New Accident Report</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Brief description of the accident"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Street address or landmark"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Severity *
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select severity</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Detailed description of what happened"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select category</option>
              <option value="Overspeeding">Overspeeding</option>
              <option value="Weather conditions">Weather conditions</option>
              <option value="Drunk driving">Drunk driving</option>
              <option value="Distracted driving">Distracted driving</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Casualties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Fatalities
              </label>
              <input
                type="number"
                name="casualties.fatalities"
                value={formData.casualties.fatalities}
                onChange={handleChange}
                min="0"
                className="input-field"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Injuries
              </label>
              <input
                type="number"
                name="casualties.injuries"
                value={formData.casualties.injuries}
                onChange={handleChange}
                min="0"
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>

          {/* Vehicles Involved */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-white">
                Vehicles Involved
              </label>
              <button
                type="button"
                onClick={addVehicle}
                className="text-primary-400 hover:text-primary-300 text-sm font-medium"
              >
                + Add Vehicle
              </button>
            </div>

            {formData.vehicles.map((vehicle, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-dark-700 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicle.type}
                    onChange={(e) => handleVehicleChange(index, 'type', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select type</option>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Bus">Bus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Damage Level
                  </label>
                  <select
                    value={vehicle.damage}
                    onChange={(e) => handleVehicleChange(index, 'damage', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select damage</option>
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Total">Total</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeVehicle(index)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Weather Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Weather Condition
              </label>
              <select
                name="weather.condition"
                value={formData.weather.condition}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select condition</option>
                <option value="Clear">Clear</option>
                <option value="Rainy">Rainy</option>
                <option value="Foggy">Foggy</option>
                <option value="Snowy">Snowy</option>
                <option value="Stormy">Stormy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Visibility (meters)
              </label>
              <input
                type="number"
                name="weather.visibility"
                value={formData.weather.visibility}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 100"
              />
            </div>
          </div>

          {/* Emergency Services */}
          <div>
            <label className="block text-sm font-medium text-white mb-4">
              Emergency Services Called
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="emergencyServices.police"
                  checked={formData.emergencyServices.police}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-white">Police</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="emergencyServices.ambulance"
                  checked={formData.emergencyServices.ambulance}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-white">Ambulance</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="emergencyServices.fire"
                  checked={formData.emergencyServices.fire}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-white">Fire Department</span>
              </label>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Latitude *
              </label>
              <input
                type="number"
                name="coordinates.latitude"
                value={formData.coordinates.latitude}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 28.6139"
                step="any"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Longitude *
              </label>
              <input
                type="number"
                name="coordinates.longitude"
                value={formData.coordinates.longitude}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 77.2090"
                step="any"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccidentReport;
