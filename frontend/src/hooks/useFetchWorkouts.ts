import { useEffect, useState } from "react";
import api from "../api";
import { Workout } from "../types";

export const useFetchWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get<Workout[]>("/api/workouts");
        setWorkouts(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return { workouts, isLoading, error };
};
