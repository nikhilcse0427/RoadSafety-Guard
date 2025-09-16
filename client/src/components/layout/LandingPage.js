import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Report Accidents Instantly',
    description: 'Help authorities and the community by reporting road accidents in real-time with detailed information and location.',
    icon: (
      <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-8-8V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    ),
  },
  {
    title: 'Analyze & Prevent',
    description: 'View accident trends, high-risk locations, and analytics to help prevent future incidents and make informed decisions.',
    icon: (
      <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Access Safety Resources',
    description: 'Find emergency contacts, safety tips, and accident response guides to stay prepared and safe on the road.',
    icon: (
      <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center drop-shadow-lg">
          Road Safety Guard
        </h1>
        <p className="text-lg md:text-2xl text-dark-300 mb-8 text-center max-w-2xl">
          Making roads safer by empowering citizens and authorities to report, analyze, and prevent road accidents. Join us in building a safer community for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link to="/report-accident" className="btn-primary text-lg px-8 py-3 rounded-md font-semibold shadow-lg">
            Report Accident
          </Link>
          <Link to="/safety-resources" className="btn-secondary text-lg px-8 py-3 rounded-md font-semibold shadow-lg">
            View Safety Tips
          </Link>
          <Link to="/login" className="btn-outline text-lg px-8 py-3 rounded-md font-semibold shadow-lg">
            Login / Signup
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-5xl">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-dark-800 rounded-lg p-6 flex flex-col items-center shadow-md">
              {feature.icon}
              <h3 className="text-xl font-bold text-white mt-4 mb-2 text-center">{feature.title}</h3>
              <p className="text-dark-300 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="py-6 text-center text-dark-400 border-t border-dark-700">
        &copy; {new Date().getFullYear()} Road Safety Guard. Making roads safer for everyone.
      </footer>
    </div>
  );
};

export default LandingPage;
