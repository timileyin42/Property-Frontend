import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { fetchInvestorInvestmentDetail } from "../../api/investor.investments";
import type { InvestmentDetail } from "../../types/investment";
import type { ApiProperty } from "../../types/property";
import { CiLocationOn } from "react-icons/ci";
import { isVideoUrl, usePresignedUrls } from "../../util/normalizeMediaUrl";

const formatCurrency = (value?: number | null) =>
  typeof value === "number" ? `₦${value.toLocaleString()}` : "N/A";

const InvestmentDetails = () => {
  const { investmentId } = useParams<{ investmentId: string }>();
  const location = useLocation();
  const [investment, setInvestment] = useState<InvestmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!investmentId) return;

    const load = async () => {
      try {
        const data = await fetchInvestorInvestmentDetail(Number(investmentId));
        setInvestment(data);
      } catch (error) {
        console.error("Failed to fetch investment details:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [investmentId]);

  const property = investment?.property as
    | (Partial<ApiProperty> & {
        images?: string[];
        videos?: string[];
        media?: string[];
        media_files?: Array<{ url?: string; file_url?: string; secure_url?: string }>;
      })
    | undefined;
  const fractionsOwnedFromState = (location.state as { fractionsOwned?: number } | null)?.fractionsOwned;
  const fractionsOwned = investment?.fractions_owned ?? fractionsOwnedFromState ?? 0;
  const fractionsSold = investment?.fractions_sold ?? investment?.fractions_removed ?? 0;
  const soldTotal = fractionsSold + fractionsOwned;
  const hasSoldFractions = fractionsSold > 0;
  const soldPricePerFraction = investment?.sold_price_per_fraction ?? null;
  const soldValueTotal = investment?.sold_value_total ?? null;
  const soldProfitTotal = investment?.sold_profit_total ?? null;
  const perFractionInitial = Number.isFinite(property?.fraction_price)
    ? Number(property?.fraction_price)
    : null;
  const perFractionCurrent = Number.isFinite(property?.project_value) && Number.isFinite(property?.total_fractions)
    ? Number(property?.project_value) / Number(property?.total_fractions)
    : perFractionInitial;
  const lifetimeInitialValue =
    perFractionInitial !== null ? perFractionInitial * soldTotal : null;
  const lifetimeCurrentValue =
    perFractionCurrent !== null ? perFractionCurrent * soldTotal : null;
  const showLifetimeValues =
    soldTotal > 0 &&
    (investment?.initial_value ?? 0) === 0 &&
    (investment?.current_value ?? 0) === 0;
  const displayInitialValue = showLifetimeValues
    ? lifetimeInitialValue
    : investment?.initial_value ?? null;
  const displayCurrentValue = showLifetimeValues
    ? lifetimeCurrentValue
    : investment?.current_value ?? null;

  const mediaItems = usePresignedUrls(
    useMemo(() => {
      if (!property) return [];
      const urls = [
        investment?.image_url,
        property.primary_image,
        ...(property.image_urls ?? []),
        ...(property.media_urls ?? []),
        ...(property.media_files?.map((item) => item.url ?? item.file_url ?? item.secure_url) ?? []),
        ...(property.images ?? []),
        ...(property.videos ?? []),
        ...(property.media ?? []),
        property.image_url,
      ].filter(Boolean) as string[];
      return Array.from(new Set(urls));
    }, [property, investment?.image_url])
  );
  const selectedMedia = viewerIndex !== null ? mediaItems[viewerIndex] : null;

  useEffect(() => {
    if (viewerIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewerIndex(null);
      }
      if (event.key === "ArrowLeft" && viewerIndex > 0) {
        setViewerIndex(viewerIndex - 1);
      }
      if (event.key === "ArrowRight" && viewerIndex < mediaItems.length - 1) {
        setViewerIndex(viewerIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, mediaItems.length]);

  useEffect(() => {
    if (viewerIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [viewerIndex]);

  const goPrev = () => {
    setViewerIndex((current) =>
      current === null ? current : Math.max(0, current - 1)
    );
  };

  const goNext = () => {
    setViewerIndex((current) =>
      current === null ? current : Math.min(mediaItems.length - 1, current + 1)
    );
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? null;
    if (endX === null) return;
    const delta = touchStartX.current - endX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) {
      if (viewerIndex !== null && viewerIndex < mediaItems.length - 1) {
        goNext();
      }
    } else if (viewerIndex !== null && viewerIndex > 0) {
      goPrev();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Loading investment…
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Investment not found.
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Property details unavailable.
      </div>
    );
  }

  const growthPositive = (investment.growth_percentage ?? 0) >= 0;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
        ]}
      />

      <main className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb + header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-on-surface-variant mb-4 label-caps">
            <Link to="/investor/dashboard" className="hover:text-premium-gold">Portfolio</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-premium-gold">{property.title ?? "Property"}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl text-on-surface mb-2">
                {property.title ?? "Property"}
              </h1>
              <p className="text-on-surface-variant flex items-center gap-2">
                <CiLocationOn />
                {property.location ?? "Location unavailable"}
              </p>
            </div>
            <span className="glass-panel px-4 py-2 rounded-full data-stat text-success-emerald self-start">
              {property.expected_roi ?? 0}% ROI
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Hero image */}
            <div className="relative h-[360px] overflow-hidden rounded-xl glass-panel group">
              {mediaItems[0] ? (
                isVideoUrl(mediaItems[0]) ? (
                  <video controls className="w-full h-full object-cover" onClick={() => setViewerIndex(0)}>
                    <source src={mediaItems[0]} />
                  </video>
                ) : (
                  <img
                    src={mediaItems[0]}
                    alt={property.title ?? "Property"}
                    onClick={() => setViewerIndex(0)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                  />
                )
              ) : (
                <div className="w-full h-full bg-surface-high flex items-center justify-center text-on-surface-variant text-sm">
                  Media unavailable
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-success-emerald/20 text-secondary border border-success-emerald px-3 py-1 rounded-full label-caps text-[10px]">
                  {fractionsOwned > 0 ? "Performing Asset" : "Exited Asset"}
                </span>
              </div>
              {mediaItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => setViewerIndex(0)}
                  className="absolute bottom-4 right-4 glass-panel rounded px-3 py-1 label-caps text-[10px] text-on-surface"
                >
                  View all {mediaItems.length}
                </button>
              )}
            </div>

            {/* Stake breakdown bento */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-lg">
                <p className="label-caps text-[10px] text-on-surface-variant mb-2">Initial Value</p>
                <p className="data-stat text-on-surface">{formatCurrency(displayInitialValue)}</p>
                <p className="text-[12px] text-on-surface-variant mt-1">{fractionsOwned} fractions</p>
              </div>
              <div className="glass-panel p-5 rounded-lg">
                <p className="label-caps text-[10px] text-on-surface-variant mb-2">Current Value</p>
                <p className="data-stat text-premium-gold">{formatCurrency(displayCurrentValue)}</p>
                <p className={`text-[12px] mt-1 flex items-center gap-1 ${growthPositive ? "text-success-emerald" : "text-error"}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {growthPositive ? "trending_up" : "trending_down"}
                  </span>
                  {growthPositive ? "+" : ""}{investment.growth_percentage}%
                </p>
              </div>
              <div className="glass-panel p-5 rounded-lg">
                <p className="label-caps text-[10px] text-on-surface-variant mb-2">Growth Amount</p>
                <p className="data-stat text-success-emerald">{formatCurrency(investment.growth_amount ?? null)}</p>
                <p className="text-[12px] text-on-surface-variant mt-1">Unrealized</p>
              </div>
              <div className="glass-panel p-5 rounded-lg">
                <p className="label-caps text-[10px] text-on-surface-variant mb-2">Ownership</p>
                <p className="data-stat text-on-surface">{investment.ownership_percentage ?? 0}%</p>
                <p className="text-[12px] text-on-surface-variant mt-1">of total</p>
              </div>
            </div>

            {/* Property details */}
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-display text-2xl text-on-surface mb-3 border-l-2 border-premium-gold pl-4">
                Property Details
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                {property.description ?? "Description unavailable."}
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-low rounded-lg p-4 border border-[rgba(248,246,241,0.1)]">
                  <p className="label-caps text-[10px] text-on-surface-variant mb-1">Asset Value</p>
                  <p className="data-stat text-sm text-on-surface">{formatCurrency(property.project_value ?? null)}</p>
                </div>
                <div className="bg-surface-low rounded-lg p-4 border border-[rgba(248,246,241,0.1)]">
                  <p className="label-caps text-[10px] text-on-surface-variant mb-1">Per Fraction</p>
                  <p className="data-stat text-sm text-on-surface">{formatCurrency(property.fraction_price ?? null)}</p>
                </div>
                <div className="bg-surface-low rounded-lg p-4 border border-[rgba(248,246,241,0.1)]">
                  <p className="label-caps text-[10px] text-on-surface-variant mb-1">Fractions Owned</p>
                  <p className="data-stat text-sm text-on-surface">{fractionsOwned}</p>
                </div>
                <div className="bg-surface-low rounded-lg p-4 border border-[rgba(248,246,241,0.1)]">
                  <p className="label-caps text-[10px] text-on-surface-variant mb-1">Area</p>
                  <p className="data-stat text-sm text-on-surface">
                    {property.area_sqft !== undefined ? `${property.area_sqft} sqft` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: investment summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <h3 className="font-display text-2xl text-on-surface">Investment Summary</h3>
              <div className="space-y-4">
                {[
                  { label: "Fractions Owned", value: `${investment.fractions_owned}` },
                  { label: "Ownership", value: `${investment.ownership_percentage ?? 0}%` },
                  { label: "Initial Value", value: formatCurrency(displayInitialValue) },
                  { label: "Current Value", value: formatCurrency(displayCurrentValue), accent: "text-premium-gold" },
                  { label: "Growth", value: `+${investment.growth_percentage}%`, accent: "text-success-emerald" },
                  { label: "Growth Amount", value: formatCurrency(investment.growth_amount ?? null), accent: "text-success-emerald" },
                  ...(hasSoldFractions && soldPricePerFraction !== null
                    ? [{ label: "Sold Price / Fraction", value: formatCurrency(soldPricePerFraction) }] : []),
                  ...(hasSoldFractions && soldValueTotal !== null
                    ? [{ label: "Sold Value", value: formatCurrency(soldValueTotal) }] : []),
                  ...(hasSoldFractions && soldProfitTotal !== null
                    ? [{ label: "Sold Profit", value: formatCurrency(soldProfitTotal), accent: "text-success-emerald" }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">{row.label}</span>
                    <span className={`data-stat text-sm ${row.accent ?? "text-on-surface"}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              {hasSoldFractions && (
                <div className="rounded-lg border border-premium-gold/30 bg-premium-gold/10 p-3 text-sm text-tertiary">
                  {fractionsOwned === 0
                    ? `You have sold all ${soldTotal} fractions in ${property.title ?? "this property"}.`
                    : `You have sold ${fractionsSold} fractions in ${property.title ?? "this property"}.`}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setViewerIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setViewerIndex(null)}
              className="absolute -top-10 right-0 text-white text-sm bg-black/60 rounded-md px-3 py-1 hover:bg-black/80"
            >
              Close
            </button>
            {viewerIndex !== null && viewerIndex > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-white text-lg"
              >
                ←
              </button>
            )}
            {viewerIndex !== null && viewerIndex < mediaItems.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-white text-lg"
              >
                →
              </button>
            )}
            {isVideoUrl(selectedMedia) ? (
              <video controls className="w-full max-h-[80vh] rounded-xl bg-black">
                <source src={selectedMedia} />
              </video>
            ) : (
              <img
                src={selectedMedia}
                alt={property.title ?? "Property"}
                className="w-full max-h-[80vh] object-contain rounded-xl bg-black"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentDetails;
