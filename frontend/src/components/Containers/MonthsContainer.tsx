import { Workout } from "../../types";
import MonthView from "../MonthView";

interface MonthsContainerProps {
  months: string[];
  workouts: Workout[];
  year: number;
}

const MonthsContainer = ({ months, workouts, year }: MonthsContainerProps) => {
  return (
    <>
      {months.map((month, index) => (
        <MonthView
          key={index}
          month={month}
          year={year}
          monthIndex={index}
          workouts={workouts}
        />
      ))}
    </>
  );
};

export default MonthsContainer;
