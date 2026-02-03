import PropertyCard from "./PropertyCard";
import { ApiProperty } from "../types/property";

interface AvailablePropertiesProps {
  properties: ApiProperty[];
}

const AvailableProperties: React.FC<AvailablePropertiesProps> = ({
  properties,
}) => {
  return (
    <section className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};

export default AvailableProperties;
