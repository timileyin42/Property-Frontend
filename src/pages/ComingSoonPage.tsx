// pages/ComingSoonPage.tsx (Simple Version)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center p-4">
      {/* Top Navigation */}
      <div className="w-full max-w-6xl px-6 py-4 absolute top-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Elycapvest</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-900 hover:text-blue-700 font-medium text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto">
        {/* Tagline */}
        <p className="text-blue-900 font-semibold text-sm tracking-widest uppercase mb-8">
          Partnership Program
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8">
          COMING
          <br />
          <span className="text-blue-900">SOON</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto">
          We're building an exclusive platform for our luxury real estate partners. 
          Stay tuned for something extraordinary.
        </p>

        {/* Stay Connected */}
        <div className="mb-12">
          <p className="text-gray-500 mb-4">Want to be the first to know?</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
          >
            Subscribe for Updates
          </button>
        </div>

        {/* Contact Info */}
        {/*<div className="pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-2">For partnership inquiries:</p>
          <p className="text-blue-900 font-medium">partnerships@elycapvest.com</p>
        </div>*/}
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Elycapvest. All rights reserved.
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              You&apos;re on the list
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You will be notified when we launch!
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium hover:bg-blue-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Dots */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-100 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-gray-100 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-50 rounded-full"></div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
