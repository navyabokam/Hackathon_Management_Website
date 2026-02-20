import React from 'react';

export default function RegistrationClosed(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      {/* Header */}
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <img src="/klu-logo.jpg" alt="KL University Logo" className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
              <img src="/gfg-logo.jpg" alt="GFG Logo" className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
              <img src="/logo.png" alt="ForgeAscend Logo" className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
            </div>
            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              <a href="/" className="px-5 sm:px-6 py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap flex-1 sm:flex-none text-center">
                Back to Home
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto px-4 py-20 sm:py-24 mt-20">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 sm:p-12 text-center">
          {/* Green Circle Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Online Registration Closed
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-blue-200 mb-8 font-medium">
            Thank you for the overwhelming response!
          </p>

          {/* Main Message */}
          <div className="bg-white/5 rounded-xl p-8 mb-8 border border-white/10">
            <p className="text-base sm:text-lg text-gray-200 mb-6 leading-relaxed">
              Online registrations for the Build-a-thon are now closed.
            </p>

            {/* On-Spot Registration Info */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-green-400 text-2xl">🟢</div>
                <h2 className="text-lg sm:text-xl font-bold text-green-300">Limited On-Spot Registrations Available</h2>
              </div>
              <p className="text-sm sm:text-base text-green-100 mb-6">
                Available at the venue on a first-come, first-served basis.
              </p>
              
              {/* Contact Numbers */}
              <div className="space-y-3 text-left bg-green-600/20 rounded p-4">
                <h3 className="font-bold text-green-200 mb-3">Contact for On-Spot Registration:</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-green-100 font-semibold">Abhi Ram</p>
                    <p className="text-green-200">7673941313</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-green-100 font-semibold">Raghu Ram</p>
                    <p className="text-green-200">6300458303</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">📍</div>
                <div className="text-left">
                  <h3 className="font-bold text-white mb-1">Venue</h3>
                  <p className="text-gray-300">KL University, Bachupally, Hyderabad</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-2xl">📅</div>
                <div className="text-left">
                  <h3 className="font-bold text-white mb-1">Date</h3>
                  <p className="text-gray-300">21st & 22nd February 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-2xl">⏰</div>
                <div className="text-left">
                  <h3 className="font-bold text-white mb-1">Reporting Time</h3>
                  <p className="text-gray-300">8:00 AM - 9:30 AM</p>
                  <p className="text-sm text-yellow-300 mt-2 italic">
                    ⚠️ Please arrive within this time for on-spot registration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Closing Message */}
          <p className="text-lg sm:text-xl text-blue-100 font-semibold">
            We look forward to seeing you at the event!
          </p>

          {/* Back to Home Button */}
          <a
            href="/"
            className="inline-block mt-8 px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm sm:text-base md:text-lg font-bold rounded-lg hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
