const SetGroup = ({ setGroup }) => {
  return (
    <div className="bg-gray-100" key={setGroup.id}>
      <h2 className="border-b-2 border-sky-500">{setGroup.exercise_name}</h2>
      <ul>
        {setGroup.sets.map((set) => (
          <li key={set.id}>
            {set.weight} lbs x {set.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SetGroup;
