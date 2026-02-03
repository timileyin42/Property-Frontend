import img from "../assets/aboutus.jpg"


const AboutUsMinimal = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative group">
              <img
                // src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                src={img}
                alt="Elycap Luxury Homes"
                className="w-full rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg animate-float">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-xs text-gray-600">Investors</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-blue-900 text-white p-4 rounded-xl shadow-lg animate-float-delayed">
                <div className="text-sm font-medium">NGN500B+</div>
                <div className="text-xs opacity-90">Invested</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block text-gray-900 font-semibold text-sm tracking-wider mb-4">
                ABOUT ELYCAP HOMES
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                Revolutionizing Real Estate
                <span className="text-gray-500 block">Investment in Africa</span>
              </h1>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg leading-relaxed">
                  Elycap Luxury Homes is revolutionizing real estate investment in Africa by combining 
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