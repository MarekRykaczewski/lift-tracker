import React from "react";
import { Link } from "react-router-dom";
import { SetGroup as SetGroupType } from "../types";
import SetPreview from "./SetPreview";
import Trash from "./icons/Trash";

interface SetGroupProps {
  setGroup: SetGroupType;
  onDelete: (id: number) => void;
}

const SetGroup: React.FC<SetGroupProps> = ({ setGroup, onDelete }) => {
  const { sets } = setGroup;

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      onDelete(setGroup.id);
    } catch (error) {
      console.error("Failed to delete the set group:", error);
    }
  };

  return (
    <Link
      to={`./set-groups/${setGroup.id}`}
      state={{ setGroupId: setGroup.id }}
      className="flex flex-col bg-white w-full dark:bg-gray-900 max-w-md border"
    >
      <h2 className="border-b-2 flex justify-between border-sky-500 px-3 py-2">
        {setGroup.exercise_name}
        <div className="flex items-center gap-2">
          <button onClick={handleDelete}>
            <Trash />
          </button>
        </div>
      </h2>
      <div className="ml-[50%] px-3">
        {sets.map((set) => (
          <SetPreview set={set} key={set.id} />
        ))}
      </div>
    </Link>
  );
};

export default SetGroup;
