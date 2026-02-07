
import { ApiProperty } from "../types/property";
import { CiLocationOn } from "react-icons/ci";
import { isVideoUrl, usePresignedUrl } from "../util/normalizeMediaUrl";
import { useMemo } from "react";
// import { Link} from "react-router-dom";

interface LandingPropertyCardProps {
  property: ApiProperty;
}

const LandingPropertyCard: React.FC<LandingPropertyCardProps> = ({ property }) => {
  // const pricePerFraction = 
  //   property.fraction_price ?? 
  //   Math.floor(property.project_value / property.total_fractions);

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
  const projectValue =
    typeof property.project_value === "number" ? property.project_value : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden h-full">
      {/* Optimized Image */}
      <div className="relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-48 object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : videoUrl ? (
          <video
            className="w-full h-48 object-cover"
            src={videoUrl}
            muted
            playsInline
            loop
            autoPlay
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
            Image unavailable
          </div>
        )}
        {isSoldOut && (
          <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full">
            Sold
          </span>
        )}
        <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
          {property.expected_roi}% ROI
        </span>
      </div>

      {/* Simplified Content */}
      <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
        <h3 className="font-semibold text-blue-900 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex gap-1 items-center mt-2">
          <CiLocationOn className="text-gray-400" />
          <span className="text-base text-gray-500 truncate">
            {property.location}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total Value</span>
            <span className="font-semibold text-sm">
              {projectValue !== null
                ? `₦${projectValue.toLocaleString()}`
                : "N/A"}
            </span>
            
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default LandingPropertyCard;
