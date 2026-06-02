import Navbar from "./Navbar"
import { ShieldIcon, TrendUpIcon, UsersIcon } from "../components/svgs/ShieldIcon"
import { GoGoal } from "react-icons/go";
import { IoEye } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaInstagram } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import img1 from "../assets/img1.jpg";
import { fetchFeaturedProperties } from "../api/properties";
import { useEffect, useMemo, useState } from "react";
import { ApiProperty } from "../types/property";
import LandingPropertyCard from "../components/LandingPropertyCard";
import TestimonialsSimple from "../components/TestimonialsSimple";
import AboutUsMinimal from "../components/AboutUsMinimal"
import FAQ from "../components/FAQ"

// Hero cross-fade slideshow — Vantello off-plan imagery, in Stitch-specified order:
// Aerial Night → f1 → F2 → f11 → Kitchen → Living Room
import heroAerialNight from "../assets/hero/01-aerial-night.jpg";
import heroF1 from "../assets/hero/02-f1.jpg";
import heroF2 from "../assets/hero/03-f2.jpg";
import heroF11 from "../assets/hero/04-f11.jpg";
import heroKitchen from "../assets/hero/05-kitchen.jpg";
import heroLivingRoom from "../assets/hero/06-living-room.jpg";

const HERO_SLIDES = [
  heroAerialNight,
  heroF1,
  heroF2,
  heroF11,
  heroKitchen,
  heroLivingRoom,
];

const SLIDE_DWELL_MS = 5000;

interface StatementItem {
  id: number;
  icon: JSX.Element;
  img: string;
  label: string;
  desc: string;
}

