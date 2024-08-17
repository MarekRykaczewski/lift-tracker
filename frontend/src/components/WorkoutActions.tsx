import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CopyWorkout from "./CopyWorkout";
import MoveWorkout from "./MoveWorkout";
import Button from "./UI/Button";

interface WorkoutActionsProps {
  workoutId: number;
  onActionComplete: () => void;
}

const WorkoutActions: React.FC<WorkoutActionsProps> = ({
  workoutId,
  onActionComplete,
}) => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const handleDeleteWorkout = async () => {
    try {
      await api.delete(`/api/workouts/${workoutId}/`);
      navigate(`/workouts/${date}`);
      onActionComplete();
    } catch (error) {
      console.error("Error deleting workout", error);
    }
  };

  return (
    <div className="flex gap-3">
      <CopyWorkout onCopyComplete={onActionComplete} workoutDate={date!} />
      <MoveWorkout workoutDate={date!} onMoveComplete={onActionComplete} />

      <Button variant={"danger"} onClick={handleDeleteWorkout}>
        Delete Workout
      </Button>
    </div>
  );
};

export default WorkoutActions;
