import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { fetchInvestorInvestmentDetail } from "../../api/investor.investments";
import type { InvestmentDetail } from "../../types/investment";
import { CiLocationOn } from "react-icons/ci";
import { isVideoUrl, normalizeMediaUrl } from "../../util/normalizeMediaUrl";

const InvestmentDetails = () => {
  const { investmentId } = useParams<{ investmentId: string }>();
  const location = useLocation();
  const [investment, setInvestment] = useState<InvestmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

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

  const property: any = investment?.property ?? {};
  const fractionsOwnedFromState = (location.state as { fractionsOwned?: number } | null)?.fractionsOwned;
  const fractionsOwned = investment?.fractions_owned ?? fractionsOwnedFromState ?? 0;

  const mediaItems = useMemo(() => {
    if (!property) return [];
    const urls = [
      investment?.image_url,
      property.primary_image,
      ...(property.image_urls ?? []),
      ...(property.media_urls ?? []),
      ...(property.media_files?.map((item: any) => item.url ?? item.file_url ?? item.secure_url) ?? []),
      ...(property.images ?? []),
      ...(property.videos ?? []),
      ...(property.media ?? []),
      property.image_url,
    ]
      .map((url) => normalizeMediaUrl(url))
      .filter(Boolean);
    return Array.from(new Set(urls));
  }, [property]);

  if (loading) {
    return <p className="text-center py-10">Loading investment...</p>;
  }

  if (!investment) {
    return <p className="text-center py-10">Investment not found.</p>;
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
          {property.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <CiLocationOn />
            {property.location}
          </span>
          <span className="inline-flex items-center bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            {property.expected_roi}% ROI
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
              <div className="rounded-xl overflow-hidden">
                {isVideoUrl(mediaItems[0]) ? (
                  <video controls className="w-full h-[320px] object-cover">
                    <source src={mediaItems[0]} />
                  </video>
                ) : (
                  <img
                    src={mediaItems[0]}
                    alt={property.title}
                    className="w-full h-[320px] object-cover"
                  />
                )}
              </div>
            )}

            {mediaItems.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaItems.slice(1).map((item) => (
                  <div key={item} className="rounded-xl overflow-hidden">
                    {isVideoUrl(item) ? (
                      <video controls className="w-full h-48 object-cover">
                        <source src={item} />
                      </video>
                    ) : (
                      <img
                        src={item}
                        alt={property.title}
                        className="w-full h-48 object-cover"
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
              {property.description}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Total Value</p>
                <p className="text-blue-900 font-semibold">
                  ₦{property.project_value.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Per Fraction</p>
                <p className="text-blue-900 font-semibold">
                  ₦{property.fraction_price.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Fractions Owned</p>
                <p className="text-blue-900 font-semibold">
                  {fractionsOwned}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Bedrooms</p>
                <p className="text-blue-900 font-semibold">{property.bedrooms}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Bathrooms</p>
                <p className="text-blue-900 font-semibold">{property.bathrooms}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Area</p>
                <p className="text-blue-900 font-semibold">{property.area_sqft} sqft</p>
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
                  ₦{investment.initial_value.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Current Value</p>
                <p className="text-blue-900 font-semibold">
                  ₦{investment.current_value.toLocaleString()}
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
                  ₦{investment.growth_amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestmentDetails;