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
    return <p className="text-center py-10">Loading investment...</p>;
  }

  if (!investment) {
    return <p className="text-center py-10">Investment not found.</p>;
  }

  if (!property) {
    return <p className="text-center py-10">Property details unavailable.</p>;
  }

  return (
    <div className="mx-auto px-4 my-16">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
        ]}
      />

      <div className="pt-6 mb-8 flex flex-col gap-2">
        <Link
          to="/investor/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to dashboard
        </Link>
        <h2 className="font-inter font-bold text-blue-900 text-[clamp(1.25rem,4vw,2rem)]">
          {property.title ?? "Property"}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <CiLocationOn />
            {property.location ?? "Location unavailable"}
          </span>
          <span className="inline-flex items-center bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            {property.expected_roi ?? 0}% ROI
          </span>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            {mediaItems.length === 0 && (
              <div className="h-[320px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-xl">
                Media unavailable
              </div>
            )}

            {mediaItems[0] && (
              <div className="relative rounded-xl overflow-hidden cursor-pointer">
                {isVideoUrl(mediaItems[0]) ? (
                  <video
                    controls
                    className="w-full h-[320px] object-cover"
                    onClick={() => setViewerIndex(0)}
                  >
                    <source src={mediaItems[0]} />
                  </video>
                ) : (
                  <img
                    src={mediaItems[0]}
                    alt={property.title ?? "Property"}
                    className="w-full h-[320px] object-cover"
                    onClick={() => setViewerIndex(0)}
                  />
                )}
                {mediaItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setViewerIndex(0)}
                    className="absolute bottom-3 right-3 rounded-md bg-black/70 px-3 py-1 text-xs font-semibold text-white"
                  >
                    View
                  </button>
                )}
              </div>
            )}

            {mediaItems.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaItems.slice(1).map((item, index) => (
                  <div
                    key={item}
                    className="relative rounded-xl overflow-hidden cursor-pointer"
                  >
                    {isVideoUrl(item) ? (
                      <video
                        controls
                        className="w-full h-48 object-cover"
                        onClick={() => setViewerIndex(index + 1)}
                      >
                        <source src={item} />
                      </video>
                    ) : (
                      <img
                        src={item}
                        alt={property.title ?? "Property"}
                        className="w-full h-48 object-cover"
                        onClick={() => setViewerIndex(index + 1)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-blue-900 font-semibold text-lg mb-3">
              Property Details
            </h3>
            <p className="text-gray-600 text-sm leading-6">
              {property.description ?? "Description unavailable."}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Total Value</p>
                <p className="text-blue-900 font-semibold">
                  {formatCurrency(property.project_value ?? null)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Per Fraction</p>
                <p className="text-blue-900 font-semibold">
                  {formatCurrency(property.fraction_price ?? null)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Fractions Owned</p>
                <p className="text-blue-900 font-semibold">
                  {fractionsOwned}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Area</p>
                <p className="text-blue-900 font-semibold">
                  {property.area_sqft !== undefined ? `${property.area_sqft} sqft` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-blue-900 font-semibold text-lg">
              Investment Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Fractions Owned</p>
                <p className="text-blue-900 font-semibold">
                  {investment.fractions_owned}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Ownership</p>
                <p className="text-blue-900 font-semibold">
                  {investment.ownership_percentage ?? 0}%
                </p>
              </div>
              <div>
                <p className="text-gray-500">Initial Value</p>
                <p className="text-blue-900 font-semibold">
                  {formatCurrency(displayInitialValue)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Current Value</p>
                <p className="text-blue-900 font-semibold">
                  {formatCurrency(displayCurrentValue)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Growth</p>
                <p className="text-emerald-600 font-semibold">
                  +{investment.growth_percentage}%
                </p>
              </div>
              <div>
                <p className="text-gray-500">Growth Amount</p>
                <p className="text-emerald-600 font-semibold">
                  {formatCurrency(investment.growth_amount ?? null)}
                </p>
              </div>
              {hasSoldFractions && soldPricePerFraction !== null && (
                <div>
                  <p className="text-gray-500">Sold Price / Fraction</p>
                  <p className="text-blue-900 font-semibold">
                    {formatCurrency(soldPricePerFraction)}
                  </p>
                </div>
              )}
              {hasSoldFractions && soldValueTotal !== null && (
                <div>
                  <p className="text-gray-500">Sold Value</p>
                  <p className="text-blue-900 font-semibold">
                    {formatCurrency(soldValueTotal)}
                  </p>
                </div>
              )}
              {hasSoldFractions && soldProfitTotal !== null && (
                <div>
                  <p className="text-gray-500">Sold Profit</p>
                  <p className="text-emerald-600 font-semibold">
                    {formatCurrency(soldProfitTotal)}
                  </p>
                </div>
              )}
            </div>
            {hasSoldFractions && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {fractionsOwned === 0
                  ? `You have sold all ${soldTotal} fractions in ${property.title ?? "this property"}.`
                  : `You have sold ${fractionsSold} fractions in ${property.title ?? "this property"}.`}
              </div>
            )}
          </div>
        </div>
      </section>
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
