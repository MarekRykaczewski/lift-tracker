import React, { useEffect, useState } from "react";
import api from "../api";

interface Set {
  id: number;
  order: number;
  reps: number;
  weight: number;
}

interface SetGroup {
  id: number;
  workout: number;
  exercise: number;
  exercise_name: string;
  order: number;
  sets: Set[];
}

interface Workout {
  id: number;
  date: string;
  notes: string | null;
  set_groups: SetGroup[];
}

const MonthlyVolume: React.FC = () => {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(0);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth is zero-indexed

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get<Workout[]>("/api/workouts", {
          params: { year: currentYear },
        });

        const workouts = response.data;

        const volume = workouts.reduce((totalVolume, workout) => {
          const workoutMonth = new Date(workout.date).getMonth() + 1;
          if (workoutMonth === currentMonth) {
            const workoutVolume = workout.set_groups.reduce(
              (workoutTotal, setGroup) => {
                const setGroupVolume = setGroup.sets.reduce((setTotal, set) => {
                  return setTotal + set.reps * set.weight;
                }, 0);
                return workoutTotal + setGroupVolume;
              },
              0
            );
            return totalVolume + workoutVolume;
          }
          return totalVolume;
        }, 0);

        setMonthlyVolume(volume);
      } catch (error) {
        console.error("Error fetching workouts", error);
      }
    };

    fetchWorkouts();
  }, [currentMonth, currentYear]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Current Monthly Volume</h1>
      <p className="text-lg">{monthlyVolume} kg</p>
    </div>
  );
};

export default MonthlyVolume;
