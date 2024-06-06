import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const Workout = () => {
  const { date } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`api/workouts/${date}/`)
      .then((response) => {
        setWorkout(response.data);
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

  const createWorkout = () => {
    api
      .post(`api/workouts/`, { date })
      .then((response) => {
        setWorkout(response.data);
      })
      .catch((error) => {
        setError("Error creating workout");
      });
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
        </div>
      ) : (
        <div>
          <p>No workout found for this date.</p>
          <button onClick={createWorkout}>Create Workout</button>
        </div>
      )}
    </div>
  );
};

export default Workout;
