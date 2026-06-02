import img from "../assets/aboutus.jpg"


const AboutUsMinimal = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-surface-lowest">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative group">
              <img
                src={img}
                alt="Elycapvest Luxury Homes"
                className="w-full rounded-xl border border-[rgba(248,246,241,0.15)] transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />

              {/* Floating badges */}
              <div className="absolute top-2 right-2 sm:-top-4 sm:-right-4 glass-panel p-3 sm:p-4 rounded-xl animate-float">
                <div className="text-center">
                  <div className="data-stat text-2xl text-success-emerald">100+</div>
                  <div className="label-caps text-[10px] text-on-surface-variant mt-1">Investors</div>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 sm:-bottom-4 sm:-left-4 glass-panel p-3 sm:p-4 rounded-xl animate-float-delayed">
                <div className="data-stat text-premium-gold text-sm">₦150M+</div>
                <div className="label-caps text-[10px] text-on-surface-variant mt-1">Invested</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block label-caps text-premium-gold tracking-[3px] mb-4">
                About Elycapvest Luxury Homes
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-white mb-6">
                Revolutionizing Real Estate
                <span className="text-on-surface-variant block italic">Investment in Africa</span>
              </h1>

              <div className="space-y-4 text-on-surface-variant">
                <p className="text-lg leading-relaxed">
                  Elycapvest Luxury Homes is revolutionizing real estate investment in Africa by combining
                  fractional ownership with complete transparency in shortlet property management.
                </p>
                <p>
                  Founded in 2024, we recognized that traditional real estate investment was inaccessible
                  to many and lacked the transparency investors deserved.
                </p>
                <p>
                  Our platform allows investors to purchase fractions of premium properties, monitor
                  real-time performance, and earn passive income through shortlet rentals.
                </p>
              </div>
            </div>

            {/* Stats - Simpler version */}
           {/* <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Investors</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text:xl md:text-2xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600">Properties</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-blue-600">₦500B+</div>
                <div className="text-sm text-gray-600">Invested</div>
              </div>
            </div>
*/}
            {/* CTA */}
            
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default AboutUsMinimal;
