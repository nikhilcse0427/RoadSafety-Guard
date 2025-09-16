import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingAccidents, setPendingAccidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [dashboardResponse, pendingResponse] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/accidents/pending')
      ]);
      
      setDashboardData(dashboardResponse.data);
      setPendingAccidents(pendingResponse.data.accidents);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (accidentId) => {
    try {
      await axios.put(`/api/admin/accidents/${accidentId}/verify`);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error verifying accident:', error);
    }
  };

  const handleReject = async (accidentId, reason) => {
    try {
      await axios.put(`/api/admin/accidents/${accidentId}/reject`, { reason });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting accident:', error);
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
      <div className="bg-dark-800 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-dark-400">Manage accident reports and user verification</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.totalAccidents || 0}</p>
              <p className="text-sm text-dark-400">Total Accidents</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.pendingVerification || 0}</p>
              <p className="text-sm text-dark-400">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.verifiedAccidents || 0}</p>
              <p className="text-sm text-dark-400">Verified Accidents</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.totalUsers || 0}</p>
              <p className="text-sm text-dark-400">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Accidents */}
      {dashboardData?.emergencyAccidents?.length > 0 && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h2 className="text-lg font-bold text-red-400 mb-3">🚨 Emergency Accidents</h2>
          <div className="space-y-2">
            {dashboardData.emergencyAccidents.map((accident) => (
              <div key={accident._id} className="flex items-center justify-between bg-red-800 rounded p-3">
                <div>
                  <p className="font-medium text-white">{accident.title}</p>
                  <p className="text-sm text-red-200">{accident.location}</p>
                </div>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">CRITICAL</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Verification */}
      <div className="bg-dark-800 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-4">Pending Verification</h2>
        <div className="space-y-3">
          {pendingAccidents.length === 0 ? (
            <p className="text-dark-400 text-center py-4">No accidents pending verification</p>
          ) : (
            pendingAccidents.map((accident) => (
              <div key={accident._id} className="bg-dark-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-white">{accident.title}</h3>
                      <span className={badgeClass(
                        accident.severity === 'High' ? 'bg-red-500 text-white' :
                        accident.severity === 'Moderate' ? 'bg-yellow-500 text-white' :
                        accident.severity === 'Critical' ? 'bg-red-700 text-white' :
                        'bg-green-500 text-white')}
                      >
                        {accident.severity}
                      </span>
                    </div>
                    <p className="text-sm text-dark-300 mb-2">{accident.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-dark-400">
                      <span>📍 {accident.location}</span>
                      <span>👤 {accident.reportedBy?.username}</span>
                      <span>🕒 {new Date(accident.dateTime).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleVerify(accident._id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Rejection reason:');
                        if (reason) handleReject(accident._id, reason);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
