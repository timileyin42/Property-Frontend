import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar"
// import { CiLocationOn} from "react-icons/ci";
// import { LuBed } from "react-icons/lu";
// import { TbBath } from "react-icons/tb";
// import { FaRegSquare } from "react-icons/fa";
import AvailableProperties from "../components/AvailableProperties"
import {
	PropertySearchParams,
	PropertySearchStatus,
	searchPublicProperties,
} from "../api/properties";
import { ApiProperty, PropertiesResponse } from "../types/property";



const DEFAULT_PAGE_SIZE = 10;

function Properties() {
	const [properties, setProperties] = useState<ApiProperty[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(DEFAULT_PAGE_SIZE);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const [filters, setFilters] = useState({
		location: "",
		bedrooms: "",
		status: "",
		minPrice: "",
		maxPrice: "",
	});
	const [appliedFilters, setAppliedFilters] = useState(filters);

	const totalPages = useMemo(() => {
		if (!total) return 1;
		return Math.max(1, Math.ceil(total / pageSize));
	}, [total, pageSize]);

	useEffect(() => {
		const fetchAndSetProperties = async () => {
			setIsLoading(true);
			setError("");

			const params: PropertySearchParams = {
				page,
				page_size: pageSize,
			};

			if (appliedFilters.location.trim()) {
				params.location = appliedFilters.location.trim();
			}
			if (appliedFilters.bedrooms) {
				const parsedBedrooms = Number(appliedFilters.bedrooms);
				if (!Number.isNaN(parsedBedrooms)) {
					params.bedrooms = parsedBedrooms;
				}
			}
			if (appliedFilters.status) {
				params.status = appliedFilters.status as PropertySearchStatus;
			}
			if (appliedFilters.minPrice) {
				const parsedMin = Number(appliedFilters.minPrice);
				if (!Number.isNaN(parsedMin)) {
					params.min_price = parsedMin;
				}
			}
			if (appliedFilters.maxPrice) {
				const parsedMax = Number(appliedFilters.maxPrice);
				if (!Number.isNaN(parsedMax)) {
					params.max_price = parsedMax;
				}
			}

			try {
				const data: PropertiesResponse = await searchPublicProperties(params);
				setProperties(data.properties ?? []);
				setTotal(data.total ?? 0);
			} catch (err) {
				console.error("Failed to fetch properties:", err);
				setError("Unable to load properties. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAndSetProperties();
	}, [appliedFilters, page, pageSize]);

	const handleApplyFilters = (event: React.FormEvent) => {
		event.preventDefault();
		setPage(1);
		setAppliedFilters(filters);
	};

	const handleResetFilters = () => {
		const cleared = {
			location: "",
			bedrooms: "",
			status: "",
			minPrice: "",
			maxPrice: "",
		};
		setFilters(cleared);
		setAppliedFilters(cleared);
		setPage(1);
	};

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

				<section className="flex flex-col lg:flex-row gap-8">
					<aside className="w-full lg:w-[320px] flex-shrink-0">
						<form
							onSubmit={handleApplyFilters}
							className="bg-white border border-black/10 rounded-[14px] p-4"
						>
							<div className="flex flex-col gap-4">
								<div>
									<label className="text-xs text-gray-500">Location</label>
									<input
										type="text"
										value={filters.location}
										onChange={(event) =>
											setFilters((prev) => ({
												...prev,
												location: event.target.value,
											}))
										}
										placeholder="e.g. Lekki"
										className="mt-1 w-full rounded-[8px] border border-black/10 px-3 py-2 text-sm"
									/>
								</div>
								<div>
									<label className="text-xs text-gray-500">Bedrooms</label>
									<input
										type="number"
										min={0}
										value={filters.bedrooms}
										onChange={(event) =>
											setFilters((prev) => ({
												...prev,
												bedrooms: event.target.value,
											}))
										}
										placeholder="Any"
										className="mt-1 w-full rounded-[8px] border border-black/10 px-3 py-2 text-sm"
									/>
								</div>
								<div>
									<label className="text-xs text-gray-500">Status</label>
									<select
										value={filters.status}
										onChange={(event) =>
											setFilters((prev) => ({
												...prev,
												status: event.target.value,
											}))
										}
										className="mt-1 w-full rounded-[8px] border border-black/10 px-3 py-2 text-sm"
									>
										<option value="">All</option>
										<option value="AVAILABLE">Available</option>
										<option value="SOLD">Sold</option>
									</select>
								</div>
								<div>
									<label className="text-xs text-gray-500">Min Price</label>
									<input
										type="number"
										min={0}
										value={filters.minPrice}
										onChange={(event) =>
											setFilters((prev) => ({
												...prev,
												minPrice: event.target.value,
											}))
										}
										placeholder="e.g. 300000"
										className="mt-1 w-full rounded-[8px] border border-black/10 px-3 py-2 text-sm"
									/>
								</div>
								<div>
									<label className="text-xs text-gray-500">Max Price</label>
									<input
										type="number"
										min={0}
										value={filters.maxPrice}
										onChange={(event) =>
											setFilters((prev) => ({
												...prev,
												maxPrice: event.target.value,
											}))
										}
										placeholder="e.g. 800000"
										className="mt-1 w-full rounded-[8px] border border-black/10 px-3 py-2 text-sm"
									/>
								</div>
							</div>
							<div className="mt-4 flex flex-wrap items-center gap-3">
								<button
									type="submit"
									className="bg-[#1e3a8a] text-white rounded-[8px] h-9 px-4 text-sm font-medium"
								>
									Apply Filters
								</button>
								<button
									type="button"
									onClick={handleResetFilters}
									className="border border-[#1e3a8a] text-[#1e3a8a] rounded-[8px] h-9 px-4 text-sm font-medium"
								>
									Reset
								</button>
								<span className="text-xs text-gray-500">
									{total ? `Showing ${properties.length} of ${total}` : ""}
								</span>
							</div>
						</form>
					</aside>
					<div className="flex-1">
						{isLoading ? (
								<p className="text-gray-500 text-sm">Loading properties...</p>
							) : error ? (
								<p className="text-red-600 text-sm">{error}</p>
							) : properties.length === 0 ? (
								<p className="text-gray-500 text-sm">No properties found.</p>
							) : (
								<AvailableProperties properties={properties} />
							)}

							<div className="mt-8 flex items-center justify-center gap-3">
								<button
									type="button"
									onClick={() => setPage((prev) => Math.max(1, prev - 1))}
									disabled={page <= 1 || isLoading}
									className="h-9 px-3 rounded-[8px] border border-black/10 text-sm disabled:opacity-50"
								>
									Previous
								</button>
								<span className="text-sm text-gray-500">
									Page {page} of {totalPages}
								</span>
								<button
									type="button"
									onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
									disabled={page >= totalPages || isLoading}
									className="h-9 px-3 rounded-[8px] border border-black/10 text-sm disabled:opacity-50"
								>
									Next
								</button>
							</div>
					</div>
				</section>
			</div>
		</>
		)
}

export default Properties;
