import React from 'react';

export default function Landing(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <img src="/klu-logo.jpg" alt="KL University Logo" className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
              <img src="/gfg-logo.jpg" alt="GFG Logo" className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
            </div>
            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              <a href="/register" className="px-5 sm:px-6 py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap flex-1 sm:flex-none text-center">
                Register Now
              </a>
              <a href="/admin/login" className="px-5 sm:px-6 py-2.5 text-sm sm:text-base text-blue-600 border border-blue-600 rounded hover:bg-blue-50 whitespace-nowrap flex-1 sm:flex-none text-center">
                Admin
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 sm:mb-4">
            <p className="text-blue-300 text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest mb-3 sm:mb-2">Department of CSE Presents</p>
            <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mb-4 pb-2 sm:pb-4">
              ForgeAscend v1.0
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 italic mb-6 sm:mb-8 px-2 sm:px-4">From Concept to Code — Guided to Greatness</p>
          </div>
          
          <div className="mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-6 tracking-tight px-3 leading-tight">
              24 HOUR MEGA BUILD-A-THON
            </h2>
            <p className="text-xs sm:text-base md:text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed px-4 sm:px-6">
              A STRUCTURED EXPERIENCE WHERE LEARNING MEETS HIGH-ENERGY COMPETITION AND REAL-WORLD BUILDING
            </p>
          </div>

          <a
            href="/register"
            className="inline-block px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm sm:text-lg md:text-xl font-bold rounded-lg hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all mx-auto"
          >
            Register Your Team
          </a>

          {/* Sponsored By */}
          <div className="mt-10 sm:mt-16 flex flex-col items-center px-4">
            <p className="text-gray-300 text-sm sm:text-base uppercase tracking-widest mb-4 sm:mb-6">Sponsored By</p>
            <div className="bg-white/10 backdrop-blur-sm px-6 sm:px-12 md:px-24 py-6 sm:py-8 md:py-12 rounded-xl sm:rounded-2xl border border-white/20 hover:border-white/40 transition-all w-full sm:min-w-[500px] md:min-w-[800px] max-w-5xl">
              <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12 flex-wrap">
                <img src="/gradStreet.jpg" alt="GradStreet" className="h-10 sm:h-12 md:h-16 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Info Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-blue-400/50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-4 rounded-full group-hover:bg-blue-500/30 transition-all">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Date</h3>
                <p className="text-blue-200 text-sm">20th & 21st February 2026</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-blue-400/50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-500/20 p-4 rounded-full group-hover:bg-cyan-500/30 transition-all">
                <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Duration</h3>
                <p className="text-blue-200 text-sm">10AM (Fri) to 10AM (Sat)</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-blue-400/50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-4 rounded-full group-hover:bg-purple-500/30 transition-all">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Venue</h3>
                <p className="text-blue-200 text-sm">KLH Bachupally Campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Pool & Registration */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Prize Pool */}
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-md p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-yellow-500/30">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏆</div>
              <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 mb-2">₹50,000</h2>
              <p className="text-lg sm:text-xl text-gray-300">Prize Pool</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-2 shadow-lg">
                  💎
                </div>
                <p className="text-xs text-gray-300 mb-1">Platinum</p>
                <p className="text-xs sm:text-sm font-bold text-cyan-300">₹20,000</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg">
                  🥇
                </div>
                <p className="text-xs text-gray-300 mb-1">Gold</p>
                <p className="text-sm font-bold text-yellow-300">₹15,000</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-400 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg">
                  🥈
                </div>
                <p className="text-xs text-gray-300 mb-1">Silver</p>
                <p className="text-sm font-bold text-gray-200">₹10,000</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-600 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg">
                  🥉
                </div>
                <p className="text-xs text-gray-300 mb-1">Bronze</p>
                <p className="text-sm font-bold text-orange-300">₹5,000</p>
              </div>
            </div>
          </div>

          {/* Registration Fee */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-md p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-blue-500/30">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Registration Fee</h2>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-200">Solo</span>
                  <span className="text-2xl font-bold text-cyan-300">₹349</span>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-200">Duo</span>
                  <span className="text-2xl font-bold text-cyan-300">₹599</span>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-200">Trio / Squad</span>
                  <span className="text-2xl font-bold text-cyan-300">₹999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10 text-center">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="text-3xl mb-3">👨‍🏫</div>
            <h3 className="text-xl font-bold text-white mb-2">Expert Trainers 24/7</h3>
            <p className="text-gray-400">Throughout the event</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">Learn Concepts & Apply</h3>
            <p className="text-gray-400">Immediately, and build with confidence</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">Compete Alongside Learning</h3>
            <p className="text-gray-400">Not after learning ends</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-xl font-bold text-white mb-2">Continuous Guidance</h3>
            <p className="text-gray-400">Evaluation, and mentorship</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Guaranteed Takeaway</h3>
            <p className="text-gray-400">One complete, real-world project</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">Win & Learn</h3>
            <p className="text-gray-400">Best of both worlds</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md text-white py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg mb-2">&copy; 2026 ForgeAscend - KLH University Bachupally Campus</p>
          <p className="text-gray-400">Department of Computer Science & Engineering</p>
          <p className="text-gray-500 mt-4 text-sm">For queries: forgeascend@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}
