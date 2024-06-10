import { useState } from "react";

const Set = ({ set, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);

  const handleSave = () => {
    onSave(set.id, weight, reps);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between p-1" key={set.id}>
      <div>
        <span className="font-bold mr-1">{set.weight}</span>
        <span className="text-gray-700">lbs</span>
      </div>
      <div>
        <span className="font-bold mr-1">{set.reps}</span>
        <span className="text-gray-700">reps</span>
      </div>
    </div>
  );
};

export default Set;
