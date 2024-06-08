const SetGroup = ({ setGroup }) => {
  return (
    <div className="bg-gray-100" key={setGroup.id}>
      <ul>
        {setGroup.sets.map((set) => (
          <li key={set.id}>
            {set.exercise}: {set.weight} lbs x {set.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SetGroup;
