import React from "react";
import { MONTHS } from "../constants";
import useYearCalendar from "../hooks/useYearCalendar";
import MonthsContainer from "./Containers/MonthsContainer";
import Banner from "./UI/Banner";

const YearCalendar: React.FC = () => {
  const { year, workouts, loading, handlePreviousYear, handleNextYear } =
    useYearCalendar();

  return (
    <div className="w-full flex flex-col">
      <Banner>
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
      </Banner>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid h-[calc(100vh-68px)] overflow-y-scroll p-2 gap-1 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-rows-[repeat(auto-fit,minmax(250px,1fr))]">
            <MonthsContainer months={MONTHS} workouts={workouts} year={year} />
          </div>
        )}
      </div>
    </div>
  );
};

export default YearCalendar;
