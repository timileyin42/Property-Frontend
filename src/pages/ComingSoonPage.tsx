// pages/ComingSoonPage.tsx (Simple Version)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-premium-gold opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-success-emerald opacity-[0.04] blur-[120px] pointer-events-none" />

      {/* Top navigation */}
      <div className="w-full max-w-6xl px-6 py-4 absolute top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-2xl text-premium-gold tracking-tight">Elycapvest</h1>
          <button
            onClick={() => navigate('/')}
            className="label-caps text-on-surface-variant hover:text-premium-gold transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="text-center max-w-2xl mx-auto z-10">
        <p className="label-caps text-premium-gold tracking-[4px] mb-8">Partnership Program</p>

        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-on-surface mb-8 leading-none">
          Coming
          <br />
          <span className="text-gradient-gold italic">Soon</span>
        </h1>

        <p className="text-lg text-on-surface-variant mb-12 max-w-md mx-auto">
          We&apos;re building an exclusive platform for our luxury real estate partners. Stay tuned
          for something extraordinary.
        </p>

        <div className="mb-12">
          <p className="text-on-surface-variant mb-4">Want to be the first to know?</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-gold px-8 py-4 text-[12px]">
            Subscribe for Updates
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center z-10">
        <p className="label-caps text-[10px] text-on-surface-variant/40">
          © {new Date().getFullYear()} Elycapvest Luxury Homes. All rights reserved.
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md glass-panel rounded-xl p-6">
            <h2 className="font-display text-2xl text-on-surface">You&apos;re on the list</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              You will be notified when we launch!
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-gold px-5 py-2.5 text-[12px]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingSoonPage;
