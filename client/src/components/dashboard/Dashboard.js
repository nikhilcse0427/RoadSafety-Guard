import React, { useState, useEffect, useMemo } from 'react';
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
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [modalAccident, setModalAccident] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchDashboardData = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await axios.get(`${API_URL}/api/analytics/dashboard`, { params });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const severityToHex = (severity) => {
    switch (severity) {
      case 'Critical':
        return '#dc2626';
      case 'High':
        return '#ef4444';
      case 'Moderate':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const getSeverityFromAvg = (avg) => {
    if (avg >= 3.5) return 'Critical';
    if (avg >= 2.5) return 'High';
    if (avg >= 1.5) return 'Moderate';
    return 'Low';
  };

  // Leaflet default icon fix for webpack bundlers
  const defaultIcon = useMemo(() => {
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    return icon;
  }, []);

  // Derive filtered accidents by selected high-risk location
  const allRecent = dashboardData?.recentAccidents || [];
  const filteredAccidents = selectedLocation
    ? allRecent.filter((a) => a.location === selectedLocation)
    : allRecent;

  const accidentsWithCoords = filteredAccidents.filter(
    (a) => a?.coordinates?.latitude && a?.coordinates?.longitude
  );

  // Build hotspot markers using average coordinates of accidents per location
  const hotspotMarkers = useMemo(() => {
    const locations = dashboardData?.highRiskLocations || [];
    return locations
      .map((loc) => {
        const accidents = (dashboardData?.recentAccidents || []).filter(
          (a) => a.location === loc._id && a?.coordinates?.latitude && a?.coordinates?.longitude
        );
        if (accidents.length === 0) return null;
        const avgLat = accidents.reduce((s, a) => s + a.coordinates.latitude, 0) / accidents.length;
        const avgLng = accidents.reduce((s, a) => s + a.coordinates.longitude, 0) / accidents.length;
        return {
          name: loc._id,
          count: loc.count,
          avgSeverity: loc.avgSeverity,
          severityLabel: getSeverityFromAvg(loc.avgSeverity || 0),
          position: [avgLat, avgLng],
        };
      })
      .filter(Boolean);
  }, [dashboardData]);

  // Compute a map center - use selected location hotspot center or first accident
  const mapCenter = useMemo(() => {
    if (selectedLocation) {
      const match = hotspotMarkers.find((h) => h.name === selectedLocation);
      if (match) return match.position;
    }
    if (accidentsWithCoords.length > 0) {
      return [accidentsWithCoords[0].coordinates.latitude, accidentsWithCoords[0].coordinates.longitude];
    }
    return [20.5937, 78.9629];
  }, [selectedLocation, hotspotMarkers, accidentsWithCoords]);

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
      {/* Welcome/filters removed per request for a cleaner dashboard */}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card-small">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500 rounded-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.totalAccidents || 0}</p>
              <p className="text-xs text-dark-400">Total Accidents</p>
            </div>
          </div>
        </div>

        <div className="card-small">
          <div className="flex items-center">
            <div className="p-2 bg-red-500 rounded-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.casualtiesStats?.totalFatalities || 0}</p>
              <p className="text-xs text-dark-400">Fatalities</p>
            </div>
          </div>
        </div>

        <div className="card-small">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.casualtiesStats?.totalInjuries || 0}</p>
              <p className="text-xs text-dark-400">Injuries</p>
            </div>
          </div>
        </div>

        <div className="card-small">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-bold text-white">{dashboardData?.highRiskLocations?.length || 0}</p>
              <p className="text-xs text-dark-400">High-Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Accidents */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Accidents{selectedLocation ? ` — ${selectedLocation}` : ''}</h2>
            <div className="flex items-center gap-3">
              {selectedLocation && (
                <button
                  className="text-sm text-dark-300 hover:text-white"
                  onClick={() => setSelectedLocation('')}
                >
                  Clear filter
                </button>
              )}
              <Link
                to="/accidents"
                className="text-primary-400 hover:text-primary-300 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {filteredAccidents.slice(0, 6).map((accident, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-dark-700 rounded-lg gap-2 sm:gap-0 relative">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center self-start sm:self-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-8-8V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
                      <p className="font-medium text-white text-sm truncate">{accident.title}</p>
                      {accident.isVerified ? (
                        <span className={badgeClass('bg-green-500 text-white')}>✓ Verified</span>
                      ) : (
                        <span className={badgeClass('bg-yellow-500 text-white')}>⏳ Pending</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <span className={badgeClass(getSeverityColor(accident.severity))}>
                    {accident.severity}
                  </span>
                  <button
                    className="text-primary-400 hover:underline text-xs font-semibold bg-transparent border-none p-0 focus:outline-none"
                    onClick={() => setModalAccident(accident)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Locations (useful list with actions) */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">High-Risk Locations</h2>
            {selectedLocation && (
              <button
                className="text-sm text-dark-300 hover:text-white"
                onClick={() => setSelectedLocation('')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2">
            {(dashboardData?.highRiskLocations || []).map((loc, idx) => {
              const severity = getSeverityFromAvg(loc.avgSeverity || 0);
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium text-sm">{loc._id}</p>
                    <p className="text-xs text-dark-400">{loc.count} incidents • Avg Severity: {severity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={badgeClass(getSeverityColor(severity))}>
                      {severity}
                    </span>
                    <button
                      className="text-sm text-primary-400 hover:text-primary-300"
                      onClick={() => setSelectedLocation(loc._id)}
                    >
                      Focus
                    </button>
                  </div>
                </div>
              );
            })}
            {(!dashboardData?.highRiskLocations || dashboardData.highRiskLocations.length === 0) && (
              <p className="text-sm text-dark-400">No hotspots identified yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accidents Trend */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Accidents Trend</h2>
          <div className="h-48 lg:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id.month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  labelStyle={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}
                  itemStyle={{ color: '#f59e0b', fontSize: '13px', fontWeight: '500' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accident Analytics */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Accident Analytics</h2>
          <div className="h-48 lg:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData?.categoryStats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {dashboardData?.categoryStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  labelStyle={{
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {dashboardData?.categoryStats?.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-dark-300">{item._id}</span>
                </div>
                <span className="text-white font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Accident Map */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Live Accident Map{selectedLocation ? ` — ${selectedLocation}` : ''}</h2>
          <Link
            to="/report-accident"
            className="btn-primary text-sm py-2 px-4"
          >
            Report Accident
          </Link>
        </div>
        <div className="h-64 rounded-lg overflow-hidden">
          <MapContainer center={mapCenter} zoom={selectedLocation ? 8 : 5} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {/* Hotspot markers */}
            {hotspotMarkers.map((h, i) => (
              <CircleMarker
                key={`hotspot-${i}`}
                center={h.position}
                radius={12}
                pathOptions={{ color: severityToHex(h.severityLabel), fillColor: severityToHex(h.severityLabel), fillOpacity: 0.25 }}
                eventHandlers={{ click: () => setSelectedLocation(h.name) }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-xs opacity-80">{h.count} incidents • {h.severityLabel}</div>
                    <button className="text-primary-400" onClick={() => setSelectedLocation(h.name)}>Focus here</button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
            {/* Individual accident markers (filtered) */}
            {accidentsWithCoords.map((accident, idx) => (
              <Marker
                key={idx}
                position={[accident.coordinates.latitude, accident.coordinates.longitude]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{accident.title}</div>
                    <div className="text-xs opacity-80">{accident.location}</div>
                    <div className="text-xs opacity-80">{accident.severity}</div>
                    <Link to={`/accidents/${accident._id}`} className="text-primary-400">View</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* View Modal */}
      {modalAccident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalAccident(null)}></div>
          <div className="relative w-[92%] max-w-xl bg-dark-800 border border-dark-600 rounded-lg shadow-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-white text-base font-semibold pr-6 truncate">{modalAccident.title}</h3>
              <button className="text-dark-300 hover:text-white" onClick={() => setModalAccident(null)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-dark-400 uppercase tracking-wide text-[10px] mb-1">Address</div>
                <div className="text-white text-sm leading-relaxed break-words">{modalAccident.location}</div>
              </div>
              <div>
                <div className="text-dark-400 uppercase tracking-wide text-[10px] mb-1">Description</div>
                <p className="text-white leading-relaxed text-sm break-words">{modalAccident.description}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button className="text-dark-300 hover:text-white text-xs" onClick={() => setModalAccident(null)}>Close</button>
              <a href={`/accidents/${modalAccident._id}`} className="text-primary-400 hover:text-primary-300 text-xs font-medium">Full details →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
