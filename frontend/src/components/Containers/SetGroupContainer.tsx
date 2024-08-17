import React from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
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
  const { setGroups, loadingSetGroups, error, setSetGroups } =
    useSetGroups(date);

  if (loadingSetGroups) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(setGroups);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSetGroups(items);
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
