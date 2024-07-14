import React, { useEffect, useState } from "react";
import api from "../api";
import { SetGroup } from "../types";

interface SetGroupFormProps {
  onSuccess: (data: SetGroup) => void;
  date: string;
  workoutId: number;
  setGroupCount: number;
}

interface Exercise {
  id: number;
  name: string;
}

const SetGroupForm: React.FC<SetGroupFormProps> = ({
  onSuccess,
  date,
  workoutId,
  setGroupCount,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get("api/exercises/");
        setExercises(response.data);
      } catch (error) {
        setError("Error fetching exercises");
      }
    };
    fetchExercises();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedExercise) {
      setError("Please select an exercise");
      return;
    }
    try {
      const payload = {
        workout: workoutId,
        exercise: selectedExercise,
        order: setGroupCount + 1,
      };

      const response = await api.post(
        `api/workouts/${date}/set-groups/`,
        payload
      );

      onSuccess(response.data);
    } catch (error) {
      setError("Error creating set group");
    }
  };

  return (
    <form
      className="flex bg-gray-100 dark:bg-gray-800 dark:border-gray-700 max-w-md w-full flex-col border-2 self-center ml-auto mr-auto rounded-sm p-6 gap-5"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <label
          className="uppercase mb-2 text-xs font-bold text-gray-400"
          htmlFor="exercise"
        >
          Choose Exercise
        </label>
        <select
          className="border-2 px-2 py-2 dark:bg-gray-600 dark:border-gray-700 text-sm rounded-sm"
          value={selectedExercise}
          onChange={(event) => setSelectedExercise(event.target.value)}
          required
        >
          <option value="">Select an exercise...</option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-blue-500 text-sm text-white rounded-sm py-4"
        type="submit"
      >
        Create Set Group
      </button>
    </form>
  );
};

export default SetGroupForm;
