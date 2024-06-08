import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import SetGroup from "../components/SetGroup";
import SetGroupForm from "../components/SetGroupForm";

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

interface SetGroup {
  id: number;
  order: number;
  sets: Set[];
}

interface Params {
  date: string;
}

const Workout: React.FC = () => {
  const { date } = useParams<Params>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [setGroups, setSetGroups] = useState<SetGroup[]>([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutResponse = await api.get(`api/workouts/${date}/`);
        setWorkout(workoutResponse.data);
        const setGroupsResponse = await api.get(
          `api/workouts/${date}/set-groups/`
        );
        setSetGroups(setGroupsResponse.data);
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

  const handleGroupSetCreated = () => {
    const fetchSetGroups = async () => {
      try {
        const setGroupsResponse = await api.get(
          `api/workouts/${date}/set-groups/`
        );
        setSetGroups(setGroupsResponse.data);
      } catch (error: any) {
        setError("Error fetching set groups");
      }
    };
    fetchSetGroups();
  };

  const formatDate = (dateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();

    return `${dayOfWeek}, ${month} ${dayOfMonth}`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full p-4">
      <h1 className="font-bold text-2xl text-center border-b-2 border-sky-500">
        {formatDate(date)}
      </h1>
      {workout ? (
        <div className="flex flex-col gap-5 p-5">
          {setGroups.length > 0 ? (
            setGroups.map((setGroup) => <SetGroup setGroup={setGroup} />)
          ) : (
            <p>No set groups found for this workout.</p>
          )}
          <SetGroupForm
            onSuccess={handleGroupSetCreated}
            date={date}
            workoutId={workout.id}
            setGroupCount={setGroups.length}
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
