import {
  CategoryScale,
  Chart as ChartJS,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Set {
  id: number;
  order: number;
  reps: number;
  weight: number;
}

interface SetGroup {
  id: number;
  workout: number;
  exercise: number;
  exercise_name: string;
  order: number;
  sets: Set[];
}

interface Workout {
  id: number;
  date: string;
  notes: string | null;
  set_groups: SetGroup[];
}

const VolumeGraph: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [timeInterval, setTimeInterval] = useState<string>("1month");

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
      default:
        break;
    }
    return filteredWorkouts;
  };

  const filteredWorkouts = filterWorkouts();
  const dates = filteredWorkouts.map((workout) => workout.date);
  const volumes = filteredWorkouts.map((workout) => calculateVolume(workout));

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Volume",
        data: volumes,
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Volume per Workout",
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Volume per Workout</h1>
      <div className="mb-4">
        <select
          className="border rounded p-2"
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
      <Line data={data} options={options} />
    </div>
  );
};

export default VolumeGraph;
