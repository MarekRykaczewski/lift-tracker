import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";

interface DateNavigationProps {
  currentDate: string;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ currentDate }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
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
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();

    return `${dayOfWeek}, ${month} ${dayOfMonth}`;
  };

  const calculateDate = (dateString: string, offset: number) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + offset);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleNavigation = (offset: number) => {
    const newDate = calculateDate(currentDate, offset);
    navigate(`/workouts/${newDate}`, { replace: true });
    window.location.reload();
  };

  return (
    <div className="flex justify-between w-full">
      <Button variant={"primary"} onClick={() => handleNavigation(-1)}>
        Prev
      </Button>
      <span>{formatDate(currentDate)}</span>
      <Button variant={"primary"} onClick={() => handleNavigation(1)}>
        Next
      </Button>
    </div>
  );
};

export default DateNavigation;
