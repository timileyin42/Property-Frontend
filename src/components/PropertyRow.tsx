// components/PropertyRow.tsx
import {ApiProperty } from "../types/property";
import { StatusBadge } from "./StatusBadge";
import { PropertyActions } from "./PropertyActions";


// type PropertyStatus = "ACTIVE" | "SOLD" | "PENDING" | "ARCHIVED" | "DRAFT";
interface PropertyRowProps {
  property: ApiProperty;
}





export const PropertyRow = ({ property }: PropertyRowProps) => {
  console.log(property);
  return (
    <tr className="">
      <td className="py-3 font-medium ">{property.title}</td>
      <td className="text-gray-400">{property.location}</td>
      <td className="text-gray-400">₦{property.project_value.toLocaleString()}</td>
      <td className="text-gray-400">{property.total_fractions}</td>
      <td className="text-gray-400">{
        
      property.created_at 
  ? new Date(property.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  : 'N/A'


      }</td>
      {/*<td className="text-gray-400">{new Date(property.created_at).toLocaleDateString()}</td>*/}
      <td className="text-gray-400">
        <StatusBadge status={property.status} />
      </td>
      <td className="text-gray-400">
        <PropertyActions
          onView={() => console.log("View", property.status)}
          onEdit={() => console.log("Edit", property.id)}
        />
      </td>
    </tr>
  );
};
