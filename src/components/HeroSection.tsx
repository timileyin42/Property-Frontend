import Navbar from "./Navbar"
import {ShieldIcon, TrendUpIcon, UsersIcon} from "../components/svgs/ShieldIcon"
import { GoGoal } from "react-icons/go";
import { IoEye } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaInstagram } from "react-icons/fa6";
// import {ShieldIcon} from "../components/svgs/ShieldIcon"
import { useNavigate } from 'react-router-dom';
import img1 from "../assets/img1.jpg";
import {fetchFeaturedProperties} from "../api/properties";
import { useEffect, useMemo, useState } from "react";
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
		const data = await fetchFeaturedProperties(12);
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
	const sliderItems = useMemo(() => {
		if (properties.length === 0) return [];
		return [...properties, ...properties];
	}, [properties]);

	return (
		<>
			<div className="flex flex-col items-center">
				<Navbar
					logoText="Elycapvest Luxury Homes"
					links={[
						{ label: "Properties", href: "/properties" },
						{ label: "Partnership", href: "/partnership" },
					]}
				/>
				<main className="pt-16 text-base w-full">
					<div className="min-h-screen bg-[url(./assets/pol_hero.avif)] bg-cover bg-center">
						<div className="min-h-screen flex flex-col gap-6 sm:gap-8 items-center justify-center text-center bg-gradient-to-t from-gray-950 to-zinc-950/20 px-4 py-16">
							<h1 className="text-white font-inter font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight max-w-4xl">
								Shortlet Transparency <br /> Through Fractional Ownership
							</h1>
							<p className="w-full max-w-2xl text-base sm:text-lg md:text-xl text-gray-200 font-inter">
								Invest in premium real estate with complete transparency. Monitor your shortlet properties in real-time and watch your investment grow.
							</p>
							<div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full sm:w-auto">
								<button
									className="w-full sm:w-auto bg-blue-900 text-white font-sans px-8 py-3 sm:px-10 sm:py-4 cursor-pointer rounded rounded-xl transition-all duration-500 hover:bg-blue-500 font-bold text-base"
									onClick={() => navigate("/signup")}
								>
									Get Started
								</button>
							<button
								onClick={()=>navigate("/properties")}
								className="w-full sm:w-auto bg-white text-blue-900 font-sans px-8 
								py-3 sm:px-10 sm:py-4 cursor-pointer rounded rounded-xl transition-all duration-500
								hover:bg-gray-200 border-1 border-blue-900 font-bold text-base"
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
										className="from-gray-50 rounded-xl p-6 hover:bg-blue-600 transition-colors duration-300"
									>
										<div className="flex flex-col items-start space-x-4">
											<div className="flex-shrink-0">
												<div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
													<div className="text-xl">{item.icon}</div>
												</div>
											</div>
											<div>
												<h3 className="text-xl text-white font-bold mb-2">
													{item.label}
												</h3>
												<p className="text-gray-100 text-sm sm:text-base">
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
							<h2 className="text-blue-900 font-bold font-inter text-[clamp(1.25rem,4vw,1.875rem)]">Why Choose Elycapvest?</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 px-5 gap-7 mx-auto ">
							{whatWeOffer.map((item)=>(
							<div key={item.id} className="border border-gray-200 bg-white shadow-lg rounded rounded-xl">
								<div className="p-8 inline-flex flex-col items-start gap-4">
									<div className=" bg-blue-900 flex-start  justify-center p-4 rounded rounded-xl">{item.icon}</div>
								<h2 className="font-inter font-bold text-blue-900 text-[clamp(1rem,4vw,1.25rem)]">{item.label}</h2>
								<p className="text-gray-400 text-sm sm:text-base">{item.desc}</p>
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
								<div className="featured-marquee w-full">
									{sliderItems.length === 0 ? (
										<p className="text-gray-500 text-base">Loading properties...</p>
									) : (
										<div className="featured-track">
											{sliderItems.map((property, index) => (
												<div
													key={`${property.id}-${index}`}
													className="featured-item w-[280px] sm:w-[320px] lg:w-[360px]"
												>
													<LandingPropertyCard property={property} />
												</div>
											))}
										</div>
									)}
								</div>
								<button
									className="flex flex-col items-center justify-center py-2 px-4 rounded-lg cursor-pointer my-7 border border-2 border-blue-900 bg-white text-blue-900"
									onClick={() => navigate("/properties")}
								>
									View All Properties
								</button>
							</section>

					<AboutUsMinimal />

					<section className="flex flex-col mx-auto items-center justify-center">
						<div className="flex flex-col items-center justify-center">
							<h2 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2">
								What Our Investors Say
							</h2>
							<p className="text-gray-600 text-base text-center">
								Hear from investors who trust us with their real estate investments
							</p>
						</div>
						<TestimonialsSimple />
					</section>
					<section>
						<FAQ />
					</section>

					<section className="flex flex-col gap-4 items-center justify-center bg-blue-900 rounded rounded-xl px-6 py-10 md:py-12 mx-4 md:mx-8">
						<div>
							<h1 className="text-center text-white font-inter font-bold text-2xl  md:text-[clamp(1.2rem,4vw,1.85rem)] leading-none ">Ready to Start Investing?</h1>
							
						</div>
						<p className="text-center text-base text-gray-200 font-inter">
							Join Elycapvest Properties today and get access to premium shortlet properties.
							</p>
						<button
							onClick={() => navigate("/signup")}
							className="bg-white text-blue-900 font-sans px-10 py-4 cursor-pointer rounded rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg font-bold text-base"
						>
							Create Your Account
						</button>
						
					</section>

					<section className="mt-0 rounded-[20px] bg-blue-900 text-white px-6 py-10">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div>
								<h3 className="text-lg font-semibold">Quick Links</h3>
								<ul className="mt-4 space-y-2 text-base text-white/80">
									<li><a className="hover:text-white" href="/properties">Properties</a></li>
									<li><a className="hover:text-white" href="/updates">Updates</a></li>
									<li><a className="hover:text-white" href="/about">About Us</a></li>
									<li><a className="hover:text-white" href="/contact">Contact Us</a></li>
									<li><a className="hover:text-white" href="/partnership">Partnership</a></li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold">Contact Us</h3>
								<div className="mt-4 space-y-3 text-base text-white/80">
									<p>partnerships@elycapvest.com</p>
									<p>University Road Akoka Yaba, Lagos</p>
									<p>+234 8133101607</p>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold">Follow us</h3>
								<div className="mt-4 flex items-center gap-4 text-white/90">
									<a
										href="https://www.instagram.com/elycap_luxuryhomes/"
										target="_blank"
										rel="noreferrer"
										className="hover:text-white"
										aria-label="Instagram"
									>
										<FaInstagram size={18} />
									</a>
									<span className="text-sm text-white/60">@elycap_luxuryhomes</span>
								</div>
							</div>
						</div>
						<div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60">
							<p>© {new Date().getFullYear()} Elycapvest Luxury Homes. All rights reserved.</p>
							<p>Trusted by investors building wealth through shortlet properties.</p>
						</div>
					</section>
				</main>
			</div>
		</>
		)
}

export default HeroSection;
