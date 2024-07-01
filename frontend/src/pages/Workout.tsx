import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import SetGroup from "../components/SetGroup";
import SetGroupForm from "../components/SetGroupForm";
import { SetGroup as SetGroupType, Workout as WorkoutType } from "../types";

interface Params {
  [key: string]: string | undefined;
}

const Workout: React.FC = () => {
  const { date } = useParams<Params>();
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [loadingWorkout, setLoadingWorkout] = useState<boolean>(true);
  const [loadingSetGroups, setLoadingSetGroups] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [setGroups, setSetGroups] = useState<SetGroupType[]>([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutResponse = await api.get<WorkoutType>(
          `api/workouts/${date}/`
        );
        setWorkout(workoutResponse.data);
        setLoadingWorkout(false);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 404) {
            setWorkout(null);
          } else {
            setError("Error fetching workout");
          }
          setLoadingWorkout(false);
        }
      }
    };

    const fetchSetGroupsData = async () => {
      try {
        const setGroupsResponse = await api.get<SetGroupType[]>(
          `api/workouts/${date}/set-groups/`
        );
        setSetGroups(setGroupsResponse.data);
        setLoadingSetGroups(false);
      } catch (error) {
        setError("Error fetching set groups");
        setLoadingSetGroups(false);
      }
    };

    fetchWorkoutData();
    fetchSetGroupsData();
  }, [date]);

  const handleCreateWorkout = async () => {
    try {
      const response = await api.post<WorkoutType>("api/workouts/", { date });
      setWorkout(response.data);
      setError(null);
    } catch (error) {
      setError("Error creating workout");
    }
  };

  const handleGroupSetCreated = async () => {
    try {
      const setGroupsResponse = await api.get(
        `api/workouts/${date}/set-groups/`
      );
      setSetGroups(setGroupsResponse.data);
      setError(null);
    } catch (error) {
      setError("Error fetching set groups");
    }
  };

  const handleDelete = async (setGroupId: number) => {
    try {
      await api.delete(`/api/workouts/set-groups/${setGroupId}/`);
      setSetGroups((prevSetGroups) =>
        prevSetGroups.filter((setGroup) => setGroup.id !== setGroupId)
      );
      setError(null);
    } catch (error) {
      setError("Error deleting set group");
    }
  };

  const formatDate = (dateString: string) => {
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

  const calculateDate = (currentDate: string, offset: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + offset);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (loadingWorkout || loadingSetGroups) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full bg-gray-50">
      <h1 className="font-bold flex items-center px-2 justify-center gap-3 text-2xl text-center py-3 bg-gray-900 text-white border-b-4 border-sky-500">
        <Link to={`/workouts/${calculateDate(date!, -1)}`}>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Prev
          </button>
        </Link>

        {formatDate(date!)}
        <Link to={`/workouts/${calculateDate(date!, 1)}`}>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Next
          </button>
        </Link>
      </h1>
      {workout ? (
        <div className="flex flex-col items-center gap-5 p-5">
          <SetGroupForm
            onSuccess={handleGroupSetCreated}
            date={date!}
            workoutId={workout.id}
            setGroupCount={setGroups.length}
          />
          {setGroups.length > 0 ? (
            setGroups.map((setGroup) => (
              <SetGroup
                key={setGroup.id}
                setGroup={setGroup}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>No set groups found for this workout.</p>
          )}
        </div>
      ) : (
        <div className="p-3">
          <div className="flex max-w-md w-full flex-col border self-center ml-auto mr-auto rounded-sm p-6 gap-5">
            <p className="uppercase mb-2 text-xs font-bold text-gray-400">
              No workout found for this date.
            </p>
            <button
              className="border-2 px-2 py-2 text-sm rounded-sm placeholder:text-gray-300"
              onClick={handleCreateWorkout}
            >
              Create Workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
