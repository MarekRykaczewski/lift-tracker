import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const Workout = () => {
  const { date } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    api
      .get(`api/workouts/${date}/`)
      .then((response) => {
        setWorkout(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workout:", error);
      });
  }, [date]);

  return (
    <div>
      <h1>Workout Details</h1>
      {workout ? (
        <div>
          <p>Date: {workout.date}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Workout;
