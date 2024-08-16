import { useEffect, useState } from "react";
import api from "../api";
import { Workout } from "../types";
import MonthsContainer from "./Containers/MonthsContainer";

// interface Workout {
//   date: string;
//   set_groups: SetGroup[];
// }

const YearCalendar = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/workouts/?year=${year}`)
      .then((response) => {
        setWorkouts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workouts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    setYear(year + 1);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full text-2xl py-3 dark:bg-gray-700 bg-gray-200 text-black dark:text-white border-b-4 border-sky-500">
        <div className="w-fit ml-auto mr-auto flex items-center">
          <button
            onClick={handlePreviousYear}
            className="px-3 w-32 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Previous
          </button>
          <h2 className="mx-5 text-2xl">{year}</h2>
          <button
            onClick={handleNextYear}
            className="px-3 w-32 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid h-[calc(100vh-68px)] overflow-y-scroll p-2 gap-1 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-rows-[repeat(auto-fit,minmax(250px,1fr))]">
            <MonthsContainer months={months} workouts={workouts} year={year} />
          </div>
        )}
      </div>
    </div>
  );
};

export default YearCalendar;
