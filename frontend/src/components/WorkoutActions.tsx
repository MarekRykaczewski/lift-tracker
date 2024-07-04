import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import CopyWorkout from "./CopyWorkout";

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
      <button
        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
        onClick={handleDeleteWorkout}
      >
        Delete Workout
      </button>
    </div>
  );
};

export default WorkoutActions;
