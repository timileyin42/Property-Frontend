
// import {ShieldIcon, TrendUpIcon, UsersIcon} from "../components/svgs/ShieldIcon"

import UploadProperties from "../../components/admincomponents/UploadProperties";

// import {PropertyTable} from "../../components/PropertyTable";


export interface PortfolioStat {
  id: number;
  title: string;
  value: string | number;
  description: string;
}

const Interest = () => {
  const portfolioStats: PortfolioStat[] = [
    {
      id: 1,
      title: "Total Investment",
      value: "₦96,100,000",
      description: "+12.3% this month",
    },
    {
      id: 2,
      title: "Fractional Investment",
      value: "45",
      description:
        "Across 3 properties",
    },
    {
      id: 3,
      title: "Properties",
      value: "3",
      description:
        "Active investments",
    },
     {
      id: 4,
      title: "Avg. Growth",
      value: "+12.0%",
      description:
        "6 month average",
    },
  ];




// graph demo data


 
  return (
    <div className="mx-auto px-4">
     
    
      <section>
        <div className="pt-6 mb-8">
          <h2 className="font-bold text-blue-900 text-3xl">
            Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Manage properties, users, and investment interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {portfolioStats.map((item, index) => {
          	const isLast = index === portfolioStats.length - 1;


          	return (

            <div
              key={item.id}
              className="border border-gray-200 bg-white shadow-lg rounded-xl"
            >
              <div className="p-8 flex flex-col gap-4">
              

                <h3 className="text-gray-400">
                  {item.title}
                </h3>

                <p className={`text-2xl font-semibold ${isLast ? "text-green-600" : "text-blue-900"}`}>
            {item.value}
          </p>

                <p className="text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          )})}
        </div>
      </section>
        {/* ===== GRAPH SECTION (Placeholder) ===== */}
      <section className="my-12 border border-gray-300 p-6 rounded-xl">


          <UploadProperties />
      </section>

      {/* ===== AVAILABLE PROPERTIES / STATS ===== */}

      
    </div>
  );
};

export default Interest;
