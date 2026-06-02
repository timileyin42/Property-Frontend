import { ApiProperty } from "../types/property";
import { isVideoUrl, usePresignedUrl } from "../util/normalizeMediaUrl";
import { useMemo } from "react";


interface Props {
  property: ApiProperty;
}

const PropertySummaryCard: React.FC<Props> = ({ property }) => {
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
  const fractionsAvailable =
    property.fractions_available ?? Math.max(totalFractions - fractionsSold, 0);
  const isSoldOut = totalFractions > 0 && fractionsSold >= totalFractions;
  const projectValue =
    typeof property.project_value === "number" ? property.project_value : null;
  const pricePerFraction =
    typeof property.fraction_price === "number"
      ? property.fraction_price
      : projectValue !== null && totalFractions > 0
        ? Math.floor(projectValue / totalFractions)
        : null;
  const fundingPct =
    totalFractions > 0 ? Math.round((fractionsSold / totalFractions) * 100) : 0;

  return (
    <div className="space-y-6 lg:sticky lg:top-28">
      <div className="glass-panel overflow-hidden rounded shadow-xl group">
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : videoUrl ? (
            <video
              className="w-full h-full object-cover"
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
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="label-caps text-[10px] bg-success-emerald text-on-secondary px-2 py-1 rounded-sm mb-2 inline-block">
              {isSoldOut ? "Sold Out" : "Off-Plan Exclusive"}
            </span>
            <h3 className="font-display text-xl text-white">{property.title}</h3>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="label-caps text-[10px] text-on-surface-variant block mb-1">Expected ROI</span>
              <span className="data-stat text-success-emerald">{property.expected_roi}%</span>
            </div>
            <div>
              <span className="label-caps text-[10px] text-on-surface-variant block mb-1">Asset Value</span>
              <span className="data-stat text-on-surface text-sm">
                {projectValue !== null ? `₦${projectValue.toLocaleString()}` : "N/A"}
              </span>
            </div>
            <div>
              <span className="label-caps text-[10px] text-on-surface-variant block mb-1">Per Fraction</span>
              <span className="data-stat text-on-surface text-sm">
                {pricePerFraction !== null ? `₦${pricePerFraction.toLocaleString()}` : "N/A"}
              </span>
            </div>
            <div>
              <span className="label-caps text-[10px] text-on-surface-variant block mb-1">Funded</span>
              <span className="data-stat text-premium-gold">{fundingPct}%</span>
            </div>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="bg-premium-gold h-full" style={{ width: `${fundingPct}%` }} />
          </div>
          <div className="border-t border-[rgba(248,246,241,0.15)] pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="material-symbols-outlined text-premium-gold text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="label-caps text-[10px] text-on-surface-variant">
                {fractionsAvailable} of {totalFractions} fractions available
              </span>
            </div>
            <ul className="text-xs text-on-surface-variant/80 space-y-1 mt-3">
              <li>• Monthly rental income distribution</li>
              <li>• Capital appreciation potential</li>
              <li>• Fully managed property</li>
              <li>• Transparent reporting dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust badge */}
      <div className="p-6 bg-surface-low border border-[rgba(248,246,241,0.15)] rounded flex items-center gap-4">
        <span className="material-symbols-outlined text-premium-gold text-4xl">security</span>
        <div>
          <h4 className="label-caps text-on-surface">Investor Security</h4>
          <p className="text-xs text-on-surface-variant">
            Escrow-backed transactions and regulated oversight on all asset listings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertySummaryCard;
