import { ApiProperty } from "../types/property";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { isVideoUrl, usePresignedUrl } from "../util/normalizeMediaUrl";
import { useMemo } from "react";


interface PropertyCardProps {
  property: ApiProperty;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {

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
  const fractionsAvailable =
    property.fractions_available ?? Math.max(totalFractions - fractionsSold, 0);
  const isSoldOut = totalFractions > 0 && fractionsSold >= totalFractions;
  const fractionProgress =
    totalFractions > 0 ? Math.min(100, (fractionsSold / totalFractions) * 100) : 0;
  const projectValue =
    typeof property.project_value === "number" ? property.project_value : null;
  const pricePerFraction =
    typeof property.fraction_price === "number"
      ? property.fraction_price
      : projectValue !== null && totalFractions > 0
        ? Math.floor(projectValue / totalFractions)
        : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      
      {/* Image */}
      <div
        className="relative cursor-pointer"
        onClick={() => navigate(`/properties/${property.id}`)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-48 object-cover"
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

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-blue-900">
          {property.title}
        </h3>

        <div className="flex gap-1 items-center">
          <CiLocationOn />
          <span className="text-sm text-gray-500">
            {property.location}
          </span>
        </div>

        <hr />

        {/* Pricing */}
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Total Value</span>
            <span className="font-semibold">
              {projectValue !== null
                ? `₦${projectValue.toLocaleString()}`
                : "N/A"}
            </span>
          </div>

          {property.is_fractional && (
            <div className="flex justify-between">
              <span>Per Fraction</span>
              <span className="font-semibold">
                {pricePerFraction !== null
                  ? `₦${pricePerFraction.toLocaleString()}`
                  : "N/A"}
              </span>
            </div>
          )}
        </div>

        {/* Fraction Progress */}
        {property.is_fractional && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Fractions Sold</span>
              <span>
                {fractionsSold}/{totalFractions}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Fractions Available</span>
              <span>{fractionsAvailable}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${fractionProgress}%` }}
              />
            </div>
          </div>
        )}

       <button
  onClick={() => navigate(`/properties/${property.id}/interest`)}
  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 disabled:opacity-60 disabled:cursor-not-allowed"
  disabled={isSoldOut}
>
  {isSoldOut ? "Sold Out" : "Express Interest"}
</button>
      </div>
    </div>
  );
};

export default PropertyCard;




// import { Property } from "@/types/property";
// import { CiLocationOn } from "react-icons/ci";
// import React, { useState, useEffect } from 'react';
// import {api} from '../api/axios'

// interface PropertyCardProps {
//   property: Property;
// }

// // : React.FC<PropertyCardProps>
// const PropertyCard = ({ property }) => {
//   const [progress, setProgress] = useState(0);
//   const [property_data, setProperty_data] = useState();

//   useEffect(() => {
//     // This represents your backend connection (Polling, SSE, or WebSocket)
//     const interval = async () => {
//       try {
//         const response = await api.get('/properties');
//         console.log(api);
//         const data = await response.data;
//         setProperty_data(data);
        
//         // Ensure the value stays between 0 and 100
//         setProgress(Math.min(0, 100));

// ;

//       } catch (error) {
//         console.error("Error fetching progress:", error);
//       }
//     }// Polling every 1 second
//     interval()
//     // return () => clearInterval(interval);
//   }, []);
// console.log(property_data);
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      
//       {/* Image */}
//       <div className="relative">
//         <img
//           src={property.img}
//           alt={property.title}
//           className="w-full h-48 object-cover"
//         />

//         {/* ROI Badge */}
//         <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
//           {property.roi}% ROI
//         </span>
//       </div>

//       {/* Content */}
//       <div className="p-4 flex flex-col gap-3">
//         <h3 className="font-semibold text-blue-900">
//           {property.title}
//         </h3>

//         <div className="flex gap-1 items-center ">
//           <span>
//             <CiLocationOn/>
//           </span>
//           <span className="text-sm text-gray-500">{property.location}</span>
//         </div>
//         {/*available rooms and bathrooms divs*/}
//         <div className="flex items-center gap-2">
//           <div className="flex items-center justify-center  gap-2">
//             <span>{property.bed_icon}</span>
//             <span className="">{property.beds} beds</span>
//           </div>
         
//           <div className="flex items-center justify-center  gap-2">
//             <span>{property.bath_icon}</span>
//             <span className="">{property.baths} Baths</span>
//           </div>
          
//           <div className="flex items-center justify-center  gap-1">
//             <span>{property.squarefoot}</span>
//             <span className="">{property.squarefeet}sqft</span>
//           </div>
//         </div>
//         <hr className="text-gray-300" />
//         {/* Pricing */}
//         <div className="text-sm space-y-1">
//           <div className="flex items-center justify-between">
//             <span className="font-medium">Total Value:</span>
//             <p className="text-blue-900 text-xl">
//               {" "}
//             ₦{property.project_value.toLocaleString()}
//             </p>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="font-medium">Per Fraction:</span>
//             <p className="text-blue-900 text-xl">
//               {" "}
//             ₦{property.fraction_price == null ? "property_fraction" : property.fraction_price.toLocaleString()}
//             </p>
//           </div>
           
          
//         </div>

//         {/* Footer */}
//         <div className=" flex gap-4 flex-col items-center justify-between w-full">
//           <div className="w-full ">
//             {/*begining*/}
//             <div className="flex items-center justify-between">
//             <span className="text-sm">Fraction Sold</span>
//             <p className=" text-lg text-blue-900 text-sm">
//               {" "}
//               45/100
//             </p>
//           </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
//   <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
// </div>
//             {/*end*/}
//           </div>

//           <button className=" font-medium rounded-md text-blue-600 cursor-pointer hover: bg-blue-900 w-full py-3 text-white font-inter">
//             Express Interest
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;

