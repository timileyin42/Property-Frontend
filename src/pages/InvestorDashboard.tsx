
import Navbar from "../components/Navbar";
// import { LuLogOut } from "react-icons/lu";
// import type { PortfolioStat } from "../types/dashboard";
// import {ShieldIcon, TrendUpIcon, UsersIcon} from "../components/svgs/ShieldIcon"
// import AvailableProperties from "./investorsData/AvailableProperties";
// import { CiLocationOn} from "react-icons/ci";
// import img1 from "../assets/img1.jpg";
// import img2 from "../assets/img2.jpg";
// import img3 from "../assets/img3.jpg";
import LineChart from "../components/charts/LineChart"
import toast, { Toaster } from "react-hot-toast";
import {useAuth} from "../context/AuthContext"
import {useState, useEffect} from "react";
import {fetchProperties} from "../api/properties"
import {ApiProperty} from "../types/property"
import AvailableProperties from "../components/AvailableProperties"


// import { ReactNode } from "react";

export interface PortfolioStat {
  id: number;
  title: string;
  value: string | number;
  description: string;
}

const InvestorDashboard = () => {
  const {user} = useAuth();
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  console.log(user);
// the will be later changed to properties Investors has invested in
useEffect(() => {
  // 1. Define an async function inside the effect
  toast.success(`welcome ${user?.full_name}`)

  const fetchAndSetProperties = async () => {
    try {
      const data = await fetchProperties(); 


      setProperties(data.slice(0, 3)); 
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  // 2. Execute it immediately
  fetchAndSetProperties();
}, []); 
console.log(properties);
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
// const demoProperties = [
		
// 		{
// 			id: "1",
// 			title: "Luxury Apartment Lagos", 
// 			location: "Victoria Island Lagos", 
// 			img: img1,
// 			logo_address: <CiLocationOn size={20} />,
//     	value: 38000000,
//       growth: "+12.5%" 

// 		},
//     {
//       id: "2",
//       title: "Beachfront Villa Lekki", 
//       location: "Lekki Phase 1, Lagos", 
//       img: img2,
//       logo_address: <CiLocationOn size={20} />,
//       value: 75000000,
//       growth: "+8.3%" 

//     },
//     {
//       id: "3",
//       title: "Modern Penthouse VI", 
//       location: "Victoria Island Lagos", 
//       img: img3,
//       logo_address: <CiLocationOn size={20} />,
//       value: 30000000,
//       growth: "+15.2%" 

//     },

		 
// 	]
// graph demo data

   const labels = ["Jan", "Feb", "Mar", "Apr", "May"];
  const revenue = [20000, 40000, 60000, 80000];
 
  return (
    <div className="mx-auto px-4 my-16">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          // { label: "Logout", href: "/logout", logo: <LuLogOut /> },
        ]}
      />

      <Toaster position="top-right" />
    
      <section>
        <div className="pt-6 mb-8">
          <h2 className="font-bold text-blue-900 text-3xl">
            My Portfolio
          </h2>
          <p className="text-gray-400 text-sm">
            Track your investments and property performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
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
      <section className="my-12 w-full border border-gray-300 p-6 rounded-xl">
        <h2 className="font-bold text-blue-900 text-lg mb-2">
          Portfolio Growth
        </h2>
        <div className=" rounded-xl  flex w-full text-gray-400 p-4">
                <LineChart labels={labels} data={revenue} />
        </div>
      </section>

      {/* ===== AVAILABLE PROPERTIES / STATS ===== */}

      <section>
      	<AvailableProperties properties={properties} />

      </section>
    </div>
  );
};

export default InvestorDashboard;
