import React from "react";
import { Set } from "../../types";
import Button from "../UI/Button";
import InputField from "../UI/InputField";

interface SetFormProps {
  formState: { weight: number; reps: number };
  selectedSet: Set | null;
  setFormState: (state: { weight: number; reps: number }) => void;
  setSelectedSet: (set: Set | null) => void;
  handleCreateSet: (e: React.FormEvent<HTMLFormElement>) => void;
  handleUpdateSet: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteSet: () => void;
}

const SetForm: React.FC<SetFormProps> = ({
  formState,
  selectedSet,
  setFormState,
  setSelectedSet,
  handleCreateSet,
  handleUpdateSet,
  handleDeleteSet,
}) => {
  return (
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
  );
};

export default SetForm;