function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchFeaturedProperties(12);
        setProperties(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProperties();
  }, []);

  // Drive the hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DWELL_MS);
    return () => clearInterval(timer);
  }, []);

  const whatWeOffer = [
    { id: 1, icon: <ShieldIcon className="text-premium-gold" />, label: "Full Transparency", desc: "Monitor your shortlet property performance with real-time data and complete financial transparency." },
    { id: 2, icon: <TrendUpIcon className="text-premium-gold" />, label: "Fractional Investment", desc: "Start investing in premium real estate with as little as a fraction of the total property value." },
    { id: 3, icon: <UsersIcon className="text-premium-gold" />, label: "Verified Community", desc: "Join a community of verified investors and property owners with secure authentication." },
  ]

  const statement: StatementItem[] = [
    { id: 1, icon: <GoGoal className="text-premium-gold" />, img: img1, label: "Our Mission", desc: "To democratize real estate investment by making premium properties accessible to everyone through fractional ownership and complete transparency." },
    { id: 2, icon: <IoEye className="text-premium-gold" />, img: img1, label: "Our Vision", desc: "To become Africa's leading platform for transparent fractional real estate investment, empowering thousands of investors to build wealth through property." },
    { id: 3, icon: <IoIosHeartEmpty className="text-premium-gold" />, img: img1, label: "Our Values", desc: "Transparency, integrity, and investor success are at the core of everything we do. We believe in honest, ethical business practices." },
  ]

  // Live stats derived from real featured data (no fabricated figures)
  const heroStats = useMemo(() => {
    if (properties.length === 0) {
      return { count: "—", avgRoi: "10%", minInvest: "—" };
    }
    const fractionPrices = properties
      .map((p) => p.fraction_price)
      .filter((v): v is number => typeof v === "number" && v > 0);
    const minInvest = fractionPrices.length ? Math.min(...fractionPrices) : 0;
    return {
      count: `${properties.length}`,
      avgRoi: "10%",
      minInvest: minInvest ? `₦${minInvest.toLocaleString()}` : "—",
    };
  }, [properties]);

  // Featured property powering the floating "Live Listing" widget
  const liveListing = properties[0];
  const liveFunding =
    liveListing && liveListing.total_fractions > 0
      ? Math.round(
          ((liveListing.fractions_sold ?? 0) / liveListing.total_fractions) * 100
        )
      : 0;

  const featured = properties.slice(0, 6);

  return (
    <div className="flex flex-col items-center bg-background text-on-surface min-h-screen w-full">
      <Navbar
        logoText="Elycapvest Luxury Homes"
        links={[
          { label: "Properties", href: "/properties" },
          { label: "Partnership", href: "/partnership" },
        ]}
      />

      <main className="pt-20 text-base w-full">
        {/* ===================== HERO ===================== */}
        <section className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
          {/* Cross-fade slideshow background */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            {HERO_SLIDES.map((src, i) => (
              <div
                key={src}
                className={`hero-slide ${i === activeSlide ? "is-active" : ""}`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
            {/* Legibility overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/40" />
          </div>

          <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-16">
            {/* Left: headline */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-success-emerald animate-pulse" />
                <span className="label-caps text-[10px] text-secondary">
                  Institutional Access for Everyone
                </span>
              </div>

              <h1 className="font-display text-white font-medium leading-[1.1] tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-xl">
                Own <span className="text-gradient-gold italic">Fractions</span> of Real Estate. Earn While You Sleep.
              </h1>

              <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-md leading-relaxed">
                Invest in premium real estate with complete transparency. Monitor
                your properties making money for you in real-time and watch your
                investment grow.
              </p>

              <div className="flex flex-wrap gap-4">
                {!isAuthenticated && (
                  <button
                    className="btn-gold px-8 py-4 text-[12px]"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                  </button>
                )}
                <button
                  onClick={() => navigate("/properties")}
                  className="btn-ghost px-8 py-4 label-caps text-on-surface"
                >
                  View Properties
                </button>
              </div>
            </div>

            {/* Right: floating live-listing widget */}
            {liveListing && (
              <div className="hidden md:flex justify-center">
                <div className="glass-panel p-6 rounded-xl w-80 float-anim">
                  <div className="flex justify-between items-center mb-5">
                    <span className="label-caps text-on-surface-variant">Live Listing</span>
                    <span className="data-stat text-success-emerald text-sm">
                      {liveFunding}% Funded
                    </span>
                  </div>
                  <div
                    className="w-full h-40 rounded-lg mb-4 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroF1})` }}
                  />
                  <h3 className="font-display text-xl text-white mb-3 line-clamp-1">
                    {liveListing.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="label-caps text-[10px] text-on-surface-variant">Min Invest</p>
                      <p className="data-stat text-data-mono text-lg">
                        {liveListing.fraction_price
                          ? `₦${liveListing.fraction_price.toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="label-caps text-[10px] text-on-surface-variant">Expected ROI</p>
                      <p className="data-stat text-success-emerald text-lg">
                        {liveListing.expected_roi}%
                      </p>
                    </div>
                  </div>
                  <div className="h-1 bg-surface-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success-emerald rounded-full"
                      style={{ width: `${liveFunding}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================== STATS BAR ===================== */}
        <section className="relative z-20 -mt-12 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="glass-panel grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(248,246,241,0.12)] p-8 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center py-4 md:py-0 px-8 text-center">
              <span className="label-caps text-premium-gold mb-2">Featured Properties</span>
              <span className="data-stat text-4xl text-white">{heroStats.count}</span>
            </div>
            <div className="flex flex-col items-center py-4 md:py-0 px-8 text-center">
              <span className="label-caps text-premium-gold mb-2">Average Expected ROI</span>
              <span className="data-stat text-4xl text-success-emerald">{heroStats.avgRoi}</span>
            </div>
            <div className="flex flex-col items-center py-4 md:py-0 px-8 text-center">
              <span className="label-caps text-premium-gold mb-2">Starting From</span>
              <span className="data-stat text-4xl text-white">{heroStats.minInvest}</span>
            </div>
          </div>
        </section>

        {/* ===================== MISSION / VISION / VALUES ===================== */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statement.map((item) => (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover rounded-xl p-8"
              >
                <div className="w-14 h-14 rounded-lg glass-panel flex items-center justify-center text-2xl mb-6">
                  {item.icon}
                </div>
                <h3 className="font-display text-2xl text-white mb-3">{item.label}</h3>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== WHY CHOOSE ===================== */}
        <section className="py-16 bg-surface-lowest">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <span className="label-caps text-premium-gold tracking-[4px] mb-4 block">
                The Mechanism
              </span>
              <h2 className="font-display text-white text-3xl sm:text-4xl">
                Why Choose Elycapvest?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whatWeOffer.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="w-16 h-16 glass-panel rounded-lg flex items-center justify-center text-3xl mb-6 group-hover:bg-premium-gold transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-2xl text-white mb-4">{item.label}</h3>
                  <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== FEATURED PROPERTIES ===================== */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12">
            <div>
              <span className="label-caps text-on-surface-variant tracking-[4px] mb-4 block">
                Exclusive Portfolio
              </span>
              <h2 className="font-display text-white text-3xl sm:text-4xl">
                Featured Opportunities
              </h2>
              <p className="text-on-surface-variant mt-2">
                Explore our curated selection of premium shortlet properties
              </p>
            </div>
          </div>

          {featured.length === 0 ? (
            <p className="text-on-surface-variant text-base">Loading properties…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((property) => (
                <LandingPropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-12">
            <button
              className="btn-ghost px-8 py-3 label-caps text-on-surface"
              onClick={() => navigate("/properties")}
            >
              View All Properties
            </button>
          </div>
        </section>

        <AboutUsMinimal />

        {/* ===================== TESTIMONIALS ===================== */}
        <section className="py-24 flex flex-col mx-auto items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
              What Our Investors Say
            </h2>
            <p className="text-on-surface-variant text-base">
              Hear from investors who trust us with their real estate investments
            </p>
          </div>
          <TestimonialsSimple />
        </section>

        <section>
          <FAQ />
        </section>

        {/* ===================== CTA ===================== */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="glass-panel p-12 md:p-16 rounded-[40px] text-center bg-gradient-to-br from-primary-container to-background">
            <h2 className="font-display text-white text-3xl md:text-4xl mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-on-surface-variant text-base max-w-xl mx-auto mb-8">
              Join Elycapvest Properties today and get access to premium shortlet
              properties.
            </p>
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/signup")}
                className="btn-gold px-10 py-4 text-[12px]"
              >
                Create Your Account
              </button>
            )}
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="mt-12 bg-surface-lowest border-t border-[rgba(248,246,241,0.15)] text-on-surface px-6 py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <span className="font-display text-premium-gold text-2xl mb-4 block">
                Elycapvest Luxury Homes
              </span>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Democratizing premium real estate through transparent fractional
                ownership.
              </p>
            </div>
            <div>
              <h3 className="label-caps text-white mb-5">Quick Links</h3>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                <li><a className="hover:text-premium-gold transition-colors" href="/properties">Properties</a></li>
                <li><a className="hover:text-premium-gold transition-colors" href="/updates">Updates</a></li>
                <li><a className="hover:text-premium-gold transition-colors" href="/about">About Us</a></li>
                <li><a className="hover:text-premium-gold transition-colors" href="/contact">Contact Us</a></li>
                <li><a className="hover:text-premium-gold transition-colors" href="/partnership">Partnership</a></li>
              </ul>
            </div>
            <div>
              <h3 className="label-caps text-white mb-5">Contact Us</h3>
              <div className="space-y-3 text-sm text-on-surface-variant">
                <p>partnerships@elycapvest.com</p>
                <p>University Road Akoka Yaba, Lagos</p>
                <p>+234 8133101607</p>
              </div>
            </div>
            <div>
              <h3 className="label-caps text-white mb-5">Follow Us</h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/elycap_luxuryhomes/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-on-surface-variant hover:text-premium-gold transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <span className="text-sm text-on-surface-variant">@elycap_luxuryhomes</span>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-[rgba(248,246,241,0.1)] pt-6 text-xs text-on-surface-variant/60">
            <p>© {new Date().getFullYear()} Elycapvest Luxury Homes. All rights reserved.</p>
            <p>Trusted by investors building wealth through shortlet properties.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default HeroSection;
