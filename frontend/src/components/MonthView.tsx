import { Workout } from "../types";
import DaysContainer from "./Containers/DaysContainer";

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

  return (
    <div className="flex flex-col items-center border-2 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-3 bg-gray-100">
      <h3 className="mb-3 text-lg">{month}</h3>
      <div className="grid grid-cols-7 gap-1">
        <DaysContainer
          days={days}
          year={year}
          monthIndex={monthIndex}
          workouts={workouts}
        />
      </div>
    </div>
  );
};

export default MonthView;
