// components/PropertyTable.tsx
// import { useEffect, useState } from "react";
import { ApiProperty } from "../types/property";
// import { fetchProperties } from "../api/properties";
import { PropertyRow } from "./PropertyRow";

interface Props {
  properties: ApiProperty[];
  loading: boolean;
}
export const PropertyTable = ({ properties, loading }: Props) => {
  // const [properties, setProperties] = useState<Property[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchProperties()
  //     .then(setProperties)
  //     .finally(() => setLoading(false));
  // }, []);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border-gray-300 p-6 rounded-x mt-6">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-4">Property Name</th>
            <th className="text-left">Location</th>
            <th className="text-left">Total Value</th>
            <th className="text-left">Fractions</th>
            <th className="text-left">Date</th>
            <th className="text-left">Status</th>
            <th className="text-left">Action</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {properties.map((property) => (
            <PropertyRow key={property.id} property={property} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
