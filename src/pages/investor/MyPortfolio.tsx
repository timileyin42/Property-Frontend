import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import LineChart from "../../components/charts/LineChart";
import {
  fetchInvestorInvestments,
  fetchPortfolioSummary,
  fetchInvestorInvestmentDetail,
  fetchPortfolioTrend,
} from "../../api/investor.investments";
import type { Investment } from "../../types/investment";
import type { ApiProperty } from "../../types/property";
import {
  getPresignedUrl,
  getCachedPresignedUrl,
  isVideoUrl,
} from "../../util/normalizeMediaUrl";

const formatCurrency = (value?: number | null) =>
  typeof value === "number" ? `₦${Math.round(value).toLocaleString()}` : "N/A";

const percentFmt = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 1 });

type FilterKey = "active" | "exited" | "pending";
type SortKey = "returns" | "invested" | "recent";

const MyPortfolio = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState<{
    total_initial_value: number;
    total_current_value: number;
    total_growth_percentage: number;
    properties_count?: number;
    lifetime_investment_value?: number;
  } | null>(null);
  const [trend, setTrend] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("active");
  const [sortBy, setSortBy] = useState<SortKey>("returns");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [invRes, sumRes, trendRes] = await Promise.all([
          fetchInvestorInvestments(),
          fetchPortfolioSummary(),
          fetchPortfolioTrend({ interval: "monthly", months: 12 }),
        ]);
        setInvestments(invRes.investments ?? []);
        setSummary(sumRes ?? null);
        setTrend({
          labels: trendRes.trend_labels ?? [],
          values: trendRes.trend_values ?? [],
        });
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Resolve media (same approach as the dashboard)
  useEffect(() => {
    const missing = investments.filter((item) => !getCachedPresignedUrl(item.image_url || ""));
    if (missing.length === 0) return;
    const loadMedia = async () => {
      try {
        const entries = await Promise.all(
          missing.map(async (item) => {
            const detail = await fetchInvestorInvestmentDetail(item.id);
            const property = detail.property as
              | (Partial<ApiProperty> & {
                  media_files?: Array<{ url?: string; file_url?: string; secure_url?: string }>;
                })
              | undefined;
            const urls = [
              detail.image_url,
              property?.primary_image,
              ...(property?.image_urls ?? []),
              ...(property?.media_urls ?? []),
              ...(property?.media_files?.map((f) => f.url ?? f.file_url ?? f.secure_url) ?? []),
            ].filter(Boolean) as string[];
            const resolved = (await Promise.all(urls.map((u) => getPresignedUrl(u)))).filter(Boolean) as string[];
            const media = resolved.find((u) => !isVideoUrl(u)) ?? resolved[0] ?? "";
            return [item.id, media] as const;
          })
        );
        setMediaMap((prev) => {
          const next = { ...prev };
          entries.forEach(([id, media]) => {
            if (media) next[id] = media;
          });
          return next;
        });
      } catch (error) {
        console.error("Failed to load portfolio media:", error);
      }
    };
    loadMedia();
  }, [investments]);

  const cards = useMemo(
    () =>
      investments.map((inv) => {
        const media =
          getCachedPresignedUrl(inv.image_url || "") || getCachedPresignedUrl(mediaMap[inv.id] || "");
        const fractionsSold = inv.fractions_sold ?? inv.fractions_removed ?? 0;
        const fractionsOwned = inv.fractions_owned ?? 0;
        const status: FilterKey =
          fractionsOwned > 0 ? "active" : fractionsSold > 0 ? "exited" : "pending";
        return { ...inv, media, isVideo: media ? isVideoUrl(media) : false, status };
      }),
    [investments, mediaMap]
  );

  const counts = useMemo(
    () => ({
      active: cards.filter((c) => c.status === "active").length,
      exited: cards.filter((c) => c.status === "exited").length,
      pending: cards.filter((c) => c.status === "pending").length,
    }),
    [cards]
  );

  const visibleCards = useMemo(() => {
    const filtered = cards.filter((c) => c.status === filter);
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "returns") return (b.growth_percentage ?? 0) - (a.growth_percentage ?? 0);
      if (sortBy === "invested") return (b.initial_value ?? 0) - (a.initial_value ?? 0);
      return b.id - a.id;
    });
    return sorted;
  }, [cards, filter, sortBy]);

  const totalValue =
    summary?.total_current_value ??
    cards.reduce((sum, c) => sum + (c.current_value ?? 0), 0);
  const growthPct = summary?.total_growth_percentage ?? 0;
  const hasTrend = trend.labels.length > 0 && trend.values.length > 0;

  const FILTERS: Array<{ key: FilterKey; label: string }> = [
    { key: "active", label: `Active (${counts.active})` },
    { key: "exited", label: `Exited (${counts.exited})` },
    { key: "pending", label: `Pending (${counts.pending})` },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/investor/dashboard" },
        ]}
      />

      <main className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl text-on-surface mb-2">
              Portfolio Overview
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              A curated aggregate of your fractional holdings, yielding consistent dividends from
              prime real estate.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="glass-panel glass-panel-hover px-5 py-3 rounded-lg flex items-center gap-2 group">
              <span className="material-symbols-outlined text-premium-gold">file_download</span>
              <span className="label-caps group-hover:text-premium-gold transition-colors">Export PDF</span>
            </button>
            <button className="glass-panel glass-panel-hover px-5 py-3 rounded-lg flex items-center gap-2 group">
              <span className="material-symbols-outlined text-premium-gold">table_view</span>
              <span className="label-caps group-hover:text-premium-gold transition-colors">CSV</span>
            </button>
          </div>
        </header>

        {/* Bento stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-xl">
            <p className="label-caps text-on-surface-variant mb-4">Total Portfolio Value</p>
            <span className="data-stat text-3xl text-on-surface">{formatCurrency(totalValue)}</span>
            <div className="mt-4 flex items-center text-success-emerald gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="data-stat text-sm">+{percentFmt.format(growthPct)}% overall</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl md:col-span-3 relative overflow-hidden">
            <div className="absolute inset-0 chart-gradient pointer-events-none" />
            <div className="flex justify-between items-start relative z-10 mb-4">
              <p className="label-caps text-on-surface-variant">Growth Performance</p>
              <span className="label-caps text-premium-gold">12 Months</span>
            </div>
            <div className="relative z-10 h-32">
              {hasTrend ? (
                <LineChart labels={trend.labels} data={trend.values} />
              ) : (
                <p className="text-sm text-on-surface-variant">Growth data isn&apos;t available yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 p-1 glass-panel rounded-full">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full label-caps transition-colors ${
                  filter === f.key
                    ? "bg-premium-gold text-primary-container"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="label-caps text-on-surface-variant">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-surface-low border border-[rgba(248,246,241,0.15)] rounded px-3 py-2 text-sm text-on-surface outline-none focus:border-premium-gold"
            >
              <option value="returns">Highest Returns</option>
              <option value="invested">Invested Amount</option>
              <option value="recent">Recent Activity</option>
            </select>
          </div>
        </div>

        {/* Holdings grid */}
        {loading ? (
          <p className="text-on-surface-variant">Loading portfolio…</p>
        ) : visibleCards.length === 0 ? (
          <div className="glass-panel rounded-xl p-10 text-center text-on-surface-variant">
            No {filter} holdings.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleCards.map((c) => {
              const fundingPaid = c.status !== "pending";
              return (
                <Link
                  to={`/investor/investments/${c.id}`}
                  state={{ fractionsOwned: c.fractions_owned }}
                  key={c.id}
                  className="glass-panel glass-panel-hover overflow-hidden rounded-xl group"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden bg-surface-high">
                      {c.media ? (
                        c.isVideo ? (
                          <video className="w-full h-full object-cover" src={c.media} muted playsInline loop autoPlay />
                        ) : (
                          <img
                            src={c.media}
                            alt={c.property_title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <h3 className="font-display text-xl text-on-surface leading-snug">
                            {c.property_title}
                          </h3>
                          <span
                            className={`data-stat text-sm shrink-0 ${
                              (c.growth_percentage ?? 0) >= 0 ? "text-success-emerald" : "text-error"
                            }`}
                          >
                            {(c.growth_percentage ?? 0) >= 0 ? "+" : ""}
                            {percentFmt.format(c.growth_percentage ?? 0)}%
                          </span>
                        </div>
                        <p className="label-caps text-[10px] text-on-surface-variant mb-4">
                          {c.property_location}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-[rgba(248,246,241,0.12)] pt-4">
                        <div>
                          <p className="label-caps text-[10px] text-on-surface-variant mb-1">Invested</p>
                          <p className="data-stat text-on-surface text-sm">{formatCurrency(c.initial_value ?? null)}</p>
                        </div>
                        <div>
                          <p className="label-caps text-[10px] text-on-surface-variant mb-1">Current Value</p>
                          <p className="data-stat text-on-surface text-sm">{formatCurrency(c.current_value ?? null)}</p>
                        </div>
                        <div>
                          <p className="label-caps text-[10px] text-on-surface-variant mb-1">Ownership</p>
                          <p className="data-stat text-on-surface text-sm">{c.ownership_percentage ?? 0}%</p>
                        </div>
                        <div>
                          <p className="label-caps text-[10px] text-on-surface-variant mb-1">Fractions</p>
                          <p className="data-stat text-on-surface text-sm">{c.fractions_owned ?? 0}</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="flex justify-between label-caps text-[10px] text-on-surface-variant mb-2">
                          <span>Funding Progress</span>
                          <span>{fundingPaid ? "100% Funded" : "Pending"}</span>
                        </div>
                        <div className="h-1 bg-surface-high rounded-full overflow-hidden">
                          <div className={`h-full bg-success-emerald ${fundingPaid ? "w-full" : "w-1/3"}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPortfolio;
