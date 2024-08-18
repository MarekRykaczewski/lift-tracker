import React from "react";
import { useLocation } from "react-router-dom";
import SetContainer from "../components/Containers/SetContainer";
import Banner from "../components/UI/Banner";
import Button from "../components/UI/Button";
import InputField from "../components/UI/InputField";
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
      <div className="max-w-[40vw] mt-2 border-2 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 w-full flex flex-col">
        <form
          className="flex items-center gap-2 flex-col mb-2"
          onSubmit={selectedSet ? handleUpdateSet : handleCreateSet}
        >
          <InputField
            id={"weight"}
            label={"WEIGHT"}
            type={"number"}
            value={formState.weight}
            onChange={(e) =>
              setFormState({ ...formState, weight: parseInt(e.target.value) })
            }
            placeholder={""}
            inputClassName="text-center w-fit"
            labelClassName="border-b-2 border-sky-500 py-1 text-gray-900 dark:text-white"
          />
          <InputField
            id={"reps"}
            label={"REPS"}
            type={"number"}
            value={formState.reps}
            onChange={(e) =>
              setFormState({ ...formState, reps: parseInt(e.target.value) })
            }
            placeholder={""}
            inputClassName="text-center w-fit"
            labelClassName="border-b-2 border-sky-500 py-1 text-gray-900 dark:text-white"
          />
          <div className="flex justify-center gap-2 mt-2">
            <Button variant={"primary"} type="submit">
              {selectedSet ? "Update" : "Add"}
            </Button>
            {!selectedSet && (
              <Button
                variant={"secondary"}
                onClick={() => {
                  setSelectedSet(null);
                  setFormState({ weight: 0, reps: 0 });
                }}
              >
                Clear
              </Button>
            )}
            {selectedSet && (
              <Button variant={"danger"} onClick={handleDeleteSet}>
                Delete
              </Button>
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
