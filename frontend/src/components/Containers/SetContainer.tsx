import { useEffect } from "react";
import api from "../../api";
import { Set as SetType } from "../../types";
import Set from "../Set";

interface SetContainerProps {
  sets: SetType[];
  setSets: (sets: SetType[]) => void;
  setError: (error: string) => void;
  setSelectedSet: (set: SetType | null) => void;
  setFormState: (state: { weight: number; reps: number }) => void;
  setGroupId: number | null;
  selectedSet: SetType | null;
}

const SetContainer = ({
  sets,
  setSets,
  setError,
  setSelectedSet,
  setFormState,
  setGroupId,
  selectedSet,
}: SetContainerProps) => {
  const handleSetClick = (set: SetType) => {
    setSelectedSet(set);
    setFormState({ weight: set.display_weight, reps: set.reps });
  };

  useEffect(() => {
    const fetchSets = async () => {
      try {
        if (setGroupId) {
          const response = await api.get<SetType[]>(
            `/api/workouts/set-groups/${setGroupId}/sets/`
          );
          setSets(response.data);
        }
      } catch (error) {
        setError("Error fetching sets");
      }
    };

    fetchSets();
  }, [setGroupId]);

  return (
    <div>
      {sets.map((set) => (
        <div key={set.id} onClick={() => handleSetClick(set)}>
          <Set set={set} isSelected={selectedSet?.id === set.id} />
        </div>
      ))}
    </div>
  );
};

export default SetContainer;
