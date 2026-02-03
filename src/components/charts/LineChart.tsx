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
        label: "Revenue",
        data,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        borderColor: "rgba(30, 58, 138, 1)",
        pointBackgroundColor: "#fff",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        
      },
      title: {
        display: true,
        // text: "Monthly Revenue",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
