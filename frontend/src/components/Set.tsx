import { usePreferences } from "../context/PreferencesContext";
import { Set as SetType } from "../types";

interface SetProps {
  set: SetType;
  isSelected: boolean;
}

const Set: React.FC<SetProps> = ({ set, isSelected }) => {
  const { preferredUnit } = usePreferences();

  return (
    <div
      className={`flex justify-between p-1 border-b ${
        isSelected ? "bg-sky-100 dark:bg-gray-700" : ""
      }`}
    >
      <div>
        <span className="font-bold mr-1">{set.order}</span>
      </div>
      <div>
        <span className="font-bold mr-1">{set.display_weight}</span>
        <span className="text-gray-700 dark:text-gray-300">
          {preferredUnit}
        </span>
      </div>
      <div>
        <span className="font-bold mr-1">{set.reps}</span>
        <span className="text-gray-700 dark:text-gray-300">reps</span>
      </div>
    </div>
  );
};

export default Set;
