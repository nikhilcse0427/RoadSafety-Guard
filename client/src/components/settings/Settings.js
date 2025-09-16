import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
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

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    const result = await deleteAccount();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-400">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your department"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-white">Username</p>
              <p className="text-dark-400">{user?.username}</p>
            </div>
            <span className="text-primary-400 text-sm">Cannot be changed</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-white">Email</p>
              <p className="text-dark-400">{user?.email}</p>
            </div>
            <span className="text-primary-400 text-sm">Cannot be changed</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-white">Role</p>
              <p className="text-dark-400 capitalize">{user?.role}</p>
            </div>
            <span className="text-primary-400 text-sm">Assigned by admin</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-white">Member Since</p>
              <p className="text-dark-400">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-dark-400">Receive notifications about new accidents and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-white">SMS Notifications</p>
              <p className="text-dark-400">Receive urgent alerts via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-white">Dark Mode</p>
              <p className="text-dark-400">Use dark theme for better visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500">
        <h2 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
            <h3 className="font-semibold text-red-400 mb-2">Delete Account</h3>
            <p className="text-red-200 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
