import { ApiProperty } from "../types/property";
import { isVideoUrl, normalizeMediaUrl } from "../util/normalizeMediaUrl";


interface Props {
  property: ApiProperty;
}

const PropertySummaryCard: React.FC<Props> = ({ property }) => {
  const mediaUrls = [
    property.primary_image,
    ...(property.image_urls ?? []),
  ]
    .map((url) => normalizeMediaUrl(url))
    .filter(Boolean) as string[];

  const imageUrl = mediaUrls.find((url) => !isVideoUrl(url));
  const videoUrl = mediaUrls.find((url) => isVideoUrl(url));
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

      <h2 className="font-semibold text-lg">{property.title}</h2>
      <p className="text-sm text-gray-500">{property.location}</p>

      <div className="grid grid-cols-2 gap-2  text-sm">
        <div className="bg-gray-50 p-2 rounded-xl">
          <p>Total Price</p>
          <p className="font-semibold">
            ₦{property.project_value.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-2">
          <p>Per Fraction</p>
          <p className="font-semibold">
            ₦
            {Math.floor(
              property.project_value / property.total_fractions
            ).toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-2">
          <p>Available</p>
          <p className="font-semibold">
            {property.fractions_available} fractions
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
