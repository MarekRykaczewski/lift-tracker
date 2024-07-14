import React from "react";
import api from "../api";
import { usePreferences } from "../context/PreferencesContext";

const UnitPreferenceSelector: React.FC = () => {
  const { preferredUnit, setPreferredUnit } = usePreferences();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = event.target.value;
    setPreferredUnit(newUnit);
    api
      .put("/api/user/profile/", { preferred_unit: newUnit })
      .catch((error) => {
        console.error("Error updating preferred unit:", error);
      });
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        className="uppercase mb-2 text-xs font-bold text-gray-400"
        htmlFor="preferredUnit"
      >
        Preferred Unit:
      </label>
      <select
        id="preferredUnit"
        className="border-2 dark:border-gray-700 dark:bg-gray-600 px-2 py-2 text-sm rounded-sm dark:bg-gray-800 placeholder:text-gray-300"
        value={preferredUnit}
        onChange={handleChange}
      >
        <option value="kg">Kilograms (kg)</option>
        <option value="lbs">Pounds (lbs)</option>
      </select>
    </div>
  );
};

export default UnitPreferenceSelector;
