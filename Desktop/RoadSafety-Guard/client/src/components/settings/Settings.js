import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'account', 'preferences', 'security'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        phone: user.profile.phone || '',
        department: user.profile.department || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Public Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'account', label: 'Account Details', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'preferences', label: 'Preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-fade-in relative z-10">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Settings</h1>
        <p className="text-sm text-dark-400">Manage your profile, preferences, and security settings.</p>
      </div>

      {/* Main Settings Container - Clerk Style */}
      <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 relative overflow-hidden flex flex-col md:flex-row min-h-[450px]">

        {/* Sidebar */}
        <div className="w-full md:w-64 bg-dark-900/50 border-r border-dark-700 flex-shrink-0 p-5">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border border-primary-400/30">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">{user?.username}</h3>
              <p className="text-xs text-dark-400 capitalize bg-dark-800 inline-block px-2 py-0.5 rounded-md mt-1 border border-dark-700">{user?.role || 'User'}</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-dark-800 text-white shadow-sm border border-dark-600'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/50 border border-transparent'
                  }`}
              >
                <svg className={`w-5 h-5 mr-3 transition-colors ${activeTab === tab.id ? 'text-primary-500' : 'text-dark-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon === 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'} />
                  {tab.icon === 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                  {tab.icon !== 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />}
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 bg-dark-800">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-white mb-4">Profile Information</h2>
              <div className="border border-dark-700 rounded-2xl bg-dark-900 shadow-inner p-5 mb-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-dark-300 ml-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input-field py-2.5"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-dark-300 ml-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input-field py-2.5"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-dark-300 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field py-2.5"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-dark-300 ml-1">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="input-field py-2.5"
                        placeholder="Enter your department"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                      {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-white mb-4">Account Details</h2>
              <div className="border border-dark-700 rounded-2xl overflow-hidden bg-dark-900 shadow-inner">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-dark-700">
                  <div className="mb-2 md:mb-0">
                    <h3 className="text-sm font-medium text-white mb-1">Username</h3>
                    <p className="text-sm text-dark-400 font-mono bg-dark-800 px-3 py-1.5 rounded-lg border border-dark-600 inline-block">{user?.username}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary-400 px-3 py-1 bg-primary-500/10 rounded-full border border-primary-500/20 self-start md:self-auto">Primary</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-dark-700">
                  <div className="mb-2 md:mb-0">
                    <h3 className="text-sm font-medium text-white mb-1">Email Address</h3>
                    <p className="text-sm text-dark-400 font-mono bg-dark-800 px-3 py-1.5 rounded-lg border border-dark-600 inline-block">{user?.email}</p>
                  </div>
                  <span className="text-xs font-semibold text-green-400 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 self-start md:self-auto">Verified</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-dark-700 bg-dark-800/50">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">Account Role</h3>
                    <p className="text-sm text-dark-400 capitalize">{user?.role}</p>
                  </div>
                  <span className="text-xs text-dark-500 mt-1 md:mt-0">Managed by administrators</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-dark-800/50">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">Member Since</h3>
                    <p className="text-sm text-dark-400">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-white mb-4">System Preferences</h2>
              <div className="border border-dark-700 rounded-2xl overflow-hidden bg-dark-900 shadow-inner">
                <div className="flex items-center justify-between p-5 border-b border-dark-700">
                  <div className="pr-4">
                    <h3 className="text-sm font-medium text-white mb-1">Email Notifications</h3>
                    <p className="text-xs text-dark-400">Receive critical alerts and weekly digests directly to your inbox so you never miss an incident.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-dark-300 after:border-dark-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 peer-checked:after:bg-white peer-checked:after:shadow-sm shadow-inner"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-5 border-b border-dark-700">
                  <div className="pr-4">
                    <h3 className="text-sm font-medium text-white mb-1">SMS Alerts</h3>
                    <p className="text-xs text-dark-400">Enable instant SMS notifications for high-severity or high-priority unverified incidents in your designated area.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-dark-300 after:border-dark-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 peer-checked:after:bg-white peer-checked:after:shadow-sm shadow-inner"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-5">
                  <div className="pr-4">
                    <h3 className="text-sm font-medium text-white mb-1">Dark Mode Interface</h3>
                    <p className="text-xs text-dark-400">Apply a system-wide dark styling that emits less glare and enhances visual telemetry mapping.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                    <div className="w-11 h-6 bg-primary-500 opacity-60 rounded-full cursor-not-allowed"></div>
                    <div className="absolute top-[2px] left-[22px] bg-white border border-gray-300 rounded-full h-5 w-5"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-white mb-4">Security & Danger Zone</h2>

              <div className="border border-dark-700 rounded-2xl p-5 bg-dark-900 shadow-inner mb-5">
                <h3 className="text-sm font-semibold text-white mb-3">Change Password</h3>
                <form className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-dark-300 ml-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="input-field py-2.5 bg-dark-800" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-dark-300 ml-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="input-field py-2.5 bg-dark-800" />
                  </div>
                  <button type="button" className="bg-dark-700 hover:bg-dark-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 border border-dark-600 text-sm mt-2">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="border border-red-900/40 rounded-2xl p-6 bg-red-950/20 max-w-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <h3 className="text-base font-semibold text-red-400 mb-2 whitespace-nowrap">Delete Account</h3>
                <p className="text-sm text-red-200/70 mb-5 leading-relaxed">
                  Permanently remove your account and all of its contents from the Road Safety Guard platform. This action is not reversible, so please continue with caution.
                </p>
                <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-2.5 px-6 rounded-xl transition-colors duration-200 border border-red-500/30 text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
