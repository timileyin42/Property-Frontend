import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { formatDate } from "../../util/formatDate";
import { isVideoUrl, normalizeMediaUrl } from "../../util/normalizeMediaUrl";
import type { WishlistItem, WishlistListResponse } from "../../types/userProfile";
import { useNavigate } from "react-router-dom";
import type { ApiProperty } from "../../types/property";

const locationIcon = "https://www.figma.com/api/mcp/asset/ec4f3b25-a8b5-43ba-854f-de0da6b47d40";
const heartIcon = "https://www.figma.com/api/mcp/asset/2a3b6e47-cf7c-41a8-a280-2bec0aebcd5d";

const SavedPropertiesTab: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyDetails, setPropertyDetails] = useState<Record<number, ApiProperty>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get<WishlistListResponse>("/user/wishlist");
        const wishlistItems = res.data.items;
        setItems(wishlistItems);

        const propertyIds = wishlistItems
          .map((item) => item.property_id)
          .filter(Boolean);
        if (propertyIds.length > 0) {
          const results = await Promise.allSettled(
            propertyIds.map(async (propertyId) => {
              const response = await api.get(`/properties/${propertyId}`);
              return response.data as ApiProperty;
            })
          );
          setPropertyDetails((prev) => {
            const next = { ...prev };
            results.forEach((result) => {
              if (result.status === "fulfilled" && result.value?.id) {
                next[result.value.id] = result.value;
              }
            });
            return next;
          });
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleToggleNotify = async (item: WishlistItem) => {
    const nextUpdate = !item.notify_on_update;
    const nextPrice = !item.notify_on_price_change;

    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              notify_on_update: nextUpdate,
              notify_on_price_change: nextPrice,
            }
          : entry
      )
    );

    try {
      await api.patch(`/user/wishlist/${item.id}`, {
        notify_on_update: nextUpdate,
        notify_on_price_change: nextPrice,
      });
    } catch (error) {
      console.error("Failed to update notifications:", error);
      setItems((prev) =>
        prev.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                notify_on_update: item.notify_on_update,
                notify_on_price_change: item.notify_on_price_change,
              }
            : entry
        )
      );
    }
  };

  const handleRemove = async (item: WishlistItem) => {
    const previousItems = items;
    setItems((prev) => prev.filter((entry) => entry.id !== item.id));

    try {
      await api.delete(`/user/wishlist/${item.id}`);
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
      setItems(previousItems);
    }
  };

  return (
    <div className="bg-white border border-black/10 rounded-[14px] p-6">
      <div>
        <h3 className="text-[#1e3a8a] text-[20px] font-medium leading-[28px]">
          Saved Properties
        </h3>
        <p className="text-[#717182] text-[16px] leading-[24px] mt-1">
          Properties you&apos;re interested in
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isLoading ? (
          <p className="text-[#6a7282] text-[14px] leading-[20px]">
            Loading saved properties...
          </p>
        ) : items.length === 0 ? (
          <p className="text-[#6a7282] text-[14px] leading-[20px]">
            No saved properties yet.
          </p>
        ) : (
          items.map((property) => {
            const imageUrl = normalizeMediaUrl(property.property_image);
            const videoUrl = normalizeMediaUrl(property.property_video);
            const mediaUrl = imageUrl || videoUrl;
            const mediaIsVideo = mediaUrl ? isVideoUrl(mediaUrl) : false;
            const details = propertyDetails[property.property_id];
            const totalValue = details?.project_value;
            const fractionPrice = details?.fraction_price;
            const availableFractions =
              details && details.total_fractions
                ? `${details.fractions_available}/${details.total_fractions}`
                : null;
            const expectedRoi = details?.expected_roi;

            return (
              <div
                key={property.id}
                className="bg-white border border-black/10 rounded-[14px] overflow-hidden"
              >
                <div
                  className="relative h-[192px] cursor-pointer"
                  onClick={() =>
                    property.property_id
                      ? navigate(`/properties/${property.property_id}/interest`)
                      : null
                  }
                >
                  {mediaUrl ? (
                    mediaIsVideo ? (
                      <video
                        className="h-full w-full object-cover"
                        src={mediaUrl}
                        muted
                        playsInline
                        loop
                        autoPlay
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={property.property_title ?? "Saved property"}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="h-full w-full bg-[#f3f3f5] flex items-center justify-center text-[#6a7282] text-[12px]">
                      Image unavailable
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleNotify(property)}
                    className="absolute top-3 right-3 bg-white h-9 w-9 rounded-[8px] flex items-center justify-center"
                    title={
                      property.notify_on_update
                        ? "Disable updates"
                        : "Enable updates"
                    }
                  >
                    <img src={heartIcon} alt="" className="h-4 w-4" />
                  </button>
                </div>

              <div className="p-4">
                <h4
                  className="text-[#1e3a8a] text-[18px] font-semibold leading-[28px] cursor-pointer"
                  onClick={() =>
                    property.property_id
                      ? navigate(`/properties/${property.property_id}`)
                      : null
                  }
                >
                  {property.property_title ?? "Saved Property"}
                </h4>
                <div className="flex items-center gap-2 text-[#4a5565] text-[14px] leading-[20px]">
                  <img src={locationIcon} alt="" className="h-4 w-4" />
                  <span>{property.property_location ?? "Location unavailable"}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[#6a7282] text-[12px] leading-[16px]">
                      Total Price
                    </p>
                    <p className="text-[#1e3a8a] text-[16px] font-semibold leading-[24px]">
                      {Number.isFinite(totalValue)
                        ? `₦${Number(totalValue).toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6a7282] text-[12px] leading-[16px]">
                      Per Fraction
                    </p>
                    <p className="text-[#1e3a8a] text-[16px] font-semibold leading-[24px]">
                      {Number.isFinite(fractionPrice)
                        ? `₦${Number(fractionPrice).toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6a7282] text-[12px] leading-[16px]">
                      Available
                    </p>
                    <p className="text-[#364153] text-[16px] font-semibold leading-[24px]">
                      {availableFractions ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6a7282] text-[12px] leading-[16px]">
                      Expected ROI
                    </p>
                    <p className="text-[#00a63e] text-[16px] font-semibold leading-[24px]">
                      {Number.isFinite(expectedRoi)
                        ? `${Number(expectedRoi)}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="bg-[#1e3a8a] text-white rounded-[8px] h-9 flex-1 text-[14px] font-medium leading-[20px]"
                  >
                    Express Interest
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      property.property_id
                        ? navigate(`/properties/${property.property_id}`)
                        : null
                    }
                    className="bg-white border border-[#1e3a8a] text-[#1e3a8a] rounded-[8px] h-9 flex-1 text-[14px] font-medium leading-[20px]"
                  >
                    View Details
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[12px] leading-[16px]">
                  <p className="text-[#6a7282]">
                    {`Saved on ${formatDate(property.created_at)}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(property)}
                    className="text-[#1e3a8a] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesTab;
