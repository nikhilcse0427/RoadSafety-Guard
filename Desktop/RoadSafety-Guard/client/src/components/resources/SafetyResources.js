import React from 'react';
import { useNavigate } from 'react-router-dom';

const SafetyResources = () => {
  const navigate = useNavigate();

  const quickContacts = [
    { name: 'Emergency Services', number: '911', description: 'Police, Fire, Ambulance', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { name: 'Traffic Police', number: '100', description: 'Traffic violations and accidents', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' },
    { name: 'Medical Emergency', number: '102', description: 'Ambulance & medical help', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  ];

  const accidentSteps = [
    { title: 'Stay Calm & Secure the Scene', description: 'Turn on your hazard lights. If possible and safe, move your vehicle to the shoulder to avoid blocking traffic.' },
    { title: 'Check for Injuries', description: 'Assess yourself and others for injuries. Call 911 immediately if anyone is hurt.' },
    { title: 'Exchange Information', description: 'Swap names, numbers, and insurance details with other drivers involved. Do not admit fault.' },
    { title: 'Document & Report', description: 'Take photos of the vehicles, license plates, and the scene. Report the incident through our app.' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header section similar to settings */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Safety Resources</h1>
        <p className="text-sm text-dark-400">Essential contacts and procedures for road emergencies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Emergency Contacts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-dark-700/50 bg-dark-800/50">
              <h2 className="text-sm font-semibold text-white flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                Emergency Contacts
              </h2>
            </div>
            <div className="p-2">
              {quickContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center p-3 hover:bg-dark-700/50 rounded-xl transition-colors group cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-center text-dark-300 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all mr-4 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={contact.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2 mb-0.5">
                      <h3 className="text-sm font-medium text-white">{contact.name}</h3>
                      <span className="text-xs font-mono text-primary-400 font-semibold bg-primary-500/10 px-1.5 py-0.5 rounded">{contact.number}</span>
                    </div>
                    <p className="text-xs text-dark-400">{contact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Card connected to the application's core functionality */}
          <div className="bg-gradient-to-br from-primary-600/20 to-primary-900/20 border border-primary-500/30 rounded-2xl overflow-hidden p-5 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <svg className="w-24 h-24 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white mb-2 relative z-10">Need to report an incident?</h3>
            <p className="text-xs text-primary-200 mb-4 relative z-10 leading-relaxed">
              Use our built-in accident reporting tool to quickly notify authorities and document the scene.
            </p>
            <button
              onClick={() => navigate('/report-accident')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm relative z-10 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Report Accident Now
            </button>
          </div>
        </div>

        {/* Right Column - Post-Accident Steps & Resources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-dark-700/50 bg-dark-800/50">
              <h2 className="text-sm font-semibold text-white flex items-center">
                <svg className="w-4 h-4 text-orange-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What to Do After an Accident
              </h2>
            </div>
            <div className="p-5">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-dark-700 before:to-transparent">
                {accidentSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group md:even:text-right">
                    {/* Number marker */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-900 border-[3px] border-dark-800 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-bold text-dark-300 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-colors">
                      {idx + 1}
                    </div>
                    {/* Content */}
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl bg-dark-900 border border-dark-700/50 group-hover:border-dark-600 transition-colors">
                      <h3 className="text-sm font-semibold text-white mb-1.5">{step.title}</h3>
                      <p className="text-xs text-dark-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Downloads / Links */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-dark-700/50 bg-dark-800/50">
              <h2 className="text-sm font-semibold text-white flex items-center">
                <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Important Documents
              </h2>
            </div>
            <div className="p-2 flex flex-col sm:flex-row gap-2">
              <button className="flex-1 flex items-center p-3 rounded-xl hover:bg-dark-700/50 transition-colors group text-left">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-0.5 group-hover:text-blue-400 transition-colors">Accident Checklist</h4>
                  <p className="text-[11px] text-dark-400">PDF Guide • 1.2 MB</p>
                </div>
              </button>
              <button className="flex-1 flex items-center p-3 rounded-xl hover:bg-dark-700/50 transition-colors group text-left">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center mr-3 group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-0.5 group-hover:text-green-400 transition-colors">Insurance Claim Form</h4>
                  <p className="text-[11px] text-dark-400">PDF Template • 2.4 MB</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyResources;
