import Navbar from "./Navbar"
import {ShieldIcon, TrendUpIcon, UsersIcon} from "../components/svgs/ShieldIcon"
import { GoGoal } from "react-icons/go";
import { IoEye } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
// import {ShieldIcon} from "../components/svgs/ShieldIcon"
import { useNavigate } from 'react-router-dom';
import img1 from "../assets/img1.jpg";
import {fetchFeaturedProperties} from "../api/properties";
import { useEffect, useState } from "react";
import { ApiProperty } from "../types/property";
import LandingPropertyCard from "../components/LandingPropertyCard";
import TestimonialsSimple from "../components/TestimonialsSimple";
import AboutUsMinimal from "../components/AboutUsMinimal"
import FAQ from "../components/FAQ"


interface StatementItem {
  id: number;
  icon: JSX.Element;
  img: string;
  label: string;
  desc: string;
}


function HeroSection(){
	const navigate = useNavigate();
	const [properties, setProperties] = useState<ApiProperty[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);


   useEffect(() => {
    const loadProperties = async () => {
      try {
        // setLoading(true);
        const data = await fetchFeaturedProperties(3);
        setProperties(data);
      } catch (err) {
        // setError("Failed to load featured properties");
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    loadProperties();
  }, []);






	const whatWeOffer = [
		{id: 1, icon: <ShieldIcon className="text-white"  />, label: "Full Transparency", desc: "Monitor your shortlet property performance with real-time data and complete financial transparency."},
		{id: 2, icon: <TrendUpIcon className="text-white" />, label: "Fractional Investment", desc: "Start investing in premium real estate with as little as a fraction of the total property value."},
		{id: 3, icon: <UsersIcon className="text-white" />, label: "Verified Community", desc: "Join a community of verified investors and property owners with secure authentication."},
	]

	const statement: StatementItem[] = [
		{id: 1, icon: <GoGoal  className="text-white"  />, img: img1, label: "Our Mission", desc: "To democratize real estate investment by making premium properties accessible to everyone through fractional ownership and complete transparency."},
		{id: 2, icon: <IoEye  className="text-white" />, img: img1, label: "Our Vision", desc: "To become Africa's leading platform for transparent fractional real estate investment, empowering thousands of investors to build wealth through property."},
		{id: 3, icon: <IoIosHeartEmpty className="text-white" />, img: img1, label: "Our Values", desc: "JTransparency, integrity, and investor success are at the core of everything we do. We believe in honest, ethical business practices."},
	]
	
	// // navigation logic
	// const getDashboardLink = () => {
  //       if (!user) return null; // Hide if not logged in
  //       if (user.role === "ADMIN") return { label: "ADMIN PANEL", href: "/admindashboard" }; 
  //       if (user.role === "INVESTOR") return { label: "DASHBOARD", href: "/investor/dashboard" };
  //       return
  //   };

  //   const dashboardLink = getDashboardLink();
	return (
		<>
			<div className="flex items-center justify-center">
				<Navbar
					logoText="Elycapvest Luxury Homes"
					links={[
                        { label: "Properties", href: "/properties" },
                        {label: 'Partnership', href: "/partnership"}


                    ]}
				 />
				<main className="pt-16 text-base">
					<div className={` h-screen bg-[url(./assets/pol_hero.avif)] bg-cover bg-center`}>
						<div className="h-screen flex flex-col gap-8 items-center justify-center text-center bg-gradient-to-t from-gray-950 to-zinc-950/20">
							<h1 className="text-white font-inter font-bold text-5xl sm:text-6xl md:text-7xl leading-none ">Shortlet Transparency <br /> Through Fractional Ownership</h1>
							<p className="w-2/4 space-y-4 text-lg md:text-[20px] text-gray-200 font-inter">
								Invest in premium real estate with complete transparency. Monitor your shortlet properties in real-time and watch your investment grow.
							</p>
							<div className="flex gap-2 items-center justify-center">
							<button className="bg-blue-900 text-white font-sans px-10 
								py-4 cursor-pointer rounded rounded-xl transition-all duration-500
								hover:bg-blue-500 font-bold text-sm "
								onClick={()=>navigate("/login")}

							>
								Get Started</button>
							<button
								onClick={()=>navigate("/properties")}
								className="bg-white text-blue-900 font-sans px-10 
								py-4 cursor-pointer rounded rounded-xl transition-all duration-500
								hover:bg-gray-200 border-1 border-blue-900 font-bold text-sm"
							>View Properties
							</button>
						</div>
						</div>
						
					</div>
					
						 <section className="py-12 px-4 md:px-8 bg-blue-900">
      								<div className="max-w-6xl mx-auto">
        								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         								 {statement.map((item) => (
          						  <div
           								   key={item.id}
            						  className=" from-gray-50  rounded-xl p-6 hover:bg-blue-600 transition-colors duration-300"
            						>
              						<div className="flex flex-col items-start space-x-4">
              						  <div className="flex-shrink-0">
               						   <div className="w-12 h-12 rounded-full bg-gray-900 flex  items-center justify-center">
                					    <div className="text-xl">{item.icon}</div>
                 						 </div>
                						</div>
                						<div>
                						  <h3 className="text-xl text-white font-bold  mb-2">
                   							 {item.label}
                 						 </h3>
                  							<p className="text-gray-100">
                    							{item.desc}
                  							</p>
                						</div>
              							</div>
            						</div>
         						 ))}
       						 </div>
   						   </div>
    					</section>

					
					<section className="my-16">
						<div className="flex items-center justify-center my-6">
							<h2 className="text-blue-900 font-bold font-inter text-[clamp(1.25rem,4vw,1.875rem)]">Why Choose POL Properties?</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 px-5 gap-7 mx-auto ">
							{whatWeOffer.map((item)=>(
							<div key={item.id} className="border border-gray-200 bg-white shadow-lg rounded rounded-xl">
								<div className="p-8 inline-flex flex-col items-start gap-4">
									<div className=" bg-blue-900 flex-start  justify-center p-4 rounded rounded-xl">{item.icon}</div>
								<h2 className="font-inter font-bold text-blue-900 text-[clamp(1rem,4vw,1.25rem)]">{item.label}</h2>
								<p className="text-gray-400 text-sm">{item.desc}</p>
								</div>
							</div>
							))}
						</div>
					</section>
					{/*available properties*/}
					<div className="flex flex-col items-center justify-center my-6">
							<h2 className="text-blue-900 font-bold font-inter text-[clamp(1.25rem,4vw,1.875rem)]">Featured Properties</h2>
							<p>Explore our curated selection of premium shortlet properties</p>
						</div>
					 		<section className="max-w-7xl flex flex-col items-center mx-auto px-4 py-12">
     	


     						 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       						 {properties.map((property) => (
        						  <LandingPropertyCard key={property.id} property={property} />
        						))}
     						 </div>
     						 <button 
     						 	className="flex flex-col items-center justify-center py-2 px-4 rounded-lg cursor-pointer my-7 border border-2 border-blue-900 bg-white text-blue-900" 
     						 	onClick={()=>navigate("/properties")}>View All Properties
     						 </button>
   							 </section>
					
   							 	{/*ABOUT US*/}

   							 	<AboutUsMinimal />
   							 	{/*ABOUT US*/}

   							 		
   							 	<section className="flex flex-col mx-auto  items-center justify-center">
   							 			<div className="flex flex-col items-center justify-center" >
          <h2 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2">
            What Our Investors Say
          </h2>
          <p className="text-gray-600 text-sm md:text-base text-center">
            Hear from investors who trust us with their real estate investments
          </p>
        </div>
   							 		<TestimonialsSimple />
   							 	</section>
   							 		<section>
   							 			<FAQ />
   							 		</section>

					<section className="flex  flex-col gap-4 items-center justify-center bg-blue-900 rounded rounded-xl p-13">
						<div>
							<h1 className="text-center text-white font-inter font-bold text-2xl  md:text-[clamp(1.2rem,4vw,1.85rem)] leading-none ">Ready to Start Investing?</h1>
							
						</div>
						<p className="text-center text-sm md:text-sm text-gray-200 font-inter">
							Join POL Properties today and get access to premium shortlet properties.
							</p>
						<button
								onClick={()=>navigate("/signup")}

								className="bg-white text-blue-900 font-sans px-10 
								py-4 cursor-pointer rounded rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg font-bold text-sm"
							>Create Your Account</button>
						
					</section>
				</main>
			</div>
		</>
		)
}

export default HeroSection;
