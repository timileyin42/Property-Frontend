import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import LandingPropertyCard from "../components/LandingPropertyCard";
import {
	PropertySearchParams,
	PropertySearchStatus,
	searchPublicProperties,
} from "../api/properties";
import { ApiProperty, PropertiesResponse } from "../types/property";

const DEFAULT_PAGE_SIZE = 9;

type ViewMode = "grid" | "list";

const emptyFilters = {
	location: "",
	bedrooms: "",
	status: "",
	minPrice: "",
	maxPrice: "",
};

function Properties() {
	const [properties, setProperties] = useState<ApiProperty[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(DEFAULT_PAGE_SIZE);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	const [filters, setFilters] = useState(emptyFilters);
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
		setFilters(emptyFilters);
		setAppliedFilters(emptyFilters);
		setPage(1);
	};

	// Funding-status pills apply immediately
	const setStatus = (status: string) => {
		const next = { ...filters, status: filters.status === status ? "" : status };
		setFilters(next);
		setAppliedFilters(next);
		setPage(1);
	};

	const inputClass =
		"bg-surface-container border border-[rgba(248,246,241,0.15)] text-on-surface rounded p-2 text-sm focus:outline-none focus:border-premium-gold placeholder:text-on-surface-variant/50";

	return (
		<div className="min-h-screen bg-background text-on-surface">
			<Navbar
				links={[
					{ label: "Home", href: "/" },
					{ label: "My Portfolio", href: "/portfolio" },
				]}
			/>

			<main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-8">
				{/* Header & view toggle */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
					<div>
						<h1 className="font-display text-4xl sm:text-5xl text-on-surface mb-2">
							Real Estate Marketplace
						</h1>
						<p className="text-on-surface-variant text-lg max-w-xl">
							Explore fractional investment opportunities in premium real estate.
						</p>
					</div>
					<div className="flex items-center gap-2 glass-panel p-1 rounded-lg self-start">
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							aria-label="Grid view"
							className={`flex items-center justify-center w-10 h-10 rounded transition-colors ${
								viewMode === "grid"
									? "bg-white/10 text-premium-gold"
									: "text-on-surface-variant hover:bg-white/5"
							}`}
						>
							<span className="material-symbols-outlined">grid_view</span>
						</button>
						<button
							type="button"
							onClick={() => setViewMode("list")}
							aria-label="List view"
							className={`flex items-center justify-center w-10 h-10 rounded transition-colors ${
								viewMode === "list"
									? "bg-white/10 text-premium-gold"
									: "text-on-surface-variant hover:bg-white/5"
							}`}
						>
							<span className="material-symbols-outlined">list</span>
						</button>
					</div>
				</div>

				{/* Filter bar */}
				<form
					onSubmit={handleApplyFilters}
					className="glass-panel p-6 mb-12 rounded-lg flex flex-wrap items-end gap-6"
				>
					<div className="flex flex-col gap-2 min-w-[160px] flex-1">
						<label className="label-caps text-on-surface-variant">Location</label>
						<input
							type="text"
							value={filters.location}
							onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
							placeholder="e.g. Lekki"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2 min-w-[120px]">
						<label className="label-caps text-on-surface-variant">Bedrooms</label>
						<input
							type="number"
							min={0}
							value={filters.bedrooms}
							onChange={(e) => setFilters((p) => ({ ...p, bedrooms: e.target.value }))}
							placeholder="Any"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2 min-w-[130px]">
						<label className="label-caps text-on-surface-variant">Min Price (₦)</label>
						<input
							type="number"
							min={0}
							value={filters.minPrice}
							onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
							placeholder="300,000"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2 min-w-[130px]">
						<label className="label-caps text-on-surface-variant">Max Price (₦)</label>
						<input
							type="number"
							min={0}
							value={filters.maxPrice}
							onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
							placeholder="800,000"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className="label-caps text-on-surface-variant">Funding Status</label>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setStatus("AVAILABLE")}
								className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${
									filters.status === "AVAILABLE"
										? "border-secondary text-secondary"
										: "border-[rgba(248,246,241,0.15)] text-on-surface-variant hover:text-on-surface"
								}`}
							>
								Available
							</button>
							<button
								type="button"
								onClick={() => setStatus("SOLD")}
								className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${
									filters.status === "SOLD"
										? "border-premium-gold text-premium-gold"
										: "border-[rgba(248,246,241,0.15)] text-on-surface-variant hover:text-on-surface"
								}`}
							>
								Sold
							</button>
						</div>
					</div>

					<div className="flex items-center gap-3 ml-auto">
						<button type="submit" className="btn-gold px-5 py-2.5 text-[12px]">
							Apply
						</button>
						<button
							type="button"
							onClick={handleResetFilters}
							className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
						>
							<span className="material-symbols-outlined">filter_list</span>
							<span className="label-caps">Clear</span>
						</button>
					</div>
				</form>

				{/* Grid */}
				{isLoading ? (
					<p className="text-on-surface-variant text-base">Loading properties…</p>
				) : error ? (
					<p className="text-error text-base">{error}</p>
				) : properties.length === 0 ? (
					<p className="text-on-surface-variant text-base">No properties found.</p>
				) : (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
								: "flex flex-col gap-6 max-w-3xl mx-auto"
						}
					>
						{properties.map((property) => (
							<LandingPropertyCard key={property.id} property={property} />
						))}
					</div>
				)}

				{/* Pagination */}
				<div className="mt-16 flex flex-col items-center gap-6">
					{total > 0 && (
						<p className="label-caps text-[10px] text-on-surface-variant tracking-widest">
							Showing {properties.length} of {total} assets
						</p>
					)}
					<div className="flex items-center justify-center gap-3">
						<button
							type="button"
							onClick={() => setPage((prev) => Math.max(1, prev - 1))}
							disabled={page <= 1 || isLoading}
							className="btn-ghost h-10 px-5 label-caps text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<span className="text-sm text-on-surface-variant px-2">
							Page {page} of {totalPages}
						</span>
						<button
							type="button"
							onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
							disabled={page >= totalPages || isLoading}
							className="btn-ghost h-10 px-5 label-caps text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default Properties;
