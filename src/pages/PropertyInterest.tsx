import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiProperty } from "../types/property";
import { api } from "../api/axios";
import PropertySummaryCard from "../components/PropertySummaryCard";
import InterestForm from "../components/InterestForm";
import AppNavbar from "../components/AppNavbar"


const PropertyInterest = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<ApiProperty | null>(null);

  useEffect(() => {
    if (!id) return;

    api.get(`/properties/${id}`).then((res) => {
      setProperty(res.data);
    });
  }, [id]);


  if (!property) {
    return <p className="text-center py-10">Loading property...</p>;
  }

  return (
     <div className="max-w-7xl mx-auto flex flex-col ">
       <div>
         <AppNavbar
        title="Elycap Luxury Homes"
        subtitle="Express Your Interest"
        backLabel="Back to Properties"
        backTo="/properties"
      />
       </div>
       {/*<div className="flex  justify-center  mx-auto max-w-7xl w-full items-center">*/}
    <div className=" grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 px-4 mx-auto max-w-7xl w-full items-center">
      
      {/* Property Summary (fixed-ish) */}
      <div className="lg:col-span-4 xl:col-span-4 ">
        <PropertySummaryCard property={property} />
      </div>

      {/* Interest Form (wide) */}
      <div className="lg:col-span-8 xl:col-span-8 ">
        {/*<InterestForm propertyId={property.id} propertyTitle={property}  />*/}
        <InterestForm property={property} />

      </div>
    </div>
    {/*</div>*/}

  </div>
  );
};

export default PropertyInterest;
