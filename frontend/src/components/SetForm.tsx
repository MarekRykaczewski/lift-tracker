import React, { ChangeEvent, useEffect, useState } from "react";
import api from "../api";
import { Set as SetType } from "../types";
import Button from "./UI/Button";

interface SetFormProps {
  date: string;
  workoutId: number;
  onSetCreated: (set: SetType) => void;
}

interface ExerciseOption {
  id: number;
  name: string;
}

interface FormState {
  selectedExercise: string;
  weight: string;
  reps: string;
}

const fetchExistingSets = async (date: string) => {
  try {
    const response = await api.get(`api/workouts/${date}/sets/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching existing sets:", error);
    return [];
  }
};

const fetchExerciseOptions = async () => {
  try {
    const response = await api.get("api/exercises/");
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

const SetForm: React.FC<SetFormProps> = ({ date, workoutId, onSetCreated }) => {
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>([]);
  const [formState, setFormState] = useState<FormState>({
    selectedExercise: "",
    weight: "",
    reps: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [existingSets, setExistingSets] = useState<SetType[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      const sets = await fetchExistingSets(date);
      setExistingSets(sets);
      const exercises = await fetchExerciseOptions();
      setExerciseOptions(exercises);
    };

    initializeData();
  }, [date]);

  const handleCreateSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const order = existingSets.length + 1;

    const setData = {
      exercise: parseInt(formState.selectedExercise, 10),
      weight: parseFloat(formState.weight),
      reps: parseInt(formState.reps, 10),
      workout: workoutId,
      order: order,
    };

    try {
      const response = await api.post(`api/workouts/${date}/sets/`, setData);
      onSetCreated(response.data);
      setFormState({ selectedExercise: "", weight: "", reps: "" });
      setError(null);
    } catch (error) {
      setError("Error creating set");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <h2>Create Set</h2>
      <form onSubmit={handleCreateSet}>
        <div>
          <label>Exercise:</label>
          <select
            name="selectedExercise"
            value={formState.selectedExercise}
            onChange={handleChange}
            required
          >
            <option value="">Select an exercise</option>
            {exerciseOptions.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Weight:</label>
          <input
            type="number"
            name="weight"
            value={formState.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Reps:</label>
          <input
            type="number"
            name="reps"
            value={formState.reps}
            onChange={handleChange}
            required
          />
        </div>
        <Button variant={"primary"}>Add Set</Button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SetForm;
