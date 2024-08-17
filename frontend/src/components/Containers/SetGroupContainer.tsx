import React from "react";
import useSetGroups from "../../hooks/useSetGroups";
import { SetGroup as SetGroupType } from "../../types";
import SetGroup from "../SetGroup";

interface SetGroupContainerProps {
  handleDelete: (id: number) => void;
  date: string | undefined;
}

const SetGroupContainer: React.FC<SetGroupContainerProps> = ({
  handleDelete,
  date,
}) => {
  const { setGroups, loadingSetGroups, error } = useSetGroups(date);

  if (loadingSetGroups) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {setGroups.length > 0 ? (
        setGroups.map((setGroup: SetGroupType) => (
          <SetGroup
            key={setGroup.id}
            setGroup={setGroup}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No set groups found for this workout.</p>
      )}
    </>
  );
};

export default SetGroupContainer;
