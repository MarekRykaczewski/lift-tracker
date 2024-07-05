import React from "react";
import UnitPreferenceSelector from "../components/UnitPreferenceSelector";

const Settings: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full px-2">
      <div className="max-w-md w-full h-fit self-center border rounded-sm p-6">
        <UnitPreferenceSelector />
      </div>
    </div>
  );
};

export default Settings;
