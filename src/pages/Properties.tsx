import {useState, useEffect} from "react"
import Navbar from "../components/Navbar"
// import { CiLocationOn} from "react-icons/ci";
// import { LuBed } from "react-icons/lu";
// import { TbBath } from "react-icons/tb";
// import { FaRegSquare } from "react-icons/fa";
import AvailableProperties from "../components/AvailableProperties"
import {fetchProperties} from "../api/properties"
import {ApiProperty} from "../types/property"



function Properties(){

const [properties, setProperties] = useState<ApiProperty[]>([]);

	
 useEffect(() => {
  // 1. Define an async function inside the effect
  const fetchAndSetProperties = async () => {
    try {
      const data = await fetchProperties(); // Call your API utility
      console.log("Fetched properties:", data);
      setProperties(data); // Update your state
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  // 2. Execute it immediately
  fetchAndSetProperties();
}, []); // Empty dependency array means this runs once on mount
// console.log(properties);
	return(
		<>
			<div className="mx-auto px-4 my-16  ">
				{/*navigation bar*/}
				<Navbar 
					links={[
						{label: "Home", href: "/"},
						{label: "My Portfolio", href: "/portfolio"},
						]}

				 />

				<div className=" pt-6 mb-8 mx-auto">
					<h2 className="font-inter font-bold text-blue-900 text-[clamp(1rem,4vw,1.55rem)]">Available Properties</h2>
								<p className="text-gray-400 text-sm">Explore fractional investment opportunities in premium real estate</p>
				</div>
				<section>
					<div className="">
						<AvailableProperties properties={properties} />
						
					</div>
					
				</section>
			</div>
		</>
		)
}

export default Properties;




// import {react, useState, useEffect} from "react"
// import Navbar from "../components/Navbar"
// import { CiLocationOn} from "react-icons/ci";
// import { LuBed } from "react-icons/lu";
// import { TbBath } from "react-icons/tb";
// import { FaRegSquare } from "react-icons/fa";
// import AvailableProperties from "../components/AvailableProperties"
// import img1 from "../assets/img1.jpg";
// import img2 from "../assets/img2.jpg";
// import img3 from "../assets/img3.jpg";
// import img4 from "../assets/img4.jpg";
// import img5 from "../assets/img5.jpg";
// import img6 from "../assets/img6.jpg";
// import img7 from "../assets/img7.jpg";
// import {fetchProperties} from "../api/properties"
// function Properties(){
// 	 const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
     
// useEffect(() => {
//     const loadProperties = async () => {
//       const data = await fetchProperties();
//       setProperties(data);
//       setLoading(false);
//     };

//     loadProperties();
//   }, []);

// 	const demoProperties = [
		
// 		{
// 			id: "1",
// 			title: "Luxury Apartment Lagos", 
// 			location: "Victoria Island Lagos", 
// 			img: img1,
// 			beds: 3,
// 			baths: 2,
// 			squarefeet: 1850,
// 			logo_address: <CiLocationOn size={20} />,
// 			bed_icon: <LuBed size={20} />,
// 			bath_icon: <TbBath size={20} />,
// 			squarefoot: <FaRegSquare size={20} />,
// 			roi: 12,
//     		project_value: 232500000,
//     		pricePerFraction:  2325000,
//     		fractionsSold: 4300,

// 		},

// 		{
// 			id: "2",
// 			title: "Beachfront Villa Lekki", 
// 			location: "Lekki Phase 1, Lagos", 
// 			img: img2,
// 			beds: 5,
// 			baths: 4,
// 			squarefeet: 3200,
// 			logo_address: <CiLocationOn size={20} />,
// 			bed_icon: <LuBed size={20} />,
// 			bath_icon: <TbBath size={20} />,
// 			squarefoot: <FaRegSquare size={20} />,
// 			roi: 15.2,
//     		project_value: 492500000,
//     		pricePerFraction:  4925000,
//     		fractionsSold: 4300,

// 		},
// 		{
// 			id: "3",
// 			title: "Modern Penthouse VI", 
// 			location: "Victoria Island, Lagos", 
// 			img: img3,
// 			beds: 4,
// 			baths: 3,
// 			squarefeet: 2800,
// 			logo_address: <CiLocationOn size={20} />,
// 			bed_icon: <LuBed size={20} />,
// 			bath_icon: <TbBath size={20} />,
// 			squarefoot: <FaRegSquare size={20} />,
// 			roi: 11.8,
//     		project_value: 434000000,
//     		pricePerFraction:440000,
//     		fractionsSold: 4300,

// 		},
// 		{
// 			id: "4",
// 			title: "Garden Estate Ikeja", 
// 			location: "GRA Ikeja, Lagos", 
// 			img: img4,
// 			beds: 4,
// 			baths: 3,
// 			squarefeet: 2800,
// 			logo_address: <CiLocationOn size={20} />,
// 			bed_icon: <LuBed size={20} />,
// 			bath_icon: <TbBath size={20} />,
// 			squarefoot: <FaRegSquare size={20} />,
// 			roi: 10.5,
//     		project_value:32500000,
//     		pricePerFraction: 2325000,
//     		fractionsSold: 4300,

// 		},
// 		{
// 			id: "5",
// 			title: "Waterfront Condo Ikoyi", 
// 			location: "Banana Island, Ikoyi", 
// 			img: img5,
// 			beds: 3,
// 			baths: 3,
// 			squarefeet: 2400,
// 			logo_address: <CiLocationOn size={20} />,
// 			bed_icon: <LuBed size={20} />,
// 			bath_icon: <TbBath size={20} />,
// 			squarefoot: <FaRegSquare size={20} />,
// 			roi: 14.2,
//     		project_value:689500000,
//     		pricePerFraction: 6895000,
//     		fractionsSold: 4300,

// 		},
// 		{
// 			id: "6",
// 			title: "Smart Home Lekki", 
// 			location: "Lekki Phase 2, Lagos", 
// 			img: img6,
// 			beds: 3,
// 			baths: 2,
// 			squarefeet: 1950,
// 			logo_address: <CiLocationOn size={20} />,
// 			bed_icon: <LuBed size={20} />,
// 			bath_icon: <TbBath size={20} />,
// 			squarefoot: <FaRegSquare size={20} />,
// 			roi: 9.8,
//     		project_value:900500000,
//     		pricePerFraction: 9500000,
//     		fractionsSold: 4300,

// 		},

// 	]
 
// 	return(
// 		<>
// 			<div className="mx-auto px-4 my-16  ">
// 				{/*navigation bar*/}
// 				<Navbar 
// 					links={[
// 						{label: "Home", href: "/"},
// 						{label: "My Portfolio", href: "/portfolio"},

// 						]}

// 				 />

// 				<div className=" pt-6 mb-8">
// 					<h2 className="font-inter font-bold text-blue-900 text-[clamp(1rem,4vw,1.55rem)]">Available Properties</h2>
// 								<p className="text-gray-400 text-sm">Explore fractional investment opportunities in premium real estate</p>
// 				</div>
// 				<section>
// 					<div className="">
// 						<AvailableProperties properties={properties} />
						
// 					</div>
					
// 				</section>
// 			</div>
// 		</>
// 		)
// }

// export default Properties;