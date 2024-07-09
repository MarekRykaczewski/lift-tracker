import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import api from "../api";
import { SetGroup, Workout } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Category {
  id: number;
  name: string;
}

const WorkoutBreakdown: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<Workout[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breakdown, setBreakdown] = useState("Number of Sets");
  const [period, setPeriod] = useState("Week");
  const [startDate, setStartDate] = useState("2024-07-08");
  const [endDate, setEndDate] = useState("");
  const [totalSets, setTotalSets] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/exercises");
        setCategories(response.data);
      } catch (error) {
        console.error("There was an error fetching the categories!", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const calculateEndDate = (
      startDate: string | number | Date,
      period: string
    ) => {
      const start = new Date(startDate);
      let end;
      switch (period) {
        case "Week":
          end = new Date(start);
          end.setDate(start.getDate() + 6);
          break;
        case "Month":
          end = new Date(start);
          end.setMonth(start.getMonth() + 1);
          break;
        case "Year":
          end = new Date(start);
          end.setFullYear(start.getFullYear() + 1);
          break;
        default:
          end = start;
      }
      return end.toISOString().split("T")[0];
    };

    const newEndDate = calculateEndDate(startDate, period);
    setEndDate(newEndDate);
  }, [startDate, period]);

  useEffect(() => {
    api
      .get("/api/workouts/")
      .then((response) => {
        setWorkoutData(response.data);

        // Calculate total sets
        const totalSetsCount = response.data.reduce(
          (total: number, workout: Workout) =>
            total +
            workout.set_groups.reduce(
              (sum: number, group: SetGroup) => sum + group.sets.length,
              0
            ),
          0
        );
        setTotalSets(totalSetsCount);
      })
      .catch((error) => {
        console.error("There was an error fetching the workout data!", error);
      });
  }, [startDate, endDate]);

  const parseWorkoutData = (data: Workout[]) => {
    const categoriesMap: { [key: string]: number } = {};

    categories.forEach((category) => {
      categoriesMap[category.name] = 0;
    });

    data.forEach((workout: Workout) => {
      const workoutDate = new Date(workout.date);
      if (
        workoutDate >= new Date(startDate) &&
        workoutDate <= new Date(endDate)
      ) {
        workout.set_groups.forEach((setGroup: SetGroup) => {
          const { exercise_name, sets } = setGroup;

          if (exercise_name && categoriesMap[exercise_name] !== undefined) {
            if (breakdown === "Number of Sets") {
              categoriesMap[exercise_name] += sets.length;
            } else if (breakdown === "Number of Reps") {
              categoriesMap[exercise_name] += sets.reduce(
                (sum: number, set: { reps: number }) => sum + set.reps,
                0
              );
            } else if (breakdown === "Total Volume") {
              categoriesMap[exercise_name] += sets.reduce(
                (sum: number, set: { reps: number; weight: number }) =>
                  sum + set.reps * set.weight,
                0
              );
            }
          }
        });
      }
    });

    return categoriesMap;
  };

  const workoutCounts = parseWorkoutData(workoutData);

  const sumOfBreakdownValues = Object.values(workoutCounts).reduce(
    (a, b) => a + b,
    0
  );

  const data = {
    labels: Object.keys(workoutCounts),
    datasets: [
      {
        label: `# of ${breakdown}`,
        data: Object.values(workoutCounts),
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

  const handleBreakdownChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setBreakdown(e.target.value);
  const handlePeriodChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setPeriod(e.target.value);
  const handleStartDateChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setStartDate(e.target.value);

  return (
    <div className="flex flex-col items-center p-4 border w-full lg:w-1/2 mx-auto bg-white dark:bg-gray-700 dark:border-gray-500 shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Workout Breakdown</h1>

      <div className="flex flex-col lg:flex-row w-full mb-6 justify-between">
        <div className="mb-4 lg:mb-0">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="breakdown"
          >
            BREAKDOWN
          </label>
          <select
            id="breakdown"
            value={breakdown}
            onChange={handleBreakdownChange}
            className="block appearance-none w-full dark:bg-gray-700 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Number of Sets">Number of Sets</option>
            <option value="Number of Reps">Number of Reps</option>
            <option value="Total Volume">Total Volume</option>
          </select>
        </div>

        <div className="mb-4 lg:mb-0">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="period"
          >
            PERIOD
          </label>
          <select
            id="period"
            value={period}
            onChange={handlePeriodChange}
            className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
        </div>

        <div className="mb-4 lg:mb-0">
          <label
            className="block text-gray-700  dark:text-white text-sm font-bold mb-2"
            htmlFor="date"
          >
            DATE
          </label>
          <input
            type="date"
            id="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="appearance-none w-full bg-white dark:bg-gray-700 border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
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
        <div className="text-center border p-2">
          <h2 className="font-bold">TOTAL WORKOUTS</h2>
          <p className="text-blue-500 text-xl">{workoutData.length}</p>
        </div>
        <div className="text-center border p-2">
          <h2 className="font-bold">TOTAL SETS</h2>
          <p className="text-blue-500 text-xl">{totalSets}</p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">{breakdown}</th>
              <th className="border px-4 py-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(workoutCounts).map((label, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{label}</td>
                <td className="border px-4 py-2">{workoutCounts[label]}</td>
                <td className="border px-4 py-2">
                  {sumOfBreakdownValues > 0
                    ? (
                        (workoutCounts[label] / sumOfBreakdownValues) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkoutBreakdown;
