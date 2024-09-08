import { useEffect, useState } from "react";
import api from "../api";
import { SetGroup, Workout } from "../types";

const useWorkoutData = () => {
  const [workoutData, setWorkoutData] = useState<Workout[]>([]);
  const [totalSets, setTotalSets] = useState(0);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await api.get(`api/workouts/`);

        const data = response.data;

        setWorkoutData(data);

        const totalSetsCount = data.reduce(
          (total: number, workout: Workout) =>
            total +
            workout.set_groups.reduce(
              (sum: number, group: SetGroup) => sum + group.sets.length,
              0
            ),
          0
        );
        setTotalSets(totalSetsCount);
      } catch (error) {
        console.error("There was an error fetching the workout data!", error);
      }
    };

    fetchWorkoutData();
  }, []);

  return { workoutData, totalSets };
};

export default useWorkoutData;
