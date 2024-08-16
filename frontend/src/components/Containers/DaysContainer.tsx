import { Link } from "react-router-dom";
import { Workout } from "../../types";

interface DaysContainerProps {
  days: number[];
  year: number;
  monthIndex: number;
  workouts: Workout[];
}

const DaysContainer = ({
  days,
  year,
  monthIndex,
  workouts,
}: DaysContainerProps) => {
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
    <>
      {days.map((day) => {
        const hasWorkout = getWorkoutsForDay(day);

        return (
          <Link
            key={day}
            className="relative dark:bg-gray-700 overflow-hidden w-8 h-8 flex flex-col items-center justify-center bg-white border-2 dark:border-gray-600 rounded-md"
            to={`/workouts/${year}-${monthIndex + 1}-${day}`}
          >
            <span>{day}</span>
            {hasWorkout && (
              <span className="w-full h-[2.5px] bottom-0 absolute rounded-full bg-blue-500" />
            )}
          </Link>
        );
      })}
    </>
  );
};

export default DaysContainer;
