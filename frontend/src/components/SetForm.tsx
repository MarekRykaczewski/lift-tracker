import { useEffect, useState } from "react";
import api from "../api";

const SetForm = ({ date, workoutId, onSetCreated }) => {
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState();
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [existingSets, setExistingSets] = useState([]);

  useEffect(() => {
    api
      .get(`api/workouts/${date}/sets/`)
      .then((response) => {
        setExistingSets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching existing sets:", error);
      });

    api
      .get("api/exercises/")
      .then((response) => {
        setExerciseOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
      });
  }, [workoutId]);

  const handleCreateSet = (e) => {
    e.preventDefault();
    const order = existingSets.length + 1;

    const setData = {
      exercise: parseInt(selectedExercise),
      weight,
      reps,
      workout: workoutId,
      order: order,
    };

    console.log(setData);
    api
      .post(`api/workouts/${date}/sets/`, setData)
      .then((response) => {
        onSetCreated(response.data);
        setSelectedExercise("");
        setWeight("");
        setReps("");
        setError(null);
      })
      .catch((error) => {
        setError("Error creating set");
      });
  };

  return (
    <div>
      <h2>Create Set</h2>
      <form onSubmit={handleCreateSet}>
        <div>
          <label>Exercise:</label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
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
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reps:</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Set</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SetForm;
