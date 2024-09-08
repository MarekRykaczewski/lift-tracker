import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { useFetchWorkouts } from "../hooks/useFetchWorkouts";
import { aggregateData, filterWorkouts } from "../utils/WorkoutUtils";
import FilterControls from "./FilterControls";
import Graph from "./Graph";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const VolumeGraph: React.FC = () => {
  const [timeInterval, setTimeInterval] = React.useState<string>("1month");
  const [metric, setMetric] = React.useState<string>("volume_per_workout");
  const { workouts, isLoading, error } = useFetchWorkouts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  const filteredWorkouts = filterWorkouts(workouts, timeInterval);
  const interval = metric.includes("per_month")
    ? "monthly"
    : metric.includes("per_week")
    ? "weekly"
    : metric.includes("per_year")
    ? "yearly"
    : "daily";
  const aggregatedData = aggregateData(filteredWorkouts, interval, metric);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 border-2 dark:border-gray-700 flex flex-col h-full w-full">
      <h1 className="text-2xl font-bold mb-4">Workout Metrics</h1>
      <FilterControls
        timeInterval={timeInterval}
        metric={metric}
        setTimeInterval={setTimeInterval}
        setMetric={setMetric}
      />
      <Graph metric={metric} data={aggregatedData} />
    </div>
  );
};

export default VolumeGraph;
