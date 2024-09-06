import axios, { AxiosError } from "axios";
import { useState } from "react";
import api from "../api";
import { Workout as WorkoutType } from "../types";

const useWorkout = (date: string) => {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [loadingWorkout, setLoadingWorkout] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchWorkout = async () => {
    setLoadingWorkout(true);
    try {
      const response = await api.get(`/api/workouts/${date}`);
      setWorkout(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err);
      } else {
        setError(new AxiosError("Error fetching workout"));
      }
    } finally {
      setLoadingWorkout(false);
    }
  };

  const handleCreateWorkout = async () => {
    try {
      const response = await api.post<WorkoutType>("api/workouts/", { date });
      setWorkout(response.data);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err);
      } else {
        setError(new AxiosError("Error creating workout"));
      }
    }
  };

  return {
    workout,
    loadingWorkout,
    error,
    fetchWorkout,
    handleCreateWorkout,
    setWorkout,
    setLoadingWorkout,
    setError,
  };
};

export default useWorkout;
