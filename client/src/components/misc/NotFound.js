import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 shadow-lg mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold gradient-text mb-2">Page not found</h1>
        <p className="text-dark-400 mb-6">The page you are looking for doesn’t exist or has been moved.</p>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default NotFound;
