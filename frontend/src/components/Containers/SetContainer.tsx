import { Set as SetType } from "../../types";
import Set from "../Set";

interface SetContainerProps {
  sets: SetType[];
  setSelectedSet: (set: SetType | null) => void;
  setFormState: (state: { weight: number; reps: number }) => void;
  selectedSet: SetType | null;
}

const SetContainer = ({
  sets,
  setSelectedSet,
  setFormState,
  selectedSet,
}: SetContainerProps) => {
  const handleSetClick = (set: SetType) => {
    setSelectedSet(set);
    setFormState({ weight: set.display_weight, reps: set.reps });
  };

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
