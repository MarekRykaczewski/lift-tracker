import { usePreferences } from "../context/PreferencesContext";
import { Set as SetType } from "../types";
import { convertWeight } from "../utils/ConvertWeight";

interface SetProps {
  set: SetType;
  isSelected: boolean;
}

const Set: React.FC<SetProps> = ({ set, isSelected }) => {
  const { preferredUnit } = usePreferences();

  const displayWeight = convertWeight(
    set.weight,
    preferredUnit || "kg"
  ).toFixed(0);

  return (
    <div
      className={`flex justify-between p-1 border-b dark:border-gray-500 ${
        isSelected ? "bg-sky-100 dark:bg-sky-700" : ""
      }`}
    >
      <div className="flex-1 text-center">
        <span className="font-bold">{set.order}</span>
      </div>
      <div className="flex-1 text-center">
        <span className="font-bold mr-1">{displayWeight}</span>
        <span className="text-gray-700 dark:text-gray-300">
          {preferredUnit}
        </span>
      </div>
      <div className="flex-1 text-center">
        <span className="font-bold mr-1">{set.reps}</span>
        <span className="text-gray-700 dark:text-gray-300">reps</span>
      </div>
    </div>
  );
};

export default Set;
