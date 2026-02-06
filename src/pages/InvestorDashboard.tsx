
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
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
import {useState, useEffect, useMemo} from "react";
import { Lock } from "lucide-react";
import { fetchInvestorInvestments, fetchPortfolioSummary, fetchInvestorInvestmentDetail, fetchPortfolioTrend } from "../api/investor.investments";
import type { Investment } from "../types/investment";
import type { ApiProperty } from "../types/property";
import { getPresignedUrl, getCachedPresignedUrl, isVideoUrl } from "../util/normalizeMediaUrl";


// import { ReactNode } from "react";

export interface PortfolioStat {
  id: number;
  title: string;
  value: string | number;
  description: string;
}

const percentFormatter = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 2,
});

const formatPercent = (value?: number) => {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "0";
  return percentFormatter.format(numeric);
};

const InvestorDashboard = () => {
  const {user} = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentMediaMap, setInvestmentMediaMap] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState<{
    total: number;
    total_initial_value: number;
    total_current_value: number;
    total_growth_percentage: number;
    total_fractions_owned?: number;
    properties_count?: number;
    average_growth_percentage?: number;
    trend_labels?: string[];
    trend_values?: number[];
  } | null>(null);
  const [trend, setTrend] = useState<{ labels: string[]; values: number[] }>(
    { labels: [], values: [] }
  );
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
    const summaryAverage = summary?.average_growth_percentage;
    if (Number.isFinite(summaryAverage) && summaryAverage !== 0) {
      return summaryAverage;
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

  const portfolioStats: PortfolioStat[] = [
    {
      id: 1,
      title: "Total Investment",
      value: (() => {
        const computedTotal = investments.reduce(
          (sum, item) => sum + (item.current_value ?? 0),
          0
        );
        const totalValue = summary?.total_current_value ?? computedTotal;
        return `₦${Number(totalValue || 0).toLocaleString()}`;
      })(),
      description: summary
        ? `+${formatPercent(summary.total_growth_percentage)}% overall`
        : "+0% overall",
    },
    {
      id: 2,
      title: "Fractions Owned",
      value:
        summary?.total_fractions_owned ??
        investments.reduce(
          (sum, item) => sum + (item.fractions_owned ?? 0),
          0
        ),
      description: summary?.properties_count
        ? `Across ${summary.properties_count} properties`
        : "Across 0 properties",
    },
    {
      id: 3,
      title: "Properties",
      value: summary?.properties_count ?? investments.length,
      description: "Active investments",
    },
    {
      id: 4,
      title: "Avg. Growth",
      value: `+${formatPercent(resolvedAverageGrowth)}%`,
      description: "6 month average",
    },
  ];
 
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
      <div className="relative">
        {!isDashboardLoading && investments.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900">
                Portfolio Locked
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Your dashboard will unlock after your first investment. Browse
                properties to get started.
              </p>
            </div>
          </div>
        )}

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

                  <p
                    className={`text-2xl font-semibold ${
                      isLast ? "text-green-600" : "text-blue-900"
                    }`}
                  >
                    {item.value}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </section>
        {/* ===== GRAPH SECTION (Placeholder) ===== */}
      {investments.length > 0 && (
        <section className="my-12 w-full border border-gray-300 p-6 rounded-xl">
          <h2 className="font-bold text-blue-900 text-lg mb-2">
            Portfolio Growth
          </h2>
          {hasTrendData ? (
            <div className=" rounded-xl  flex w-full text-gray-400 p-4">
              <LineChart labels={chartLabels} data={chartValues} />
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Portfolio growth data isn&apos;t available yet.
            </p>
          )}
        </section>
      )}

      {/* ===== AVAILABLE PROPERTIES / STATS ===== */}
        <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-blue-900 text-lg">My Investments</h2>
          <span className="text-sm text-gray-500">
            {investments.length} investment(s)
          </span>
        </div>

        {investmentCards.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
            No investments found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentCards.map((investment) => (
              <div
                key={investment.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="h-40 bg-gray-100">
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
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                      Media unavailable
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {investment.property_title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {investment.property_location}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Initial Value</p>
                      <p className="font-semibold">
                        ₦{investment.initial_value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Current Value</p>
                      <p className="font-semibold">
                        ₦{investment.current_value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Growth</p>
                      <p className="font-semibold text-emerald-600">
                        +{formatPercent(investment.growth_percentage)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Fractions</p>
                      <p className="font-semibold">{investment.fractions_owned}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/investor/investments/${investment.id}`}
                      state={{ fractionsOwned: investment.fractions_owned }}
                      className="inline-flex items-center justify-center rounded-md border border-blue-900 px-3 py-2 text-xs font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
                    >
                      View investment details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </section>
      </div>
    </div>
  );
};

export default InvestorDashboard;
