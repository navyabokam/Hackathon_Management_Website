import React from 'react';

export default function Landing(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">College Hackathon 2026</h1>
          <div className="space-x-4">
            <a href="/register" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Register Now
            </a>
            <a href="/admin/login" className="px-6 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
              Admin
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">Build Tomorrow, Today</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join us for an exciting hackathon where innovation meets creativity. Collaborate with brilliant minds
          and build solutions to real-world problems.
        </p>
        <a
          href="/register"
          className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
        >
          Register Your Team
        </a>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Event Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Registration</h3>
            <p className="text-gray-600">Dec 1 - Dec 15</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Hackathon Day</h3>
            <p className="text-gray-600">December 20, 2026</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Final Submissions</h3>
            <p className="text-gray-600">Dec 20, 6 PM</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Winners Announced</h3>
            <p className="text-gray-600">Dec 20, 7 PM</p>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Prize Pool</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">🥇 1st</div>
            <h3 className="text-2xl font-bold mb-2">₹50,000</h3>
            <p className="text-gray-600">+ Internship offers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-400 mb-2">🥈 2nd</div>
            <h3 className="text-2xl font-bold mb-2">₹30,000</h3>
            <p className="text-gray-600">+ Internship offers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">🥉 3rd</div>
            <h3 className="text-2xl font-bold mb-2">₹20,000</h3>
            <p className="text-gray-600">+ Certificates</p>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Rules & Guidelines</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-3">•</span>
            <span>Teams can have 1-4 members.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3">•</span>
            <span>All participants must be currently enrolled students.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3">•</span>
            <span>Registration fee: ₹500 per team.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3">•</span>
            <span>Plagiarism of any kind is not tolerated.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3">•</span>
            <span>Solutions must be built during the hackathon duration.</span>
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">FAQ</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded">
            <h3 className="font-bold text-lg mb-2">What is a hackathon?</h3>
            <p className="text-gray-600">
              A hackathon is an event where teams build innovative solutions in a limited time frame (usually 24
              hours).
            </p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Do I need prior experience?</h3>
            <p className="text-gray-600">No, everyone is welcome! We encourage beginners to participate.</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Can I work alone?</h3>
            <p className="text-gray-600">Yes, teams can have 1-4 members. Solo submissions are allowed.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; 2026 College Hackathon. All rights reserved.</p>
        <p className="text-gray-400 mt-2">For queries: contact@hackathon.local</p>
      </footer>
    </div>
  );
}
