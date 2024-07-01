import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { SetGroup } from "../types";

interface Workout {
  date: string;
  set_groups: SetGroup[];
}

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
    <div className="flex flex-col items-center p-5">
      <div className="flex items-center mb-5">
        <button
          onClick={handlePreviousYear}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Previous
        </button>
        <h2 className="mx-5 text-2xl">{year}</h2>
        <button
          onClick={handleNextYear}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {months.map((month, index) => (
            <MonthView
              key={index}
              month={month}
              year={year}
              monthIndex={index}
              workouts={workouts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MonthView = ({
  month,
  year,
  monthIndex,
  workouts,
}: {
  month: string;
  year: number;
  monthIndex: number;
  workouts: Workout[];
}) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, monthIndex);

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getWorkoutsForDay = (day: number) => {
    return workouts.some((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getFullYear() === year &&
        workoutDate.getMonth() === monthIndex &&
        workoutDate.getDate() === day &&
        workout.set_groups &&
        workout.set_groups.length > 0
      );
    });
  };

  return (
    <div className="flex flex-col items-center border-2 dark:border-gray-500 dark:bg-gray-700 rounded-lg p-3 bg-gray-100">
      <h3 className="mb-3 text-lg">{month}</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const hasWorkout = getWorkoutsForDay(day);

          return (
            <Link
              key={day}
              className="relative dark:bg-gray-800 overflow-hidden w-8 h-8 flex flex-col items-center justify-center bg-white border-2 dark:border-gray-500 rounded-md"
              to={`/workouts/${year}-${monthIndex + 1}-${day}`}
            >
              <span>{day}</span>
              {hasWorkout && (
                <span className="w-full h-[2.5px] bottom-0 absolute rounded-full bg-blue-500" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default YearCalendar;
