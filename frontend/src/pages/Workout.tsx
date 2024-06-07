import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import SetForm from "../components/SetForm";

const Workout = () => {
  const { date } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sets, setSets] = useState([]);

  useEffect(() => {
    api
      .get(`api/workouts/${date}/`)
      .then((response) => {
        setWorkout(response.data);
        return api.get(`api/workouts/${date}/sets/`);
      })
      .then((response) => {
        setSets(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setWorkout(null);
        } else {
          setError("Error fetching workout");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [date]);

  const handleCreateWorkout = () => {
    api
      .post("api/workouts/", { date })
      .then((response) => {
        setWorkout(response.data);
      })
      .catch((error) => {
        setError("Error creating workout");
      });
  };

  const handleSetCreated = (newSet) => {
    setSets((prevSets) => [...prevSets, newSet]);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Workout Details</h1>
      {workout ? (
        <div>
          <p>Date: {workout.date}</p>
          <h2>Sets</h2>
          {sets.length > 0 ? (
            <ul>
              {sets.map((set) => (
                <li key={set.id}>
                  {set.exercise}: {set.weight} lbs x {set.reps} reps
                </li>
              ))}
            </ul>
          ) : (
            <p>No sets found for this workout.</p>
          )}
          <SetForm
            workoutId={workout.id}
            date={date}
            onSetCreated={handleSetCreated}
          />
        </div>
      ) : (
        <div>
          <p>No workout found for this date.</p>
          <button onClick={handleCreateWorkout}>Create Workout</button>
        </div>
      )}
    </div>
  );
};

export default Workout;
