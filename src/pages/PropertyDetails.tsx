import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api/axios";
import { ApiProperty } from "../types/property";
import { useAuth } from "../context/AuthContext";
import { CiLocationOn } from "react-icons/ci";
import { isVideoUrl, usePresignedUrls } from "../util/normalizeMediaUrl";
import toast, { Toaster } from "react-hot-toast";
import type { WishlistListResponse } from "../types/userProfile";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistId, setWishlistId] = useState<number | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!id) return;

    api
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((error) => console.error("Failed to fetch property:", error))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    const fetchWishlist = async () => {
      try {
        const res = await api.get<WishlistListResponse>("/user/wishlist");
        const match = res.data.items.find(
          (item) => item.property_id === Number(id)
        );
        setWishlistId(match?.id ?? null);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, [id, isAuthenticated]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!property || wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (wishlistId) {
        await api.delete(`/user/wishlist/${wishlistId}`);
        setWishlistId(null);
        toast.success("Removed from wishlist");
      } else {
        const res = await api.post("/user/wishlist", {
          property_id: property.id,
          notify_on_update: true,
          notify_on_price_change: true,
        });
        setWishlistId(res.data.id);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  const mediaItems = usePresignedUrls(
    useMemo(() => {
      if (!property) return [] as string[];
      const mediaFiles = property.media_files ?? [];
      const mediaFromFiles = mediaFiles
        .map((item) => item.url ?? item.file_url ?? item.secure_url)
        .filter(Boolean) as string[];

      return [
        property.primary_image,
        ...(property.image_urls ?? []),
        ...(property.media_urls ?? []),
        ...(property.image_url ? [property.image_url] : []),
        ...mediaFromFiles,
      ].filter(Boolean) as string[];
    }, [property])
  );

  const ctaLabel = user?.role === "INVESTOR" ? "Invest" : "Express Interest";
  const hasInvested = Boolean((location.state as { hasInvested?: boolean } | null)?.hasInvested);
  const totalFractions = property?.total_fractions ?? 0;
  const fractionsSold = property?.fractions_sold ?? 0;
  const fractionsAvailable =
    property?.fractions_available ?? Math.max(totalFractions - fractionsSold, 0);
  const isSoldOut = totalFractions > 0 && fractionsSold >= totalFractions;

  if (loading) {
    return <p className="text-center py-10">Loading property...</p>;
  }

  if (!property) {
    return <p className="text-center py-10">Property not found.</p>;
  }

  return (
    <div className="mx-auto px-4 my-16">
      <Toaster position="top-right" />
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
          {isSoldOut && (
            <span className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full">
              Sold
            </span>
          )}
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
                  {property.project_value !== null && property.project_value !== undefined
                    ? `₦${property.project_value.toLocaleString()}`
                    : "-"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Per Fraction</p>
                <p className="text-blue-900 font-semibold">
                  {property.fraction_price !== null && property.fraction_price !== undefined
                    ? `₦${property.fraction_price.toLocaleString()}`
                    : "-"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Fractions Available</p>
                <p className="text-blue-900 font-semibold">
                  {fractionsAvailable}/{totalFractions || "-"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Fractions Sold</p>
                <p className="text-blue-900 font-semibold">
                  {fractionsSold}/{totalFractions || "-"}
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

            {!hasInvested && (
              <button
                onClick={() => navigate(`/properties/${property.id}/interest`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSoldOut}
              >
                {isSoldOut ? "Sold Out" : ctaLabel}
              </button>
            )}
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md py-3 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {wishlistLoading
                ? "Updating..."
                : wishlistId
                  ? "Saved to Wishlist"
                  : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
