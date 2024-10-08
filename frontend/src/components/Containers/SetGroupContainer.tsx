import React from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { AxiosError } from "axios";
import { SetGroup as SetGroupType } from "../../types";
import SetGroup from "../SetGroup";
import LoadingSpinner from "../UI/LoadingSpinner";

interface SetGroupContainerProps {
  handleDelete: (id: number) => void;
  setGroups: SetGroupType[];
  setSetGroups: React.Dispatch<React.SetStateAction<SetGroupType[]>>;
  loadingSetGroups: boolean;
  error: AxiosError | null;
  updateSetOrderInBackend: (setGroups: SetGroupType[]) => void;
}

const SetGroupContainer: React.FC<SetGroupContainerProps> = ({
  handleDelete,
  setSetGroups,
  setGroups,
  loadingSetGroups,
  error,
  updateSetOrderInBackend,
}) => {
  if (loadingSetGroups) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedSetGroups = Array.from(setGroups);
    const [movedSetGroup] = reorderedSetGroups.splice(result.source.index, 1);
    reorderedSetGroups.splice(result.destination.index, 0, movedSetGroup);

    setSetGroups(reorderedSetGroups);
    updateSetOrderInBackend(reorderedSetGroups);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="setGroups">
        {(provided, snapshot) => (
          <div
            className={`flex p-2 flex-col gap-2 w-full ${
              snapshot.isDraggingOver ? "outline-dashed outline-sky-500 " : ""
            }`}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {setGroups.length > 0 ? (
              setGroups.map((setGroup: SetGroupType, index: number) => (
                <Draggable
                  key={setGroup.id}
                  draggableId={String(setGroup.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SetGroup setGroup={setGroup} onDelete={handleDelete} />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p>No set groups found for this workout.</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SetGroupContainer;
