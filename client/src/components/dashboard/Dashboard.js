import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'High':
      case 'Critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Moderate':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-dark-600 text-dark-300 border-dark-500/30';
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const SEVERITY_COLORS = { 'Morning (6A-12P)': '#fbbf24', 'Afternoon (12P-5P)': '#f97316', 'Evening (5P-9P)': '#8b5cf6', 'Night (9P-6A)': '#3b82f6' };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="text-dark-400 text-sm font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Welcome Section */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Intelligence Dashboard</h1>
            <p className="text-dark-400 text-sm">Real-time analytical metrics mapping road incident patterns and hotspots.</p>
          </div>
          <Link
            to="/report-accident"
            className="whitespace-nowrap bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg flex items-center md:self-start w-max"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Incident
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-colors group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-dark-300">Total Accidents</h3>
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{dashboardData?.totalAccidents || 0}</p>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-colors group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-dark-300">Fatalities</h3>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{dashboardData?.casualtiesStats?.totalFatalities || 0}</p>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-colors group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-dark-300">Injuries</h3>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{dashboardData?.casualtiesStats?.totalInjuries || 0}</p>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-colors group shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-dark-300">Identified Hotspots</h3>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{dashboardData?.highRiskLocations?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Accidents */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-dark-700/50 flex items-center justify-between bg-dark-800/50">
            <h2 className="text-sm font-semibold text-white">Recent Real-Time Logs</h2>
            <Link
              to="/accidents"
              className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all feed
            </Link>
          </div>
          <div className="p-2 flex-1 flex flex-col">
            {dashboardData?.recentAccidents?.length > 0 ? (
              dashboardData.recentAccidents.slice(0, 5).map((accident, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-dark-700/50 rounded-xl transition-colors group cursor-default">
                  <div className="flex items-center space-x-3 max-w-[70%]">
                    <div className="w-10 h-10 bg-dark-900 border border-dark-700 rounded-xl flex items-center justify-center shrink-0 group-hover:border-dark-500 transition-colors">
                      <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2.5 mb-0.5">
                        <p className="font-medium text-white text-sm leading-tight truncate">{accident.title}</p>
                      </div>
                      <p className="text-xs text-dark-400 mt-1 truncate">{accident.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className={`px-2 py-0.5 rounded flex items-center border text-[10px] font-bold uppercase tracking-wider ${getSeverityStyle(accident.severity)}`}>
                      {accident.severity}
                    </span>
                    <p className="text-[11px] text-dark-500 mt-1.5 whitespace-nowrap">
                      {new Date(accident.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-dark-400">
                <p className="text-sm">No recent accidents logged.</p>
              </div>
            )}
          </div>
        </div>

        {/* Real-world High-Risk Locations / Hotspots */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-dark-700/50 bg-dark-800/50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              Critical Frequency Hotspots
            </h2>
            <span className="text-xs text-dark-400">Ranked by volume & severity</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {dashboardData?.highRiskLocations?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.highRiskLocations.map((hotspot, idx) => (
                  <div key={idx} className="bg-dark-700/30 border border-dark-700/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-semibold text-white w-3/4 leading-tight">{hotspot._id}</h4>
                      <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] uppercase font-bold px-2 py-1 rounded">
                        {hotspot.count} {hotspot.count > 1 ? 'Incidents' : 'Incident'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-dark-400 mb-1">
                        <span>Computed Risk Score</span>
                        <span className="font-mono">{hotspot.severityScore.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-dark-900 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full" style={{ width: `${Math.min((hotspot.severityScore / 10) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-dark-400">
                <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-sm">No significant hotspots identified yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Analytic Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temporal Analysis (Time of Day) */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm p-5 pr-6 pb-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Temporal Risk Analysis (Time of Day)</h2>
            <p className="text-[11px] text-dark-400 mt-0.5">Distribution of accidents by operational hours</p>
          </div>
          <div className="h-[220px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData?.timeOfDayStats || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#27272a" vertical={false} />
                <XAxis dataKey="_id" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} dy={5} />
                <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#e4e4e7', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Bar dataKey="count" name="Incidents" radius={[4, 4, 0, 0]}>
                  {(dashboardData?.timeOfDayStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry._id] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Correlation Stats */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm p-5 pr-6 pb-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Weather Impact Correlation</h2>
            <p className="text-[11px] text-dark-400 mt-0.5">Atmospheric conditions present during incidents</p>
          </div>
          <div className="h-[220px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData?.weatherStats || []} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#27272a" horizontal={false} />
                <XAxis type="number" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="_id" type="category" stroke="#52525b" tick={{ fill: '#e4e4e7', fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#e4e4e7', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="count" name="Incidents" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24}>
                  {(dashboardData?.weatherStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pie and Trends Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accidents Monthly Trend */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm p-5 pr-6 pb-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Monthly Incident Trend Overview</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData?.monthlyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#27272a" vertical={false} />
                <XAxis dataKey="_id.month" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#e4e4e7', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#e4e4e7' }}
                  cursor={{ stroke: '#27272a', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line type="monotone" dataKey="count" name="Incidents" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#18181b', stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="fatalities" name="Fatalities" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#18181b', stroke: '#ef4444', strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accident Analytics */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm flex flex-col p-5">
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-white">Incident By Category Breakdown</h2>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-2">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData?.categoryStats || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    stroke="none"
                  >
                    {dashboardData?.categoryStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#e4e4e7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">{dashboardData?.totalAccidents || 0}</span>
                  <span className="block text-[10px] uppercase font-semibold text-dark-400">Total</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              {dashboardData?.categoryStats?.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs w-full">
                  <div className="flex items-center truncate">
                    <div
                      className="w-2.5 h-2.5 rounded-full mr-3 shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-dark-300 font-medium truncate pr-2">{item._id}</span>
                  </div>
                  <span className="text-white font-semibold tabular-nums shrink-0">{item.count}</span>
                </div>
              ))}
              {(!dashboardData?.categoryStats || dashboardData.categoryStats.length === 0) && (
                <p className="text-dark-400 text-sm italic">No category data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
