import React from "react";
import { usePreferences } from "../context/PreferencesContext";
import { Set } from "../types";
import { convertWeight } from "../utils/ConvertWeight";

const SetPreview: React.FC<{ set: Set }> = ({ set }) => {
  const { preferredUnit } = usePreferences();

  const displayWeight = convertWeight(
    set.weight,
    preferredUnit || "kg"
  ).toFixed(0);

  const unitDisplay = preferredUnit ? (
    <span className="text-gray-700 dark:text-gray-400">{preferredUnit}</span>
  ) : null;

  return (
    <div className="flex justify-between p-1" key={set.id}>
      <div>
        <span className="font-bold mr-1">{displayWeight}</span>
        {unitDisplay}
      </div>
      <div>
        <span className="font-bold mr-1">{set.reps}</span>
        <span className="text-gray-700 dark:text-gray-400">reps</span>
      </div>
    </div>
  );
};

export default SetPreview;
