import { Link } from "react-router-dom";
import SetPreview from "./SetPreview";

const SetGroup = ({ setGroup }) => {
  const sets = setGroup.sets;

  return (
    <Link
      to={`./set-groups/${setGroup.id}`}
      state={{ setGroupId: setGroup.id }}
      className="flex flex-col bg-white w-1/3 drop-shadow-lg"
      key={setGroup.id}
    >
      <h2 className="border-b-2 border-sky-500 px-3 py-2">
        {setGroup.exercise_name}
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
