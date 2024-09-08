import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useCallback, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import useCategories from "../hooks/useCategories";
import useWorkoutData from "../hooks/useWorkoutData";
import { SetGroup, Workout } from "../types";
import { calculateEndDate } from "../utils/DateUtils";
import DateInput from "./UI/DateInput";
import SelectField from "./UI/SelectField";
import StatCard from "./UI/StatCard";
import Table from "./UI/Table";

ChartJS.register(ArcElement, Tooltip, Legend);

const WorkoutBreakdown: React.FC = () => {
  const [breakdown, setBreakdown] = useState("Number of Sets");
  const [period, setPeriod] = useState("Week");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("");

  const { categories } = useCategories();

  useEffect(() => {
    setEndDate(calculateEndDate(startDate, period));
  }, [startDate, period]);

  const { workoutData } = useWorkoutData(startDate, endDate);

  const filterWorkoutsByDate = (data: Workout[]) => {
    return data.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate >= new Date(startDate) && workoutDate <= new Date(endDate)
      );
    });
  };

  const parseWorkoutData = useCallback(
    (data: Workout[]) => {
      const categoriesMap: { [key: string]: number } = {};
      let totalSets = 0;
      let totalReps = 0;
      let totalVolume = 0;

      categories.forEach((category) => {
        categoriesMap[category.name] = 0;
      });

      data.forEach((workout: Workout) => {
        workout.set_groups.forEach((setGroup: SetGroup) => {
          const { exercise_name, sets } = setGroup;
          if (exercise_name && categoriesMap[exercise_name] !== undefined) {
            if (breakdown === "Number of Sets") {
              categoriesMap[exercise_name] += sets.length;
              totalSets += sets.length;
            } else if (breakdown === "Number of Reps") {
              const reps = sets.reduce(
                (sum: number, set: { reps: number }) => sum + set.reps,
                0
              );
              categoriesMap[exercise_name] += reps;
              totalReps += reps;
            } else if (breakdown === "Total Volume") {
              const volume = sets.reduce(
                (sum: number, set: { reps: number; weight: number }) =>
                  sum + set.reps * set.weight,
                0
              );
              categoriesMap[exercise_name] += volume;
              totalVolume += volume;
            }
          }
        });
      });

      return { categoriesMap, totalSets, totalReps, totalVolume };
    },
    [categories, breakdown]
  );

  // Filter the workout data
  const filteredWorkouts = filterWorkoutsByDate(workoutData);
  const { categoriesMap, totalSets, totalReps, totalVolume } =
    parseWorkoutData(filteredWorkouts);

  const data = {
    labels: Object.keys(categoriesMap),
    datasets: [
      {
        label: `# of ${breakdown}`,
        data: Object.values(categoriesMap),
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"],
        hoverBackgroundColor: ["#66BB6A", "#42A5F5", "#FFB74D", "#BA68C8"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col items-center p-4 border-2 w-full h-full bg-gray-100 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Workout Breakdown</h1>

      <div className="flex flex-col lg:flex-row w-full justify-between">
        <SelectField
          id="breakdown"
          label="BREAKDOWN"
          value={breakdown}
          onChange={useCallback(
            (e: React.ChangeEvent<HTMLSelectElement>) =>
              setBreakdown(e.target.value),
            []
          )}
          options={["Number of Sets", "Number of Reps", "Total Volume"]}
        />
        <SelectField
          id="period"
          label="PERIOD"
          value={period}
          onChange={useCallback(
            (e: React.ChangeEvent<HTMLSelectElement>) =>
              setPeriod(e.target.value),
            []
          )}
          options={["Week", "Month", "Year"]}
        />
        <DateInput
          id="date"
          label="DATE"
          value={startDate}
          onChange={useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) =>
              setStartDate(e.target.value),
            []
          )}
        />
      </div>

      <div className="mb-4">
        <p>
          Selected Date Range: {startDate} - {endDate}
        </p>
      </div>

      <div className="w-64 h-64 mb-6">
        <Doughnut data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <StatCard title="TOTAL WORKOUTS" value={filteredWorkouts.length} />
        <StatCard
          title={`TOTAL ${breakdown.toUpperCase()}`}
          value={
            breakdown === "Number of Sets"
              ? totalSets
              : breakdown === "Number of Reps"
              ? totalReps
              : totalVolume
          }
        />
      </div>

      <Table data={categoriesMap} breakdown={breakdown} />
    </div>
  );
};

export default WorkoutBreakdown;
