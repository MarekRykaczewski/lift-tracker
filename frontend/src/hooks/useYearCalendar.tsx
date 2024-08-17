import { useEffect, useState } from "react";
import api from "../api";
import { Workout } from "../types";

const useYearCalendar = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/workouts/?year=${year}`);
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [year]);

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    setYear(year + 1);
  };

  return {
    year,
    workouts,
    loading,
    handlePreviousYear,
    handleNextYear,
  };
};

export default useYearCalendar;
