import React from "react";
import { useParams } from "react-router-dom";
import SetGroupContainer from "../components/Containers/SetGroupContainer";
import DateNavigation from "../components/DateNavigation";
import SetGroupForm from "../components/Forms/SetGroupForm";
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
    handleCreateWorkout,
    handleGroupSetCreated,
    handleDelete,
  } = useWorkout(date!);

  if (loadingWorkout) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center w-full">
      <Banner>
        <DateNavigation currentDate={date!} />
      </Banner>
      {workout ? (
        <div className="flex flex-col max-w-md items-center gap-5 p-5">
          <WorkoutActions
            workoutId={workout.id}
            onActionComplete={handleGroupSetCreated}
          />
          <SetGroupForm
            onSuccess={handleGroupSetCreated}
            date={date!}
            workoutId={workout.id}
            setGroupCount={workout.set_groups.length}
          />
          <SetGroupContainer handleDelete={handleDelete} date={date} />
        </div>
      ) : (
        <div className="p-3">
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
