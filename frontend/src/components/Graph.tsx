import React from "react";
import { Line } from "react-chartjs-2";

type GraphProps = {
  metric: string;
  data: { date: string; value: number }[];
};

const Graph: React.FC<GraphProps> = ({ metric, data }) => {
  const dates = data.map((entry) => entry.date);
  const dataPoints = data.map((entry) => entry.value);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: metric.replace(/_/g, " "),
        data: dataPoints,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Workout Metrics",
      },
    },
  };

  return (
    <div className="border relative h-full w-full bg-gray-200 dark:bg-gray-300">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Graph;
