import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import SetGroupContainer from "../components/Containers/SetGroupContainer";
import DateNavigation from "../components/DateNavigation";
import SetGroupForm from "../components/Forms/SetGroupForm";
import Banner from "../components/UI/Banner";
import Button from "../components/UI/Button";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import WorkoutActions from "../components/WorkoutActions";
import useSetGroups from "../hooks/useSetGroups";
import useWorkout from "../hooks/useWorkout";

interface Params {
  [key: string]: string | undefined;
}

const Workout: React.FC = () => {
  const { date } = useParams<Params>();
  const workoutDate = date || "";
  const { workout, loadingWorkout, error, handleCreateWorkout, fetchWorkout } =
    useWorkout(workoutDate!);
  const {
    setGroups,
    createSetGroup,
    deleteSetGroup,
    fetchSetGroups,
    loadingSetGroups,
    setSetGroups,
    updateSetOrderInBackend,
  } = useSetGroups(workoutDate!);

  const handleActionComplete = () => {
    console.log("Handling action completion...");
    fetchWorkout();
    fetchSetGroups();
  };

  useEffect(() => {
    console.log("Fetching workout and set groups for date:", workoutDate);
    if (workoutDate) {
      fetchWorkout();
      fetchSetGroups();
    }
  }, [workoutDate]);

  if (loadingWorkout) return <LoadingSpinner />;

  const isNotFoundError = error && error.response?.status === 404;

  return (
    <div className="flex flex-col items-center w-full">
      <Banner>
        <DateNavigation currentDate={workoutDate!} />
      </Banner>
      {workout ? (
        <div className="flex flex-col max-w-md items-center gap-5 p-5">
          <WorkoutActions
            workoutId={workout.id}
            onActionComplete={handleActionComplete}
          />
          <SetGroupForm
            onSuccess={createSetGroup}
            date={workoutDate!}
            workoutId={workout.id}
            setGroupCount={setGroups.length}
          />
          <SetGroupContainer
            setSetGroups={setSetGroups}
            setGroups={setGroups}
            handleDelete={deleteSetGroup}
            loadingSetGroups={loadingSetGroups}
            error={error}
            updateSetOrderInBackend={updateSetOrderInBackend}
          />
        </div>
      ) : (
        <div className="p-3">
          <div className="flex dark:bg-gray-800 dark:border-gray-700 max-w-md w-full flex-col border self-center ml-auto mr-auto rounded-sm p-6 gap-5">
            <p className="uppercase mb-2 text-xs font-bold text-gray-400">
              {isNotFoundError
                ? "No workout found for this date."
                : error?.message}
            </p>
            {isNotFoundError && (
              <Button variant={"primary"} onClick={handleCreateWorkout}>
                Create Workout
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
