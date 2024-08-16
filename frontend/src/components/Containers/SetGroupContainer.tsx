import { useEffect, useState } from "react";
import api from "../../api";
import { SetGroup as SetGroupType, Workout } from "../../types";
import SetGroup from "../SetGroup";

interface SetGroupContainerProps {
  setGroups: SetGroupType[];
  handleDelete: (id: number) => void;
  setWorkout: (workout: Workout | null) => void;
  setLoadingWorkout: (isLoading: boolean) => void;
  setSetGroups: (setGroups: SetGroupType[]) => void;
  setError: (error: string) => void;
  date: string | undefined;
}

const SetGroupContainer = ({
  setGroups,
  handleDelete,
  setSetGroups,
  setError,
  date,
}: SetGroupContainerProps) => {
  const [loadingSetGroups, setLoadingSetGroups] = useState<boolean>(true);

  useEffect(() => {
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
    fetchSetGroupsData();
  }, [date]);

  if (loadingSetGroups) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
    </>
  );
};

export default SetGroupContainer;
