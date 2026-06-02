import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api/axios";
import { ApiProperty } from "../types/property";
import { useAuth } from "../context/AuthContext";
import { isVideoUrl, usePresignedUrls } from "../util/normalizeMediaUrl";
import toast, { Toaster } from "react-hot-toast";
import type { WishlistItem, WishlistListResponse } from "../types/userProfile";

type TabKey = "OVERVIEW" | "FINANCIALS" | "DOCUMENTS";
const TABS: TabKey[] = ["OVERVIEW", "FINANCIALS", "DOCUMENTS"];

const getWishlistItems = (data: unknown): WishlistItem[] => {
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  const items =
    record.items ?? record.data ?? record.wishlist ?? record.wishlists;
  return Array.isArray(items) ? (items as WishlistItem[]) : [];
};

const ngn = (value: number) => `₦${Math.round(value).toLocaleString()}`;

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistId, setWishlistId] = useState<number | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("OVERVIEW");
  const [investAmount, setInvestAmount] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!id) return;

    api
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((error) => console.error("Failed to fetch property:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !id) return;

    try {
      const res = await api.get<WishlistListResponse>("/user/wishlist");
      const items = getWishlistItems(res.data);
      const match = items.find((item) => item.property_id === Number(id));
      setWishlistId(match?.id ?? null);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!property || wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (wishlistId) {
        await api.delete(`/user/wishlist/${wishlistId}`);
        setWishlistId(null);
        toast.success("Removed from wishlist");
      } else {
        const res = await api.post("/user/wishlist", {
          property_id: property.id,
          notify_on_update: true,
          notify_on_price_change: true,
        });
        const createdId =
          (res.data as { id?: number })?.id ??
          (res.data as { item?: { id?: number } })?.item?.id ??
          (res.data as { wishlist?: { id?: number } })?.wishlist?.id ??
          (res.data as { data?: { id?: number } })?.data?.id ??
          null;

        if (typeof createdId === "number") {
          setWishlistId(createdId);
        } else {
          await fetchWishlist();
        }
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  const mediaItems = usePresignedUrls(
    useMemo(() => {
      if (!property) return [] as string[];
      const mediaFiles = property.media_files ?? [];
      const mediaFromFiles = mediaFiles
        .map((item) => item.url ?? item.file_url ?? item.secure_url)
        .filter(Boolean) as string[];

      return [
        property.primary_image,
        ...(property.image_urls ?? []),
        ...(property.media_urls ?? []),
        ...(property.image_url ? [property.image_url] : []),
        ...mediaFromFiles,
      ].filter(Boolean) as string[];
    }, [property])
  );
  const selectedMedia = viewerIndex !== null ? mediaItems[viewerIndex] : null;
  const openViewer = useCallback((index: number) => {
    setViewerIndex(index);
  }, []);

  useEffect(() => {
    if (viewerIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewerIndex(null);
      }
      if (event.key === "ArrowLeft" && viewerIndex > 0) {
        setViewerIndex(viewerIndex - 1);
      }
      if (event.key === "ArrowRight" && viewerIndex < mediaItems.length - 1) {
        setViewerIndex(viewerIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, mediaItems.length]);

  useEffect(() => {
    if (viewerIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [viewerIndex]);

  // Mobile sticky invest bar reveal on scroll
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goPrev = () => {
    setViewerIndex((current) =>
      current === null ? current : Math.max(0, current - 1)
    );
  };

  const goNext = () => {
    setViewerIndex((current) =>
      current === null ? current : Math.min(mediaItems.length - 1, current + 1)
    );
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? null;
    if (endX === null) return;
    const delta = touchStartX.current - endX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) {
      if (viewerIndex !== null && viewerIndex < mediaItems.length - 1) {
        goNext();
      }
    } else if (viewerIndex !== null && viewerIndex > 0) {
      goPrev();
    }
    touchStartX.current = null;
  };

  const ctaLabel = user?.role === "INVESTOR" ? "Acquire Fractions" : "Express Interest";
  const hasInvested = Boolean(
    (location.state as { hasInvested?: boolean } | null)?.hasInvested
  );
  const totalFractions = property?.total_fractions ?? 0;
  const fractionsSold = property?.fractions_sold ?? 0;
  const fractionsAvailable =
    property?.fractions_available ?? Math.max(totalFractions - fractionsSold, 0);
  const isSoldOut = totalFractions > 0 && fractionsSold >= totalFractions;
  const fractionPrice = property?.fraction_price ?? 0;
  const expectedRoi = property?.expected_roi ?? 0;
  const projectValue = property?.project_value ?? 0;

  const fundingPct =
    totalFractions > 0
      ? Math.min(100, Math.round((fractionsSold / totalFractions) * 100))
      : 0;
  const raised = fractionsSold * fractionPrice;
  const target = projectValue || totalFractions * fractionPrice;

  // Initialise the yield-calculator slider once the property loads
  useEffect(() => {
    if (fractionPrice > 0) {
      const startUnits = Math.min(10, fractionsAvailable || totalFractions || 10);
      setInvestAmount(fractionPrice * Math.max(1, startUnits));
    }
  }, [fractionPrice, fractionsAvailable, totalFractions]);

  const sliderMax = useMemo(() => {
    const units = fractionsAvailable || totalFractions || 50;
    return Math.max(fractionPrice * units, fractionPrice * 2);
  }, [fractionPrice, fractionsAvailable, totalFractions]);

  const effectiveInvest = investAmount ?? fractionPrice;
  const estAnnualReturn = (effectiveInvest * expectedRoi) / 100;
  const unitsFromInvest = fractionPrice > 0 ? Math.floor(effectiveInvest / fractionPrice) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Loading property…
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Property not found.
      </div>
    );
  }

  const heroImages = mediaItems.slice(0, 5);
  const mainImage = heroImages[0];
  const thumbs = heroImages.slice(1, 5);

  const goToInterest = () => navigate(`/properties/${property.id}/interest`);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Toaster position="top-right" />
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: "Partnership", href: "/partnership" },
        ]}
      />

      <main className="pt-20">
        {/* ===================== HERO GALLERY ===================== */}
        <section className="relative w-full h-[420px] md:h-[560px] overflow-hidden bg-surface-lowest">
          <div className="grid grid-cols-4 grid-rows-2 h-full gap-2">
            {/* Main image */}
            <div
              className="col-span-4 md:col-span-2 row-span-2 relative group overflow-hidden cursor-pointer"
              onClick={() => mainImage && openViewer(0)}
            >
              {mainImage ? (
                isVideoUrl(mainImage) ? (
                  <video className="w-full h-full object-cover" muted playsInline loop autoPlay>
                    <source src={mainImage} />
                  </video>
                ) : (
                  <img
                    src={mainImage}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )
              ) : (
                <div className="w-full h-full bg-surface-high flex items-center justify-center text-on-surface-variant text-sm">
                  Media unavailable
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                {expectedRoi >= 10 && (
                  <span className="label-caps bg-premium-gold/90 text-[#151b2b] px-3 py-1 mb-3 inline-block rounded">
                    Premium Listing
                  </span>
                )}
                <h1 className="font-display text-3xl md:text-5xl text-white leading-tight">
                  {property.title}
                </h1>
                <p className="text-on-surface-variant mt-1">{property.location}</p>
              </div>

              {/* Wishlist heart */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle();
                }}
                disabled={wishlistLoading}
                aria-label={wishlistId ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-4 right-4 h-11 w-11 rounded-full glass-panel flex items-center justify-center hover:border-premium-gold transition-colors disabled:opacity-60"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: wishlistId ? "#C9A84C" : "#e4e2dd",
                    fontVariationSettings: wishlistId ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Thumbnails */}
            {thumbs.map((item, index) => (
              <div
                key={item}
                className="hidden md:block relative group overflow-hidden cursor-pointer"
                onClick={() => openViewer(index + 1)}
              >
                {isVideoUrl(item) ? (
                  <video className="w-full h-full object-cover" muted playsInline loop autoPlay>
                    <source src={item} />
                  </video>
                ) : (
                  <img
                    src={item}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
              </div>
            ))}

            {/* "View all" tile fills remaining grid cells */}
            {Array.from({ length: Math.max(0, 4 - thumbs.length) }).map((_, i) => {
              const isFirstEmpty = i === 0 && mediaItems.length > heroImages.length;
              return (
                <div
                  key={`empty-${i}`}
                  className="hidden md:block relative group overflow-hidden"
                  onClick={() => mediaItems.length && openViewer(0)}
                >
                  <div className="absolute inset-0 bg-surface-high flex items-center justify-center cursor-pointer group-hover:bg-surface-highest transition-colors">
                    {isFirstEmpty ? (
                      <div className="text-center">
                        <span className="material-symbols-outlined text-premium-gold text-4xl">
                          grid_view
                        </span>
                        <p className="label-caps mt-2">View all {mediaItems.length} photos</p>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">
                        image
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================== CONTENT GRID ===================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* -------- Left: Investment Widget -------- */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="glass-panel p-6 rounded-lg shadow-xl lg:sticky lg:top-28">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="label-caps text-on-surface-variant mb-1">Fraction Price</p>
                    <p className="data-stat text-premium-gold text-2xl">
                      {fractionPrice ? ngn(fractionPrice) : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="label-caps text-on-surface-variant mb-1">Expected ROI</p>
                    <p className="data-stat text-success-emerald text-2xl">{expectedRoi}%</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Funding progress */}
                  <div>
                    <div className="flex justify-between label-caps mb-2">
                      <span>Funding Progress</span>
                      <span className="text-secondary">{fundingPct}% Funded</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success-emerald rounded-full"
                        style={{ width: `${fundingPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 data-stat text-xs text-on-surface-variant">
                      <span>{ngn(raised)} Raised</span>
                      <span>{ngn(target)} Target</span>
                    </div>
                  </div>

                  {/* Yield calculator */}
                  {fractionPrice > 0 && (
                    <div className="pt-4 border-t border-[rgba(248,246,241,0.15)]">
                      <p className="label-caps mb-4">Estimated Returns</p>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-base mb-2">
                            <span className="text-on-surface-variant">Investment Amount</span>
                            <span className="data-stat text-premium-gold">
                              {ngn(effectiveInvest)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={fractionPrice}
                            max={sliderMax}
                            step={fractionPrice}
                            value={effectiveInvest}
                            onChange={(e) => setInvestAmount(Number(e.target.value))}
                            className="w-full h-1 bg-surface-high rounded-lg appearance-none cursor-pointer accent-premium-gold"
                          />
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            {unitsFromInvest} fraction{unitsFromInvest === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-surface-low p-3 rounded border border-[rgba(248,246,241,0.15)]">
                            <p className="text-[10px] label-caps text-on-surface-variant mb-1">
                              Est. Annual Return
                            </p>
                            <p className="data-stat text-sm text-success-emerald">
                              {ngn(estAnnualReturn)}
                            </p>
                          </div>
                          <div className="bg-surface-low p-3 rounded border border-[rgba(248,246,241,0.15)]">
                            <p className="text-[10px] label-caps text-on-surface-variant mb-1">
                              Fractions
                            </p>
                            <p className="data-stat text-sm text-on-surface">{unitsFromInvest}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!hasInvested && (
                    <button
                      onClick={goToInterest}
                      disabled={isSoldOut}
                      className="btn-gold w-full py-4 text-[12px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSoldOut ? "Sold Out" : ctaLabel}
                    </button>
                  )}

                  {wishlistId ? (
                    <div className="w-full border border-success-emerald/40 bg-success-emerald/10 text-secondary rounded-full py-3 text-sm font-medium text-center">
                      Saved to Wishlist
                    </div>
                  ) : (
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      className="btn-ghost w-full py-3 label-caps text-on-surface disabled:opacity-60"
                    >
                      {wishlistLoading ? "Updating…" : "Add to Wishlist"}
                    </button>
                  )}

                  <p className="text-center label-caps text-[10px] text-on-surface-variant flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified_user</span>
                    Secured Fractional Ownership
                  </p>
                </div>
              </div>
            </aside>

            {/* -------- Right: Details & Tabs -------- */}
            <div className="lg:col-span-8 space-y-12">
              {/* Tabs */}
              <div className="border-b border-[rgba(248,246,241,0.15)]">
                <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 border-b-2 label-caps whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? "border-premium-gold text-premium-gold"
                          : "border-transparent text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* OVERVIEW */}
              {activeTab === "OVERVIEW" && (
                <div className="space-y-12 animate-fade-in">
                  {/* Specs bento */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="glass-panel p-4 flex flex-col items-center text-center rounded-lg">
                      <span className="material-symbols-outlined text-premium-gold mb-2">bed</span>
                      <p className="label-caps text-[10px] text-on-surface-variant">Bedrooms</p>
                      <p className="font-display text-2xl text-on-surface">{property.bedrooms ?? "—"}</p>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center rounded-lg">
                      <span className="material-symbols-outlined text-premium-gold mb-2">bathtub</span>
                      <p className="label-caps text-[10px] text-on-surface-variant">Baths</p>
                      <p className="font-display text-2xl text-on-surface">{property.bathrooms ?? "—"}</p>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center rounded-lg">
                      <span className="material-symbols-outlined text-premium-gold mb-2">square_foot</span>
                      <p className="label-caps text-[10px] text-on-surface-variant">Sq Footage</p>
                      <p className="font-display text-2xl text-on-surface">
                        {property.area_sqft ? property.area_sqft.toLocaleString() : "—"}
                      </p>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center rounded-lg">
                      <span className="material-symbols-outlined text-premium-gold mb-2">pie_chart</span>
                      <p className="label-caps text-[10px] text-on-surface-variant">Fractions Left</p>
                      <p className="font-display text-2xl text-on-surface">
                        {fractionsAvailable}/{totalFractions || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <section className="space-y-6">
                    <h2 className="font-display text-2xl text-on-surface border-l-2 border-premium-gold pl-4">
                      Architectural Vision
                    </h2>
                    <div className="text-lg text-on-surface-variant space-y-4 max-w-3xl leading-relaxed">
                      <p>{property.description || "No description available for this property yet."}</p>
                    </div>
                  </section>
                </div>
              )}

              {/* FINANCIALS */}
              {activeTab === "FINANCIALS" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="label-caps text-premium-gold">Investment Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Asset Value", value: projectValue ? ngn(projectValue) : "—" },
                      { label: "Fraction Price", value: fractionPrice ? ngn(fractionPrice) : "—" },
                      { label: "Expected ROI", value: `${expectedRoi}%`, accent: "text-success-emerald" },
                      { label: "Total Fractions", value: totalFractions || "—" },
                      { label: "Fractions Sold", value: `${fractionsSold}/${totalFractions || "—"}` },
                      { label: "Fractions Available", value: fractionsAvailable },
                      { label: "Capital Raised", value: ngn(raised) },
                      { label: "Funding Progress", value: `${fundingPct}%`, accent: "text-secondary" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between items-center glass-panel p-4 rounded-lg"
                      >
                        <span className="text-base text-on-surface-variant">{row.label}</span>
                        <span className={`data-stat ${row.accent ?? "text-on-surface"}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DOCUMENTS */}
              {activeTab === "DOCUMENTS" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="label-caps text-premium-gold">Due Diligence Vault</h3>
                  <div className="glass-panel p-10 rounded-lg text-center">
                    <span className="material-symbols-outlined text-premium-gold/60 text-4xl">
                      folder_open
                    </span>
                    <p className="text-on-surface-variant mt-3">
                      Due diligence documents will be available here soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ===================== MOBILE STICKY INVEST BAR ===================== */}
      <div
        className={`fixed bottom-0 left-0 w-full glass-panel border-t border-[rgba(248,246,241,0.15)] p-4 z-40 md:hidden flex items-center justify-between transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div>
          <p className="label-caps text-[10px] text-on-surface-variant">Per Fraction</p>
          <p className="data-stat text-premium-gold">{fractionPrice ? ngn(fractionPrice) : "—"}</p>
        </div>
        <button
          onClick={goToInterest}
          disabled={isSoldOut}
          className="btn-gold px-8 py-3 text-[12px] disabled:opacity-60"
        >
          {isSoldOut ? "Sold Out" : "Invest Now"}
        </button>
      </div>

      {/* ===================== MEDIA VIEWER ===================== */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setViewerIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setViewerIndex(null)}
              className="absolute -top-10 right-0 text-white text-sm bg-black/60 rounded-md px-3 py-1 hover:bg-black/80"
            >
              Close
            </button>
            {viewerIndex !== null && viewerIndex > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-white text-lg"
              >
                ←
              </button>
            )}
            {viewerIndex !== null && viewerIndex < mediaItems.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-white text-lg"
              >
                →
              </button>
            )}
            {isVideoUrl(selectedMedia) ? (
              <video controls className="w-full max-h-[80vh] rounded-xl bg-black">
                <source src={selectedMedia} />
              </video>
            ) : (
              <img
                src={selectedMedia}
                alt={property.title}
                className="w-full max-h-[80vh] object-contain rounded-xl bg-black"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
