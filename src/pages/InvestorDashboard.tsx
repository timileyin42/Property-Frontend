import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import LineChart from "../components/charts/LineChart";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import { Lock } from "lucide-react";
import {
  fetchInvestorInvestments,
  fetchPortfolioSummary,
  fetchInvestorInvestmentDetail,
  fetchPortfolioTrend,
} from "../api/investor.investments";
import type { Investment } from "../types/investment";
import type { ApiProperty } from "../types/property";
import {
  getPresignedUrl,
  getCachedPresignedUrl,
  isVideoUrl,
} from "../util/normalizeMediaUrl";

const percentFormatter = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 2,
});

const formatPercent = (value?: number) => {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "0";
  return percentFormatter.format(numeric);
};

const formatCurrency = (value?: number | null) =>
  typeof value === "number" ? `₦${value.toLocaleString()}` : "N/A";

// Donut palette — gold, teal, warm gold, cool blue, emerald
const ALLOC_PALETTE = ["#C9A84C", "#80d7b6", "#e6c364", "#c1c6db", "#1A7A5E"];

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentMediaMap, setInvestmentMediaMap] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState<{
    total?: number;
    total_initial_value: number;
    total_current_value: number;
    total_growth_percentage: number;
    total_fractions?: number;
    lifetime_investment_value?: number;
    lifetime_fractions?: number;
    properties_count?: number;
    avg_growth?: number;
    trend_labels?: string[];
    trend_values?: number[];
  } | null>(null);
  const [trend, setTrend] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  useEffect(() => {
    if (user?.full_name) {
      toast.success(`welcome ${user.full_name}`);
    }

    const loadInvestorData = async () => {
      try {
        setIsDashboardLoading(true);
        const [investmentRes, summaryRes, trendRes] = await Promise.all([
          fetchInvestorInvestments(),
          fetchPortfolioSummary(),
          fetchPortfolioTrend({ interval: "monthly", months: 6 }),
        ]);

        setInvestments(investmentRes.investments ?? []);
        setSummary(summaryRes ?? null);
        setTrend({
          labels: trendRes.trend_labels ?? [],
          values: trendRes.trend_values ?? [],
        });
      } catch (error) {
        console.error("Failed to fetch investor dashboard data:", error);
      } finally {
        setIsDashboardLoading(false);
      }
    };

    loadInvestorData();
  }, [user?.full_name]);

  useEffect(() => {
    const missingMedia = investments.filter((item) => {
      const cached = getCachedPresignedUrl(item.image_url || "");
      return !cached;
    });
    if (missingMedia.length === 0) return;

    const loadMedia = async () => {
      try {
        const entries = await Promise.all(
          missingMedia.map(async (item) => {
            const detail = await fetchInvestorInvestmentDetail(item.id);
            const property = detail.property as
              | (Partial<ApiProperty> & {
                  images?: string[];
                  videos?: string[];
                  media?: string[];
                  media_files?: Array<{ url?: string; file_url?: string; secure_url?: string }>;
                })
              | undefined;
            const urls = [
              detail.image_url,
              property?.primary_image,
              ...(property?.image_urls ?? []),
              ...(property?.media_urls ?? []),
              ...(property?.media_files?.map((file) => file.url ?? file.file_url ?? file.secure_url) ?? []),
              ...(property?.images ?? []),
              ...(property?.videos ?? []),
              ...(property?.media ?? []),
              property?.image_url,
            ].filter(Boolean) as string[];

            const resolved = (await Promise.all(
              urls.map((url) => getPresignedUrl(url))
            )).filter(Boolean) as string[];

            const imageFirst = resolved.find((url) => !isVideoUrl(url));
            const media = imageFirst ?? resolved[0] ?? "";
            return [item.id, media] as const;
          })
        );

        setInvestmentMediaMap((prev) => {
          const next = { ...prev };
          entries.forEach(([investmentId, media]) => {
            if (media) next[investmentId] = media;
          });
          return next;
        });
      } catch (error) {
        console.error("Failed to load investment media:", error);
      }
    };

    loadMedia();
  }, [investments]);

  const chartLabels = trend.labels;
  const chartValues = trend.values;
  const hasTrendData = chartLabels.length > 0 && chartValues.length > 0;

  const investmentCards = useMemo(
    () =>
      investments.map((investment) => {
        const fallbackMedia = investmentMediaMap[investment.id];
        const normalized =
          getCachedPresignedUrl(investment.image_url || "") ||
          getCachedPresignedUrl(fallbackMedia || "");
        return {
          ...investment,
          mediaUrl: normalized,
          isVideo: normalized ? isVideoUrl(normalized) : false,
        };
      }),
    [investments, investmentMediaMap]
  );

  const computedAverageGrowth =
    investments.length > 0
      ? investments.reduce(
          (sum, item) => sum + (Number(item.growth_percentage) || 0),
          0
        ) / investments.length
      : 0;

  const resolvedAverageGrowth = (() => {
    const summaryAverage = summary?.avg_growth;
    if (Number.isFinite(summaryAverage) && summaryAverage !== 0) {
      return summaryAverage as number;
    }
    if (computedAverageGrowth !== 0) {
      return computedAverageGrowth;
    }
    const summaryTotal = summary?.total_growth_percentage;
    if (Number.isFinite(summaryTotal)) {
      return summaryTotal;
    }
    return 0;
  })();

  const lifetimeInvestmentValue = Number(summary?.lifetime_investment_value ?? 0);
  const showLifetimeInvestment =
    Number.isFinite(lifetimeInvestmentValue) && lifetimeInvestmentValue > 0;

  // ----- Real portfolio figures for the four summary cards -----
  const computedInitial = investments.reduce(
    (sum, item) => sum + (item.initial_value ?? 0),
    0
  );
  const computedCurrent = investments.reduce(
    (sum, item) => sum + (item.current_value ?? 0),
    0
  );
  const totalInvested = showLifetimeInvestment
    ? lifetimeInvestmentValue
    : summary?.total_initial_value ?? computedInitial;
  const currentValue = summary?.total_current_value ?? computedCurrent;
  const totalInitial = summary?.total_initial_value ?? computedInitial;
  const totalReturns = currentValue - totalInitial;
  const activeProperties = summary?.properties_count ?? investments.length;
  const appreciationPct =
    summary?.total_growth_percentage ?? resolvedAverageGrowth;

  // ----- Allocation donut (by property, real values) -----
  const allocation = useMemo(() => {
    const totalVal = investments.reduce((s, i) => s + (i.current_value ?? 0), 0);
    if (!totalVal) return [] as Array<{ label: string; pct: number; color: string }>;
    return [...investments]
      .sort((a, b) => (b.current_value ?? 0) - (a.current_value ?? 0))
      .slice(0, 5)
      .map((inv, idx) => ({
        label: inv.property_title,
        pct: ((inv.current_value ?? 0) / totalVal) * 100,
        color: ALLOC_PALETTE[idx % ALLOC_PALETTE.length],
      }));
  }, [investments]);

  const donutGradient = useMemo(() => {
    if (allocation.length === 0) return "";
    let acc = 0;
    const stops = allocation.map((seg) => {
      const start = acc;
      acc += seg.pct;
      return `${seg.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [allocation]);

  // Featured asset = largest holding
  const featured = useMemo(
    () =>
      [...investmentCards].sort(
        (a, b) => (b.current_value ?? 0) - (a.current_value ?? 0)
      )[0],
    [investmentCards]
  );

  const summaryCards = [
    {
      id: 1,
      title: "Total Invested",
      value: `₦${Number(totalInvested || 0).toLocaleString()}`,
      sub: showLifetimeInvestment ? "Lifetime invested" : "Capital deployed",
      subAccent: "text-success-emerald",
      valueAccent: "text-premium-gold",
    },
    {
      id: 2,
      title: "Current Value",
      value: `₦${Number(currentValue || 0).toLocaleString()}`,
      sub: `+${formatPercent(appreciationPct)}% total appreciation`,
      subAccent: "text-success-emerald",
      valueAccent: "text-on-surface",
    },
    {
      id: 3,
      title: "Total Returns",
      value: `₦${Number(totalReturns || 0).toLocaleString()}`,
      sub: "Realized & Unrealized",
      subAccent: "text-on-surface-variant",
      valueAccent: totalReturns >= 0 ? "text-success-emerald" : "text-error",
    },
    {
      id: 4,
      title: "Active Properties",
      value: `${activeProperties} Asset${activeProperties === 1 ? "" : "s"}`,
      sub: `${summary?.total_fractions ?? investments.reduce((s, i) => s + (i.fractions_owned ?? 0), 0)} fractions owned`,
      subAccent: "text-on-surface-variant",
      valueAccent: "text-on-surface",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
        ]}
      />
      <Toaster position="top-right" />

      <main className="pt-32 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="relative space-y-6">
          {/* Locked overlay */}
          {!isDashboardLoading && investments.length === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-center glass-panel rounded-xl p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-premium-gold/10 text-premium-gold">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl text-on-surface">Portfolio Locked</h3>
                <p className="text-sm text-on-surface-variant max-w-sm">
                  Your dashboard will unlock after your first investment. Browse
                  properties to get started.
                </p>
                <Link to="/properties" className="btn-gold px-6 py-2.5 text-[12px] mt-2">
                  Browse Properties
                </Link>
              </div>
            </div>
          )}

          {/* Greeting + badges */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-display text-4xl text-on-surface">
                Welcome back,{" "}
                <span className="text-premium-gold">{user?.full_name ?? "Investor"}</span>
              </h1>
              <p className="text-on-surface-variant mt-1">
                Track your investments and property performance.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full">
                <span
                  className="material-symbols-outlined text-success-emerald text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="label-caps text-[10px]">KYC Verified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full">
                <span
                  className="material-symbols-outlined text-premium-gold text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  workspace_premium
                </span>
                <span className="label-caps text-[10px]">Investor</span>
              </div>
            </div>
          </section>

          {/* Summary cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card) => (
              <div key={card.id} className="glass-panel glass-panel-hover p-6 rounded-xl flex flex-col gap-4">
                <span className="label-caps text-on-surface-variant">{card.title}</span>
                <div className="flex flex-col">
                  <span className={`data-stat text-2xl ${card.valueAccent}`}>{card.value}</span>
                  <span className={`text-[12px] mt-1 ${card.subAccent}`}>{card.sub}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Bento: allocation donut + portfolio growth */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Allocation donut */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-xl space-y-6 flex flex-col">
              <h3 className="font-display text-2xl text-on-surface">Asset Allocation</h3>
              {allocation.length > 0 ? (
                <>
                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ background: donutGradient }}
                    />
                    <div className="absolute inset-[18%] rounded-full bg-surface flex flex-col items-center justify-center">
                      <span className="data-stat text-2xl">{investments.length}</span>
                      <span className="label-caps text-[10px] text-on-surface-variant">
                        Properties
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {allocation.map((seg) => (
                      <div key={seg.label} className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-3 h-3 rounded-sm shrink-0"
                            style={{ backgroundColor: seg.color }}
                          />
                          <span className="text-sm truncate">{seg.label}</span>
                        </div>
                        <span className="data-stat text-sm shrink-0">
                          {seg.pct.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  Allocation appears once you hold investments.
                </p>
              )}
            </div>

            {/* Portfolio growth chart */}
            <div className="lg:col-span-2 glass-panel rounded-xl flex flex-col">
              <div className="p-6 border-b border-[rgba(248,246,241,0.15)] flex justify-between items-center">
                <h3 className="font-display text-2xl text-on-surface">Portfolio Growth</h3>
                <span className="label-caps text-[10px] text-on-surface-variant">6 Months</span>
              </div>
              <div className="p-6 flex-1">
                {hasTrendData ? (
                  <LineChart labels={chartLabels} data={chartValues} />
                ) : (
                  <p className="text-sm text-on-surface-variant">
                    Portfolio growth data isn&apos;t available yet.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Featured asset highlight */}
          {featured && (
            <section className="glass-panel rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full relative overflow-hidden group bg-surface-high">
                  {featured.mediaUrl ? (
                    featured.isVideo ? (
                      <video
                        className="w-full h-full object-cover"
                        src={featured.mediaUrl}
                        muted
                        playsInline
                        loop
                        autoPlay
                      />
                    ) : (
                      <img
                        src={featured.mediaUrl}
                        alt={featured.property_title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">
                      Media unavailable
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
                </div>
                <div className="p-6 md:p-8 space-y-5 flex flex-col justify-center">
                  <span className="label-caps text-premium-gold">Featured Portfolio Asset</span>
                  <h2 className="font-display text-2xl text-on-surface">
                    {featured.property_title}
                  </h2>
                  <p className="text-on-surface-variant">{featured.property_location}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block label-caps text-[10px] text-on-surface-variant mb-1">
                        Growth
                      </span>
                      <span className="data-stat text-xl text-success-emerald">
                        +{formatPercent(featured.growth_percentage)}%
                      </span>
                    </div>
                    <div>
                      <span className="block label-caps text-[10px] text-on-surface-variant mb-1">
                        Your Holding
                      </span>
                      <span className="data-stat text-xl">
                        {formatCurrency(featured.current_value ?? null)}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/investor/investments/${featured.id}`}
                    state={{ fractionsOwned: featured.fractions_owned }}
                    className="btn-ghost w-fit px-8 py-3 label-caps text-premium-gold"
                  >
                    Asset Details
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* My investments grid */}
          <section className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-on-surface">My Investments</h2>
              <span className="text-sm text-on-surface-variant">
                {investments.length} investment{investments.length === 1 ? "" : "s"}
              </span>
            </div>

            {investmentCards.length === 0 ? (
              <div className="glass-panel rounded-xl p-6 text-sm text-on-surface-variant">
                No investments found yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investmentCards.map((investment) => {
                  const fractionsOwned = investment.fractions_owned ?? 0;
                  const fractionsSold =
                    investment.fractions_sold ?? investment.fractions_removed ?? 0;
                  const soldTotal = fractionsOwned + fractionsSold;

                  return (
                    <div
                      key={investment.id}
                      className="glass-panel glass-panel-hover rounded-xl overflow-hidden"
                    >
                      <div className="h-40 bg-surface-high">
                        {investment.mediaUrl ? (
                          investment.isVideo ? (
                            <video
                              className="w-full h-full object-cover"
                              src={investment.mediaUrl}
                              muted
                              playsInline
                              loop
                              autoPlay
                            />
                          ) : (
                            <img
                              src={investment.mediaUrl}
                              alt={investment.property_title}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-on-surface-variant">
                            Media unavailable
                          </div>
                        )}
                      </div>
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-display text-lg text-on-surface">
                            {investment.property_title}
                          </h3>
                          <p className="text-sm text-on-surface-variant">
                            {investment.property_location}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm py-3 border-y border-[rgba(248,246,241,0.12)]">
                          <div>
                            <p className="label-caps text-[10px] text-on-surface-variant mb-1">
                              Initial Value
                            </p>
                            <p className="data-stat text-sm">
                              {formatCurrency(investment.initial_value ?? null)}
                            </p>
                          </div>
                          <div>
                            <p className="label-caps text-[10px] text-on-surface-variant mb-1">
                              Current Value
                            </p>
                            <p className="data-stat text-sm">
                              {formatCurrency(investment.current_value ?? null)}
                            </p>
                          </div>
                          <div>
                            <p className="label-caps text-[10px] text-on-surface-variant mb-1">
                              Growth
                            </p>
                            <p className="data-stat text-sm text-success-emerald">
                              +{formatPercent(investment.growth_percentage)}%
                            </p>
                          </div>
                          <div>
                            <p className="label-caps text-[10px] text-on-surface-variant mb-1">
                              Fractions
                            </p>
                            <p className="data-stat text-sm">{fractionsOwned}</p>
                          </div>
                        </div>
                        {fractionsSold > 0 && (
                          <p className="text-xs text-tertiary bg-premium-gold/10 border border-premium-gold/30 rounded px-2 py-1">
                            {fractionsOwned === 0
                              ? `Sold all ${soldTotal} fractions in ${investment.property_title}.`
                              : `Sold ${fractionsSold} fractions in ${investment.property_title}.`}
                          </p>
                        )}
                        <Link
                          to={`/investor/investments/${investment.id}`}
                          state={{ fractionsOwned: investment.fractions_owned }}
                          className="btn-ghost inline-flex items-center justify-center px-4 py-2 text-[11px] label-caps text-on-surface"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default InvestorDashboard;
