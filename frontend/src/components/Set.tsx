const Set = ({ set, isSelected }) => {
  return (
    <div
      className={`flex justify-between p-1 border-b ${
        isSelected ? "bg-gray-200" : ""
      }`}
    >
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
