import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { formatDate } from "../../util/formatDate";
import { isVideoUrl, usePresignedUrl } from "../../util/normalizeMediaUrl";
import type { WishlistItem, WishlistListResponse } from "../../types/userProfile";
import type { ApiProperty } from "../../types/property";

const getWishlistItems = (data: unknown): WishlistItem[] => {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items =
    record.items ?? record.data ?? record.wishlist ?? record.wishlists;
  return Array.isArray(items) ? (items as WishlistItem[]) : [];
};

interface SavedPropertyCardProps {
  item: WishlistItem;
  details?: ApiProperty;
  onToggleNotify: (item: WishlistItem) => void;
  onRemove: (item: WishlistItem) => void;
  onNavigate: (path: string) => void;
}

const SavedPropertyCard: React.FC<SavedPropertyCardProps> = ({
  item,
  details,
  onToggleNotify,
  onRemove,
  onNavigate,
}) => {
  const imageUrl = usePresignedUrl(item.property_image);
  const videoUrl = usePresignedUrl(item.property_video);
  const mediaUrl = imageUrl || videoUrl;
  const mediaIsVideo = mediaUrl ? isVideoUrl(mediaUrl) : false;
  const totalValue = details?.project_value;
  const fractionPrice = details?.fraction_price;
  const availableFractions =
    details && details.total_fractions
      ? `${details.fractions_available}/${details.total_fractions}`
      : null;
  const expectedRoi = details?.expected_roi;

  return (
    <div className="glass-panel glass-panel-hover rounded-xl overflow-hidden">
      <div
        className="relative h-[192px] cursor-pointer group overflow-hidden"
        onClick={() =>
          item.property_id ? onNavigate(`/properties/${item.property_id}/interest`) : null
        }
      >
        {mediaUrl ? (
          mediaIsVideo ? (
            <video className="h-full w-full object-cover" src={mediaUrl} muted playsInline loop autoPlay />
          ) : (
            <img
              src={mediaUrl}
              alt={item.property_title ?? "Saved property"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="h-full w-full bg-surface-high flex items-center justify-center text-on-surface-variant text-xs">
            Image unavailable
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleNotify(item);
          }}
          className="absolute top-3 right-3 glass-panel h-9 w-9 rounded-full flex items-center justify-center hover:border-premium-gold transition-colors"
          title={item.notify_on_update ? "Disable updates" : "Enable updates"}
        >
          <span
            className="material-symbols-outlined text-[18px] text-premium-gold"
            style={{ fontVariationSettings: item.notify_on_update ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="p-5">
        <h4
          className="font-display text-xl text-on-surface cursor-pointer hover:text-premium-gold transition-colors"
          onClick={() => (item.property_id ? onNavigate(`/properties/${item.property_id}`) : null)}
        >
          {item.property_title ?? "Saved Property"}
        </h4>
        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm mt-1">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span>{item.property_location ?? "Location unavailable"}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 py-4 border-y border-[rgba(248,246,241,0.12)]">
          <div>
            <p className="label-caps text-[10px] text-on-surface-variant mb-1">Total Price</p>
            <p className="data-stat text-sm text-on-surface">
              {Number.isFinite(totalValue) ? `₦${Number(totalValue).toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="label-caps text-[10px] text-on-surface-variant mb-1">Per Fraction</p>
            <p className="data-stat text-sm text-on-surface">
              {Number.isFinite(fractionPrice) ? `₦${Number(fractionPrice).toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="label-caps text-[10px] text-on-surface-variant mb-1">Available</p>
            <p className="data-stat text-sm text-on-surface">{availableFractions ?? "N/A"}</p>
          </div>
          <div>
            <p className="label-caps text-[10px] text-on-surface-variant mb-1">Expected ROI</p>
            <p className="data-stat text-sm text-success-emerald">
              {Number.isFinite(expectedRoi) ? `${expectedRoi}%` : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() =>
              item.property_id ? onNavigate(`/properties/${item.property_id}/interest`) : null
            }
            className="btn-gold flex-1 py-2.5 text-[11px]"
          >
            Express Interest
          </button>
          <button
            type="button"
            onClick={() => (item.property_id ? onNavigate(`/properties/${item.property_id}`) : null)}
            className="btn-ghost flex-1 py-2.5 label-caps text-on-surface"
          >
            View Details
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <p className="text-on-surface-variant">{`Saved on ${formatDate(item.created_at)}`}</p>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="text-error hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const SavedPropertiesTab: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyDetails, setPropertyDetails] = useState<
    Record<number, ApiProperty>
  >({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get<WishlistListResponse>("/user/wishlist");
        const wishlistItems = getWishlistItems(res.data);
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
    <div className="glass-panel rounded-xl p-6">
      <div>
        <h3 className="font-display text-2xl text-on-surface">Saved Properties</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          Properties you&apos;re interested in
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isLoading ? (
          <p className="text-on-surface-variant text-sm">Loading saved properties...</p>
        ) : items.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No saved properties yet.</p>
        ) : (
          items.map((property) => (
            <SavedPropertyCard
              key={property.id}
              item={property}
              details={propertyDetails[property.property_id]}
              onToggleNotify={handleToggleNotify}
              onRemove={handleRemove}
              onNavigate={navigate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesTab;
