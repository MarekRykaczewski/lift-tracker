import React from "react";
import { Link, useParams } from "react-router-dom";
import SetGroupContainer from "../components/Containers/SetGroupContainer";
import SetGroupForm from "../components/SetGroupForm";
import Banner from "../components/UI/Banner";
import Button from "../components/UI/Button";
import WorkoutActions from "../components/WorkoutActions";
import useWorkout from "../hooks/useWorkout";

interface Params {
  [key: string]: string | undefined;
}

const Workout: React.FC = () => {
  const { date } = useParams<Params>();
  const {
    workout,
    loadingWorkout,
    error,
    setGroups,
    handleCreateWorkout,
    handleGroupSetCreated,
    handleDelete,
  } = useWorkout(date!);

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

  if (loadingWorkout) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full">
      <Banner>
        <Link to={`/workouts/${calculateDate(date!, -1)}`}>
          <Button variant={"primary"}>Prev</Button>
        </Link>

        {formatDate(date!)}
        <Link to={`/workouts/${calculateDate(date!, 1)}`}>
          <Button variant={"primary"}>Next</Button>
        </Link>
      </Banner>
      {workout ? (
        <div className="flex flex-col items-center gap-5 p-5">
          <WorkoutActions
            workoutId={workout.id}
            onActionComplete={handleGroupSetCreated}
          />

          <SetGroupForm
            onSuccess={handleGroupSetCreated}
            date={date!}
            workoutId={workout.id}
            setGroupCount={setGroups.length}
          />
          <SetGroupContainer handleDelete={handleDelete} date={date} />
        </div>
      ) : (
        <div className="p-3 ">
          <div className="flex dark:bg-gray-800 dark:border-gray-700 max-w-md w-full flex-col border self-center ml-auto mr-auto rounded-sm p-6 gap-5">
            <p className="uppercase mb-2 text-xs font-bold text-gray-400">
              No workout found for this date.
            </p>
            <Button variant={"primary"} onClick={handleCreateWorkout}>
              Create Workout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
