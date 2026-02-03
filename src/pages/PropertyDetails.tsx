import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api/axios";
import { ApiProperty } from "../types/property";
import { useAuth } from "../context/AuthContext";
import { CiLocationOn } from "react-icons/ci";
import { isVideoUrl, normalizeMediaUrl } from "../util/normalizeMediaUrl";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!id) return;

    api
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((error) => console.error("Failed to fetch property:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const mediaItems = useMemo(() => {
    if (!property) return [];

    const urls = [property.primary_image, ...(property.image_urls ?? [])]
      .map((url) => normalizeMediaUrl(url))
      .filter(Boolean);

    return Array.from(new Set(urls));
  }, [property]);

  const ctaLabel = user?.role === "INVESTOR" ? "Invest" : "Express Interest";

  if (loading) {
    return <p className="text-center py-10">Loading property...</p>;
  }

  if (!property) {
    return <p className="text-center py-10">Property not found.</p>;
  }

  return (
    <div className="mx-auto px-4 my-16">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Partnership", href: "/partnership" },
        ]}
      />

      <div className="pt-6 mb-8">
        <h2 className="font-inter font-bold text-blue-900 text-[clamp(1.25rem,4vw,2rem)]">
          {property.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mt-2">
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
                <p className="text-gray-500">Available Fractions</p>
                <p className="text-blue-900 font-semibold">
                  {property.fractions_available}/{property.total_fractions}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Bedrooms</p>
                <p className="text-blue-900 font-semibold">
                  {property.bedrooms}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Bathrooms</p>
                <p className="text-blue-900 font-semibold">
                  {property.bathrooms}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Area</p>
                <p className="text-blue-900 font-semibold">
                  {property.area_sqft} sqft
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-blue-900 font-semibold text-lg">
              Ready to proceed?
            </h3>
            <p className="text-gray-500 text-sm">
              {isAuthenticated
                ? "Continue your investment journey."
                : "Sign in to complete your interest form."}
            </p>

            <button
              onClick={() => navigate(`/properties/${property.id}/interest`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-sm font-medium"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
