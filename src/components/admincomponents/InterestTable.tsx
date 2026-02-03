// components/InterestTable.tsx
import { InvestorInterest } from "../../types/investment";
import { InterestRow } from "./InterestRow";


interface Props {
  data: InvestorInterest[];
  // onUpdate: React.Dispatch<
  //   React.SetStateAction<InvestorInterest[]>
  // >;
}

export const InterestTable = ({ data}: Props) => (
  <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">

    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="p-4 text-left">Name</th>
          <th className="text-left">Contact</th>
          <th className="text-left">Property</th>
          <th className="text-left">Fractions</th>
          <th className="text-left">Date</th>
          <th className="text-left">Status</th>
          <th />
        </tr>
      </thead>

      <tbody>
        {data.map((interest) => (
          <InterestRow key={interest.id} interest={interest} />
        ))}
      </tbody>
    </table>
  </div>
);
