import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Set as SetType } from "../../types";
import Set from "../Set";

interface SetContainerProps {
  sets: SetType[];
  setSelectedSet: (set: SetType | null) => void;
  setFormState: (state: { weight: number; reps: number }) => void;
  selectedSet: SetType | null;
  setSets: (sets: SetType[]) => void;
}

const SetContainer = ({
  sets,
  setSelectedSet,
  setFormState,
  selectedSet,
  setSets,
}: SetContainerProps) => {
  const handleSetClick = (set: SetType) => {
    setSelectedSet(set);
    setFormState({ weight: set.display_weight, reps: set.reps });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedSets = Array.from(sets);
    const [movedSet] = reorderedSets.splice(result.source.index, 1);
    reorderedSets.splice(result.destination.index, 0, movedSet);

    const updatedSets = reorderedSets.map((set, index) => ({
      ...set,
      order: index + 1,
    }));

    setSets(updatedSets);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="setsDroppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sets.map((set, index) => (
              <Draggable
                key={set.id}
                draggableId={set.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => handleSetClick(set)}
                  >
                    <Set set={set} isSelected={selectedSet?.id === set.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SetContainer;
