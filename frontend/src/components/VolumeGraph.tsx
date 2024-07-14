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
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../api";
import { Workout } from "../types";

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

type AggregatedData = {
  [key: string]: {
    volume: number;
    sets: number;
    reps: number;
    count: number;
  };
};

type MetricData = {
  date: string;
  volume: number;
  sets: number;
  reps: number;
};

const VolumeGraph: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [timeInterval, setTimeInterval] = useState<string>("1month");
  const [metric, setMetric] = useState<string>("volume_per_workout");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get<Workout[]>("/api/workouts");
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts", error);
      }
    };

    fetchWorkouts();
  }, []);

  const calculateVolume = (workout: Workout) => {
    return workout.set_groups.reduce((workoutTotal, setGroup) => {
      const setGroupVolume = setGroup.sets.reduce((setTotal, set) => {
        return setTotal + set.reps * set.weight;
      }, 0);
      return workoutTotal + setGroupVolume;
    }, 0);
  };

  const calculateSets = (workout: Workout) => {
    return workout.set_groups.reduce((workoutTotal, setGroup) => {
      return workoutTotal + setGroup.sets.length;
    }, 0);
  };

  const calculateReps = (workout: Workout) => {
    return workout.set_groups.reduce((workoutTotal, setGroup) => {
      const setGroupReps = setGroup.sets.reduce((setTotal, set) => {
        return setTotal + set.reps;
      }, 0);
      return workoutTotal + setGroupReps;
    }, 0);
  };

  const filterWorkouts = () => {
    const now = new Date();
    let filteredWorkouts = workouts;
    switch (timeInterval) {
      case "1month":
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          return (
            workoutDate >=
            new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          );
        });
        break;
      case "3month":
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          return (
            workoutDate >=
            new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          );
        });
        break;
      case "6month":
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          return (
            workoutDate >=
            new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
          );
        });
        break;
      case "1year":
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          return (
            workoutDate >=
            new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          );
        });
        break;
      case "all":
        break;
      default:
        break;
    }
    return filteredWorkouts;
  };

  const aggregateData = (workouts: Workout[], interval: string) => {
    const aggregated: AggregatedData = {};

    workouts.forEach((workout) => {
      const date = new Date(workout.date);
      const week = Math.ceil(date.getDate() / 7);
      let key: string;

      switch (interval) {
        case "monthly":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case "weekly":
          key = `${date.getFullYear()}-${date.getMonth() + 1}-W${week}`;
          break;
        case "yearly":
          key = `${date.getFullYear()}`;
          break;
        default:
          key = workout.date;
      }

      if (!aggregated[key]) {
        aggregated[key] = { volume: 0, sets: 0, reps: 0, count: 0 };
      }

      aggregated[key].volume += calculateVolume(workout);
      aggregated[key].sets += calculateSets(workout);
      aggregated[key].reps += calculateReps(workout);
      aggregated[key].count += 1;
    });

    return Object.entries(aggregated).map(([date, data]) => {
      const { volume, sets, reps, count } = data;
      return {
        date,
        volume: volume / (metric.includes("per_workout") ? count : 1),
        sets: sets / (metric.includes("per_workout") ? count : 1),
        reps: reps / (metric.includes("per_workout") ? count : 1),
      };
    });
  };

  const getDataForMetric = (data: MetricData) => {
    switch (metric) {
      case "volume_per_workout":
      case "volume_per_month":
      case "volume_per_week":
      case "volume_per_year":
        return data.volume;
      case "sets_per_workout":
      case "sets_per_month":
      case "sets_per_week":
      case "sets_per_year":
        return data.sets;
      case "reps_per_workout":
      case "reps_per_month":
      case "reps_per_week":
      case "reps_per_year":
        return data.reps;
      default:
        return 0;
    }
  };

  const filteredWorkouts = filterWorkouts();

  const interval = metric.includes("per_month")
    ? "monthly"
    : metric.includes("per_week")
    ? "weekly"
    : metric.includes("per_year")
    ? "yearly"
    : "daily";

  const aggregatedData = aggregateData(filteredWorkouts, interval);
  const dates = aggregatedData.map((data) => data.date);
  const dataPoints = aggregatedData.map((data) => getDataForMetric(data));

  const data = {
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
    <div className="p-4 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 flex flex-col h-full w-full">
      <h1 className="text-2xl font-bold mb-4">Workout Metrics</h1>
      <div className="mb-4">
        <select
          className="border dark:border-gray-500 dark:bg-gray-700 p-2 mr-2"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <optgroup label="WORKOUT GRAPHS">
            <option value="volume_per_workout">Volume per workout</option>
            <option value="sets_per_workout">Sets per workout</option>
            <option value="reps_per_workout">Reps per workout</option>
          </optgroup>
          <optgroup label="MONTHLY GRAPHS">
            <option value="volume_per_month">Volume per month</option>
            <option value="sets_per_month">Sets per month</option>
            <option value="reps_per_month">Reps per month</option>
          </optgroup>
          <optgroup label="WEEKLY GRAPHS">
            <option value="volume_per_week">Volume per week</option>
            <option value="sets_per_week">Sets per week</option>
            <option value="reps_per_week">Reps per week</option>
          </optgroup>
          <optgroup label="YEARLY GRAPHS">
            <option value="volume_per_year">Volume per year</option>
            <option value="sets_per_year">Sets per year</option>
            <option value="reps_per_year">Reps per year</option>
          </optgroup>
        </select>
        <select
          className="border dark:border-gray-500 p-2 dark:bg-gray-700"
          value={timeInterval}
          onChange={(e) => setTimeInterval(e.target.value)}
        >
          <option value="1month">1 Month</option>
          <option value="3month">3 Months</option>
          <option value="6month">6 Months</option>
          <option value="1year">1 Year</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="border relative h-full w-full bg-gray-200 dark:bg-gray-300">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default VolumeGraph;
