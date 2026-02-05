import { useDashboard } from "../../context/dashboard.context";
const DashboardStats = () => {
  const { stats, loading } = useDashboard();

  if (loading) return <p className="text-gray-400">Loading stats...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      {stats.map((item, index) => {
        const isLast = index === stats.length - 1;

        return (
          <div
            key={item.id}
            className="border border-gray-200 bg-white shadow-lg rounded-xl"
          >
            <div>

            </div>
            <div className="p-8 flex flex-col gap-4">
              <h3 className="text-gray-400">{item.title}</h3>
              <p
                className={`text-2xl font-semibold ${
                  isLast ? "text-green-600" : "text-blue-900"
                }`}
              >
                {item.value}
              </p>
              {item.title !== "Active Properties" && (
                <p className="text-gray-400 text-sm">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
