import { useState } from "react";
import Set from "./Set";

const SetGroup = ({ setGroup }) => {
  const [sets, setSets] = useState(setGroup.sets);

  const handleAddSet = () => {
    const newSet = {
      id: Date.now(),
      weight: 0,
      reps: 0,
      order: sets.length + 1,
    };
    setSets([...sets, newSet]);
  };

  return (
    <div
      className="flex flex-col bg-white w-1/3 drop-shadow-lg"
      key={setGroup.id}
    >
      <h2 className="border-b-2 border-sky-500 px-3 py-2">
        {setGroup.exercise_name}
      </h2>
      <div className="ml-[50%] px-3">
        {sets.map((set) => (
          <Set set={set} key={set.id} />
        ))}
      </div>
      <button onClick={handleAddSet} className="bg-sky-100 hover:bg-sky-200">
        New Set
      </button>
    </div>
  );
};

export default SetGroup;
