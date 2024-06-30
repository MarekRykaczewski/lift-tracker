import React from "react";
import { usePreferences } from "../context/PreferencesContext";
import { Set } from "../types";

const SetPreview: React.FC<{ set: Set }> = ({ set }) => {
  const { preferredUnit } = usePreferences();

  const unitDisplay = preferredUnit ? (
    <span className="text-gray-700">{preferredUnit}</span>
  ) : null;

  return (
    <div className="flex justify-between p-1" key={set.id}>
      <div>
        <span className="font-bold mr-1">{set.display_weight}</span>
        {unitDisplay}
      </div>
      <div>
        <span className="font-bold mr-1">{set.reps}</span>
        <span className="text-gray-700">reps</span>
      </div>
    </div>
  );
};

export default SetPreview;
