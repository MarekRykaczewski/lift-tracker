import { usePreferences } from "../context/PreferencesContext";

const SetPreview = ({ set }) => {
  const { preferredUnit } = usePreferences();

  return (
    <div className="flex justify-between p-1" key={set.id}>
      <div>
        <span className="font-bold mr-1">{set.display_weight}</span>
        <span className="text-gray-700">{preferredUnit}</span>
      </div>
      <div>
        <span className="font-bold mr-1">{set.reps}</span>
        <span className="text-gray-700">reps</span>
      </div>
    </div>
  );
};

export default SetPreview;
