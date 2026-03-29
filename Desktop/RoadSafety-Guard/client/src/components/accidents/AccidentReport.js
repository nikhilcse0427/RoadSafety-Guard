import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AccidentReport = () => {
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
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
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

    try {
      await axios.post('/api/accidents', formData);
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
    <div className="max-w-4xl mx-auto py-8 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Report an Incident</h1>
          <p className="text-sm text-dark-400">Fill out the form below to accurately report a road incident.</p>
        </div>
        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 shadow-sm shadow-red-500/5">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-dark-700/50 bg-dark-800/50">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <svg className="w-4 h-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Basic Details
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-dark-300 ml-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                placeholder="Brief description of the accident"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                  placeholder="Street address or landmark"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Date & Time *</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-dark-300 ml-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner resize-none"
                placeholder="Detailed description of what happened"
                required
              />
            </div>
          </div>
        </div>

        {/* Categorization & Impact */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-dark-700/50 bg-dark-800/50">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <svg className="w-4 h-4 text-orange-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Categorization & Impact
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                required
              >
                <option value="" disabled className="text-dark-400">Select category</option>
                <option value="Overspeeding">Overspeeding</option>
                <option value="Weather conditions">Weather conditions</option>
                <option value="Drunk driving">Drunk driving</option>
                <option value="Distracted driving">Distracted driving</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Severity *</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                required
              >
                <option value="" disabled className="text-dark-400">Select severity</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Fatalities</label>
              <input
                type="number"
                name="casualties.fatalities"
                value={formData.casualties.fatalities}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Injuries</label>
              <input
                type="number"
                name="casualties.injuries"
                value={formData.casualties.injuries}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Environmental Factors */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-dark-700/50">
          <div className="p-6 flex-1 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Weather Condition</label>
              <select
                name="weather.condition"
                value={formData.weather.condition}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
              >
                <option value="" disabled className="text-dark-400">Select condition</option>
                <option value="Clear">Clear</option>
                <option value="Rainy">Rainy</option>
                <option value="Foggy">Foggy</option>
                <option value="Snowy">Snowy</option>
                <option value="Stormy">Stormy</option>
              </select>
            </div>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-dark-300 ml-1">Visibility (meters)</label>
              <input
                type="number"
                name="weather.visibility"
                value={formData.weather.visibility}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-inner"
                placeholder="e.g., 100"
              />
            </div>
          </div>
        </div>

        {/* Vehicles Involved */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-dark-700/50 bg-dark-800/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Vehicles Involved
            </h2>
            <button
              type="button"
              onClick={addVehicle}
              className="px-3 py-1.5 bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 rounded-lg text-xs font-semibold transition-colors flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Vehicle
            </button>
          </div>
          <div className="p-6 space-y-4">
            {formData.vehicles.map((vehicle, index) => (
              <div key={index} className="flex flex-col md:flex-row items-end gap-4 p-4 bg-dark-900 border border-dark-700 rounded-xl relative group">
                <div className="absolute -left-2 -top-2 w-6 h-6 bg-dark-800 border border-dark-600 rounded-full flex items-center justify-center text-[10px] font-bold text-dark-300 z-10">
                  {index + 1}
                </div>
                <div className="w-full md:flex-1 space-y-1">
                  <label className="block text-xs font-medium text-dark-300 ml-1">Type</label>
                  <select
                    value={vehicle.type}
                    onChange={(e) => handleVehicleChange(index, 'type', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  >
                    <option value="" disabled className="text-dark-400">Select type</option>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Bus">Bus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="w-full md:flex-1 space-y-1">
                  <label className="block text-xs font-medium text-dark-300 ml-1">Damage Level</label>
                  <select
                    value={vehicle.damage}
                    onChange={(e) => handleVehicleChange(index, 'damage', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  >
                    <option value="" disabled className="text-dark-400">Select damage</option>
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Total">Total</option>
                  </select>
                </div>
                {formData.vehicles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVehicle(index)}
                    className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-colors md:mb-0.5"
                    title="Remove Vehicle"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-dark-700/50 bg-dark-800/50">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Emergency Services Called
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['police', 'ambulance', 'fire'].map((service) => (
                <label key={service} className="flex items-center p-4 bg-dark-900 border border-dark-700 rounded-xl cursor-pointer hover:border-dark-600 transition-colors group">
                  <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                    <input
                      type="checkbox"
                      name={`emergencyServices.${service}`}
                      checked={formData.emergencyServices[service]}
                      onChange={handleChange}
                      className="peer appearance-none w-5 h-5 border-[1.5px] border-dark-500 rounded bg-dark-900 checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer"
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white capitalize group-hover:text-primary-100 transition-colors">
                    {service === 'fire' ? 'Fire Dept.' : service}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end items-center pt-4 space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-dark-600 text-dark-300 font-semibold text-sm hover:text-white hover:bg-dark-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccidentReport;
