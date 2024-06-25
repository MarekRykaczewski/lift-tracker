import api from "../api";
import { usePreferences } from "../context/PreferencesContext";

const Settings = () => {
  const { preferredUnit, setPreferredUnit } = usePreferences();

  const handleChange = (event) => {
    const newUnit = event.target.value;
    setPreferredUnit(newUnit);
    api
      .put("/api/user/profile/", { preferred_unit: newUnit })
      .then((response) => {
        console.log("Preferred unit updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating preferred unit:", error);
      });
  };

  return (
    <div className="flex max-w-md w-full flex-col border self-center ml-auto mr-auto rounded-sm p-6 gap-5">
      <div className="flex flex-col gap-1">
        <label
          className="uppercase mb-2 text-xs font-bold text-gray-400"
          htmlFor="preferredUnit"
        >
          Preferred Unit:
        </label>
        <select
          id="preferredUnit"
          className="border-2 px-2 py-2 text-sm rounded-sm placeholder:text-gray-300"
          value={preferredUnit}
          onChange={handleChange}
        >
          <option value="kg">Kilograms (kg)</option>
          <option value="lbs">Pounds (lbs)</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
