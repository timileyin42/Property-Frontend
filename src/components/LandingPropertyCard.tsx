import { ApiProperty } from "../types/property";
import { CiLocationOn } from "react-icons/ci";
import { isVideoUrl, usePresignedUrl } from "../util/normalizeMediaUrl";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface LandingPropertyCardProps {
  property: ApiProperty;
}

const LandingPropertyCard: React.FC<LandingPropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();

  const primaryMediaKey = useMemo(() => {
    const mediaFiles = property.media_files ?? [];
    const mediaFromFiles = mediaFiles
      .map((item) => item.url ?? item.file_url ?? item.secure_url)
      .filter(Boolean) as string[];

    return (
      property.primary_image ||
      property.image_urls?.[0] ||
      property.image_url ||
      property.media_urls?.[0] ||
      mediaFromFiles[0] ||
      ""
    );
  }, [property]);

  const resolvedUrl = usePresignedUrl(primaryMediaKey);
  const imageUrl = resolvedUrl && !isVideoUrl(resolvedUrl) ? resolvedUrl : "";
  const videoUrl = resolvedUrl && isVideoUrl(resolvedUrl) ? resolvedUrl : "";

  const totalFractions = property.total_fractions ?? 0;
  const fractionsSold = property.fractions_sold ?? 0;
  const isSoldOut = totalFractions > 0 && fractionsSold >= totalFractions;
  const fundingPct =
    totalFractions > 0 ? Math.round((fractionsSold / totalFractions) * 100) : 0;
  const projectValue =
    typeof property.project_value === "number" ? property.project_value : null;
  const fractionPrice =
    typeof property.fraction_price === "number" ? property.fraction_price : null;

  return (
    <button
      type="button"
      onClick={() => navigate(`/properties/${property.id}`)}
      className="group glass-panel glass-panel-hover rounded-xl overflow-hidden h-full text-left flex flex-col w-full cursor-pointer"
    >
      {/* Media */}
      <div className="relative h-56 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        ) : videoUrl ? (
          <video
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={videoUrl}
            muted
            playsInline
            loop
            autoPlay
          />
        ) : (
          <div className="w-full h-full bg-surface-high flex items-center justify-center text-xs text-on-surface-variant">
            Image unavailable
          </div>
        )}

        {/* Category / status tag */}
        <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded label-caps text-[10px] text-on-surface">
          {isSoldOut ? "Sold Out" : "Available"}
        </span>
        <span className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full data-stat text-success-emerald text-xs">
          {property.expected_roi}% ROI
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3 mb-4">
          <h3 className="font-display text-xl text-white leading-snug line-clamp-2">
            {property.title}
          </h3>
        </div>

        <div className="flex gap-1.5 items-center text-on-surface-variant mb-4">
          <CiLocationOn className="shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-[rgba(248,246,241,0.12)] mb-5">
          <div>
            <p className="label-caps text-[10px] text-on-surface-variant mb-1">Asset Value</p>
            <p className="data-stat text-white text-sm">
              {projectValue !== null ? `₦${projectValue.toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="label-caps text-[10px] text-on-surface-variant mb-1">Per Fraction</p>
            <p className="data-stat text-white text-sm">
              {fractionPrice !== null ? `₦${fractionPrice.toLocaleString()}` : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex justify-between label-caps text-[11px]">
            <span className="text-on-surface-variant">Funding Progress</span>
            <span className="text-white">{fundingPct}%</span>
          </div>
          <div className="h-1 bg-surface-highest rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                fundingPct >= 90
                  ? "bg-success-emerald shadow-[0_0_12px_rgba(26,122,94,0.6)]"
                  : "bg-premium-gold"
              }`}
              style={{ width: `${fundingPct}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
};

export default LandingPropertyCard;
