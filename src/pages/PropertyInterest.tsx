import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiProperty } from "../types/property";
import { api } from "../api/axios";
import PropertySummaryCard from "../components/PropertySummaryCard";
import InterestForm from "../components/InterestForm";
import Navbar from "../components/Navbar";

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Loading property…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
        ]}
      />

      <main className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="label-caps text-premium-gold mb-4 block">Institutional Inquiry</span>
          <h1 className="font-display text-4xl sm:text-5xl text-on-surface mb-2">
            Expression of Interest
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Secure your allocation for {property.title}. This formal submission initiates the
            verification process with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <InterestForm property={property} />
          </div>

          {/* Summary sidebar */}
          <aside className="lg:col-span-4 order-1 lg:order-2">
            <PropertySummaryCard property={property} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PropertyInterest;
