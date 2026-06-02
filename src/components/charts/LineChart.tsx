import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

interface LineChartProps {
  labels: string[];
  data: number[];
}

const LineChart: React.FC<LineChartProps> = ({ labels, data }) => {
  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Portfolio Value",
        data,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        borderColor: "#1A7A5E",
        backgroundColor: "rgba(26, 122, 94, 0.12)",
        pointBackgroundColor: "#C9A84C",
        pointBorderColor: "#C9A84C",
        pointRadius: 3,
      },
    ],
  };

  const tick = { color: "#c6c6cd", font: { family: "JetBrains Mono", size: 11 } };
  const grid = { color: "rgba(248, 246, 241, 0.08)" };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 15, 12, 0.9)",
        borderColor: "rgba(201, 168, 76, 0.4)",
        borderWidth: 1,
        titleColor: "#e4e2dd",
        bodyColor: "#c6c6cd",
      },
    },
    scales: {
      x: { ticks: tick, grid: { ...grid, display: false } },
      y: { ticks: tick, grid },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
