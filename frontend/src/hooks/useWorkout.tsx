import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import api from "../api";
import { SetGroup as SetGroupType, Workout as WorkoutType } from "../types";

const useWorkout = (date: string) => {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [loadingWorkout, setLoadingWorkout] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [setGroups, setSetGroups] = useState<SetGroupType[]>([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutResponse = await api.get<WorkoutType>(
          `api/workouts/${date}/`
        );
        setWorkout(workoutResponse.data);
        setError(null); // Clear any previous errors
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 404) {
            setWorkout(null);
          } else {
            setError("Error fetching workout");
          }
        }
      } finally {
        setLoadingWorkout(false);
      }
    };

    fetchWorkoutData();
  }, [date]);

  const handleCreateWorkout = async () => {
    try {
      const response = await api.post<WorkoutType>("api/workouts/", { date });
      setWorkout(response.data);
      setError(null);
    } catch (error) {
      setError("Error creating workout");
    }
  };

  const handleGroupSetCreated = async () => {
    try {
      const setGroupsResponse = await api.get(
        `api/workouts/${date}/set-groups/`
      );
      setSetGroups(setGroupsResponse.data);
      setError(null);
    } catch (error) {
      setError("Error fetching set groups");
    }
  };

  const handleDelete = async (setGroupId: number) => {
    try {
      await api.delete(`/api/workouts/set-groups/${setGroupId}/`);
      setSetGroups((prevSetGroups) =>
        prevSetGroups.filter((setGroup) => setGroup.id !== setGroupId)
      );
      setError(null);
    } catch (error) {
      setError("Error deleting set group");
    }
  };

  return {
    workout,
    loadingWorkout,
    error,
    setGroups,
    handleCreateWorkout,
    handleGroupSetCreated,
    handleDelete,
    setWorkout,
    setLoadingWorkout,
    setSetGroups,
    setError,
  };
};

export default useWorkout;
