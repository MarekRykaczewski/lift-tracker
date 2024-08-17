import React from "react";
import { useLocation } from "react-router-dom";
import SetContainer from "../components/Containers/SetContainer";
import Banner from "../components/UI/Banner";
import useSets from "../hooks/useSets";

const SetGroupDetails: React.FC = () => {
  const location = useLocation();
  const setGroupId: number = location.state?.setGroupId;

  const {
    sets,
    error,
    formState,
    selectedSet,
    setFormState,
    setSelectedSet,
    handleCreateSet,
    handleUpdateSet,
    handleDeleteSet,
  } = useSets({ setGroupId });

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-50 dark:bg-gray-900">
      <Banner>Track</Banner>
      <div className="max-w-[40vw] border-2 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-2 w-full flex flex-col">
        <form
          className="flex flex-col mb-2"
          onSubmit={selectedSet ? handleUpdateSet : handleCreateSet}
        >
          <label className="border-b-2 mb-1 font-semibold border-sky-500">
            WEIGHT
          </label>
          <input
            className="border-b self-center font-bold text-xl border-gray-400 text-center w-1/3 bg-transparent"
            type="number"
            value={formState.weight}
            onChange={(e) =>
              setFormState({ ...formState, weight: parseInt(e.target.value) })
            }
          />
          <label className="border-b-2 mb-1 font-semibold border-sky-500">
            REPS
          </label>
          <input
            className="border-b self-center font-bold text-xl border-gray-400 text-center w-1/3 bg-transparent"
            type="number"
            value={formState.reps}
            onChange={(e) =>
              setFormState({ ...formState, reps: parseInt(e.target.value) })
            }
          />
          <div className="flex justify-center gap-2 mt-2">
            <button
              className="rounded text-white font-bold px-4 py-2 bg-blue-500"
              type="submit"
            >
              {selectedSet ? "Update" : "Add"}
            </button>
            {!selectedSet && (
              <button
                className="rounded text-white font-bold px-4 py-2 bg-gray-500"
                type="button"
                onClick={() => {
                  setSelectedSet(null);
                  setFormState({ weight: 0, reps: 0 });
                }}
              >
                Clear
              </button>
            )}
            {selectedSet && (
              <button
                className="rounded text-white font-bold px-4 py-2 bg-red-500"
                type="button"
                onClick={handleDeleteSet}
              >
                Delete
              </button>
            )}
          </div>
        </form>
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <SetContainer
            sets={sets}
            setSelectedSet={setSelectedSet}
            setFormState={setFormState}
            selectedSet={selectedSet}
          />
        </div>
      </div>
    </div>
  );
};

export default SetGroupDetails;
