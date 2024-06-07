import { useEffect, useState } from "react";
import api from "../api";

const SetGroupForm = ({ onSuccess, date, workoutId, setGroupCount }) => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(`api/workouts/${date}/set-groups/`, {
        workout: workoutId,
        exercise: selectedExercise,
        order: setGroupCount + 1,
      });
      onSuccess(response.data);
    } catch (error) {
      setError("Error creating set group");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Choose Exercise:
        <select
          value={selectedExercise}
          onChange={(event) => setSelectedExercise(event.target.value)}
        >
          <option value="">Select an exercise...</option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </label>
      {error && <p>{error}</p>}
      <button type="submit">Create Set Group</button>
    </form>
  );
};

export default SetGroupForm;
