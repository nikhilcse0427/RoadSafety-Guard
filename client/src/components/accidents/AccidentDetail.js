import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AccidentDetail = () => {
  const { id } = useParams();
  const [accident, setAccident] = useState(null);
  const [loading, setLoading] = useState(true);
  const ENV_API_URL = process.env.REACT_APP_API_URL;
  const API_BASE_URL = (
    ENV_API_URL ||
    (typeof window !== 'undefined' && window.__API_URL__) ||
    (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api')
  );

  useEffect(() => {
    fetchAccidentDetail();
  }, [id]);

  const fetchAccidentDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accidents/${id}`);
      setAccident(response.data);
    } catch (error) {
      console.error('Error fetching accident detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      case 'Critical':
        return 'bg-red-700';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper for badge style
  const badgeClass = (color) => `inline-flex items-center justify-center min-w-[72px] h-6 px-2 rounded-full text-xs font-semibold ${color} bg-opacity-90`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!accident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Accident Not Found</h2>
        <Link to="/accidents" className="btn-primary">
          Back to Accidents
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/accidents" className="text-primary-400 hover:text-primary-300">
            ← Back to Accidents
          </Link>
          <h1 className="text-2xl font-bold text-white">{accident.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {accident.isVerified ? (
            <span className={badgeClass('bg-green-500 text-white')}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </span>
          ) : (
            <span className={badgeClass('bg-yellow-500 text-white')}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Verification
            </span>
          )}
          <span className={badgeClass(getSeverityColor(accident.severity))}>
            {accident.severity}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-4">Accident Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-dark-400">Description</label>
                <p className="text-white mt-1">{accident.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-dark-400">Location</label>
                  <p className="text-white mt-1">{accident.location}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-dark-400">Date & Time</label>
                  <p className="text-white mt-1">
                    {new Date(accident.dateTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-dark-400">Category</label>
                  <p className="text-white mt-1">{accident.category}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-dark-400">Status</label>
                  <p className="text-white mt-1">{accident.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Casualties */}
          {(accident.casualties.fatalities > 0 || accident.casualties.injuries > 0) && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">Casualties</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-2xl font-bold text-white">{accident.casualties.fatalities}</p>
                      <p className="text-sm text-red-200">Fatalities</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div>
                      <p className="text-2xl font-bold text-white">{accident.casualties.injuries}</p>
                      <p className="text-sm text-yellow-200">Injuries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles Involved */}
          {accident.vehicles && accident.vehicles.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">Vehicles Involved</h2>
              <div className="space-y-3">
                {accident.vehicles.map((vehicle, index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{vehicle.type}</p>
                        <p className="text-sm text-dark-400">Damage: {vehicle.damage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weather Conditions */}
          {accident.weather && (accident.weather.condition || accident.weather.visibility) && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">Weather Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accident.weather.condition && (
                  <div>
                    <label className="text-sm font-medium text-dark-400">Condition</label>
                    <p className="text-white mt-1">{accident.weather.condition}</p>
                  </div>
                )}
                {accident.weather.visibility && (
                  <div>
                    <label className="text-sm font-medium text-dark-400">Visibility</label>
                    <p className="text-white mt-1">{accident.weather.visibility} meters</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Reporter Information */}
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-4">Reporter Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-dark-400">Reported by</label>
                <p className="text-white mt-1">{accident.reportedBy?.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-dark-400">Reported on</label>
                <p className="text-white mt-1">
                  {new Date(accident.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Information */}
          {accident.isVerified && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">Verification Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-dark-400">Verified by</label>
                  <p className="text-white mt-1">{accident.verifiedBy?.username || 'Admin'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-400">Verified on</label>
                  <p className="text-white mt-1">
                    {new Date(accident.verifiedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Services */}
          {accident.emergencyServices && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">Emergency Services</h2>
              <div className="space-y-2">
                {accident.emergencyServices.police && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-white">Police Called</span>
                  </div>
                )}
                {accident.emergencyServices.ambulance && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-white">Ambulance Called</span>
                  </div>
                )}
                {accident.emergencyServices.fire && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-white">Fire Department Called</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Images */}
          {accident.images && accident.images.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">Images</h2>
              <div className="grid grid-cols-2 gap-2">
                {accident.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Accident image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccidentDetail;
