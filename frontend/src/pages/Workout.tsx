import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import SetForm from "../components/SetForm";

interface Workout {
  id: number;
  date: string;
}

interface Set {
  id: number;
  exercise: string;
  weight: number;
  reps: number;
}

interface Params {
  date: string;
}

const Workout: React.FC = () => {
  const { date } = useParams<Params>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutResponse = await api.get(`api/workouts/${date}/`);
        setWorkout(workoutResponse.data);
        const setsResponse = await api.get(`api/workouts/${date}/sets/`);
        setSets(setsResponse.data);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          setWorkout(null);
        } else {
          setError("Error fetching workout");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, [date]);

  const handleCreateWorkout = async () => {
    try {
      const response = await api.post("api/workouts/", { date });
      setWorkout(response.data);
    } catch (error) {
      setError("Error creating workout");
    }
  };

  const handleSetCreated = (newSet: Set) => {
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
