import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecentAccidents = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: '',
    category: '',
    status: '',
  });
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAccidents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_URL}/api/accidents?${params}`);
      setAccidents(response.data.accidents);
    } catch (error) {
      console.error('Error fetching accidents:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAccidents();
  }, [fetchAccidents]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported':
        return 'bg-blue-500';
      case 'Under Investigation':
        return 'bg-yellow-500';
      case 'Resolved':
        return 'bg-green-500';
      case 'Closed':
        return 'bg-gray-500';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Recent Accidents</h1>
        <Link
          to="/report-accident"
          className="btn-primary"
        >
          Report New Accident
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="input-field"
            >
              <option value="">All Severities</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="Overspeeding">Overspeeding</option>
              <option value="Weather conditions">Weather conditions</option>
              <option value="Drunk driving">Drunk driving</option>
              <option value="Distracted driving">Distracted driving</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accidents List */}
      <div className="space-y-4">
        {accidents.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No accidents found</h3>
            <p className="text-dark-400 mb-6">No accident reports match your current filters.</p>
            <Link
              to="/report-accident"
              className="btn-primary"
            >
              Report First Accident
            </Link>
          </div>
        ) : (
          accidents.map((accident) => (
            <div key={accident._id} className="card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-8-8V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">{accident.title}</h3>
                      <span className={badgeClass(getSeverityColor(accident.severity))}>
                        {accident.severity}
                      </span>
                      <span className={badgeClass(getStatusColor(accident.status))}>
                        {accident.status}
                      </span>
                      {accident.isVerified ? (
                        <span className={badgeClass('bg-green-500 text-white')}>✓ Verified</span>
                      ) : (
                        <span className={badgeClass('bg-yellow-500 text-white')}>⏳ Pending</span>
                      )}
                    </div>
                    <p className="text-dark-300 mb-2 break-words">{accident.description}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-dark-400">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {accident.location}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(accident.dateTime).toLocaleDateString()} at {new Date(accident.dateTime).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {accident.category}
                      </div>
                    </div>
                    {(accident.casualties.fatalities > 0 || accident.casualties.injuries > 0) && (
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                        {accident.casualties.fatalities > 0 && (
                          <span className="text-red-400 font-medium">
                            {accident.casualties.fatalities} fatalit{accident.casualties.fatalities !== 1 ? 'ies' : 'y'}
                          </span>
                        )}
                        {accident.casualties.injuries > 0 && (
                          <span className="text-yellow-400 font-medium">
                            {accident.casualties.injuries} injur{accident.casualties.injuries !== 1 ? 'ies' : 'y'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end text-sm text-dark-400 min-w-[120px] md:min-w-[160px]">
                  <p>Reported by</p>
                  <p className="font-medium text-white break-all">
                    {accident.reportedBy?.username || 'Unknown'}
                  </p>
                  <Link
                    to={`/accidents/${accident._id}`}
                    className="inline-block mt-2 text-primary-400 hover:text-primary-300 text-xs font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentAccidents;
