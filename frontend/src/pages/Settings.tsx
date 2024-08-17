import React from "react";
import Banner from "../components/Banner";
import ExportWorkouts from "../components/ExportWorkouts";
import UnitPreferenceSelector from "../components/UnitPreferenceSelector";

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col h-full ">
      <Banner>Settings</Banner>
      <div className="max-w-md w-full h-fit self-center mt-2 border-2 dark:border-gray-700 dark:bg-gray-800 bg-gray-100 p-6">
        <UnitPreferenceSelector />
        <ExportWorkouts />
      </div>
    </div>
  );
};

export default Settings;
