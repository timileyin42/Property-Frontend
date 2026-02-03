// components/InterestCard.tsx
import { StatusBadge } from "../StatusBadge";
import { InterestActions } from "./InterestActions";
import { InvestorInterest } from "../../types/investment";


interface Props {
  interest: InvestorInterest;
  // onUpdate: React.Dispatch<
  //   React.SetStateAction<InvestorInterest[]>
  // >;
}
export const InterestCard: React.FC<Props> = ({ interest}: Props) =>{


return(
  <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold">{interest.name}</h4>
      <InterestActions interest={interest} />
    </div>



    <div className="text-sm">
      <p>{interest.email}</p>
      <p className="text-gray-500">{interest.phone}</p>
    </div>

    <div className="flex justify-between items-center">
      <span>Fractions: {"interest.fractions"}</span>
      <StatusBadge status={interest.status} />
    </div>
  </div>
)};
