import React from "react";
import ExportWorkouts from "../components/ExportWorkouts";
import UnitPreferenceSelector from "../components/UnitPreferenceSelector";

const Settings: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full p-2">
      <div className="max-w-md w-full h-fit self-center border-2 dark:border-gray-700 dark:bg-gray-800 bg-gray-100 p-6">
        <UnitPreferenceSelector />
        <ExportWorkouts />
      </div>
    </div>
  );
};

export default Settings;
