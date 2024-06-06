import { useState } from "react";
import { Link } from "react-router-dom";

const YearCalendar = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {months.map((month, index) => (
          <MonthView key={index} month={month} year={year} monthIndex={index} />
        ))}
      </div>
    </div>
  );
};

const MonthView = ({ month, year, monthIndex }) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, monthIndex);

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="flex flex-col items-center border border-gray-300 rounded-lg p-3 bg-gray-100">
      <h3 className="mb-3 text-lg">{month}</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <Link
            key={day}
            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md"
            to={`/workouts/${year}-${monthIndex + 1}-${day}`}
          >
            {day}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default YearCalendar;
