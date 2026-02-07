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
  return (

    <div className="bg-white rounded-xl border border-gray-200 shadow shadow-lg p-4 space-y-4">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={property.title}
          className="rounded-md h-48 w-full object-cover"
        />
      ) : videoUrl ? (
        <video
          className="rounded-md h-48 w-full object-cover"
          src={videoUrl}
          muted
          playsInline
          loop
          autoPlay
        />
      ) : (
        <div className="rounded-md h-48 w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
          Image unavailable
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-lg">{property.title}</h2>
        {isSoldOut && (
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
            Sold
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">{property.location}</p>

      <div className="grid grid-cols-2 gap-2  text-sm">
        <div className="bg-gray-50 p-2 rounded-xl">
          <p>Total Price</p>
          <p className="font-semibold">
            {projectValue !== null
              ? `₦${projectValue.toLocaleString()}`
              : "N/A"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-2">
          <p>Per Fraction</p>
          <p className="font-semibold">
            {pricePerFraction !== null
              ? `₦${pricePerFraction.toLocaleString()}`
              : "N/A"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-2">
          <p>Fractions Available</p>
          <p className="font-semibold">
            {fractionsAvailable} fractions
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-2">
          <p>Fractions Sold</p>
          <p className="font-semibold">
            {fractionsSold}/{totalFractions}
          </p>
        </div>

        <div className={`p-2 rounded-xl ${property.expected_roi > 12 ? "bg-green-50" : "bg-gray-50 "}`}>
          <p>Expected ROI</p>
          <p className="font-semibold">{property.expected_roi}%</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="investment_benefits text-blue-900 font-semibold">Investment Benefits:</h1>
        <ul className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-1"> 
            <span className="w-1 h-1 border rounded-full bg-blue-900"></span>
            <li>Monthly rental income distribution</li>
          </div>
          <div className="flex flex-row items-center gap-2"> 
            <span className="w-1 h-1 border rounded-full bg-blue-900"></span>
            <li>Capital appreciation potential</li>
          </div>
          <div className="flex flex-row items-center gap-2"> 
            <span className="w-1 h-1 border rounded-full bg-blue-900"></span>
            <li>Fully managed property</li>
          </div>
           <div className="flex flex-row items-center gap-2"> 
            <span className="w-1 h-1 border rounded-full bg-blue-900"></span>
            <li>Transparent reporting dashboard</li>
          </div>
          
        </ul>
      </div>
    </div>
  );
};

export default PropertySummaryCard;
