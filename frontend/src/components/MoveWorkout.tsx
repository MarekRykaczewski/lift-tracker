import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";

interface MoveWorkoutProps {
  workoutDate: string;
  onMoveComplete: () => void;
}

const MoveWorkout: React.FC<MoveWorkoutProps> = ({
  workoutDate,
  onMoveComplete,
}) => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const formatDate = (date: Date) => {
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    return formattedDate;
  };

  const handleMoveWorkout = async () => {
    if (!targetDate) {
      alert("Please select a target date.");
      return;
    }

    try {
      await api.put(`/api/workouts/${workoutDate}/move/`, {
        target_date: formatDate(targetDate),
      });
      onMoveComplete();
      setShowDatePicker(false);
    } catch (error) {
      console.error("Error moving workout", error);
    }
  };

  const handleCancel = () => {
    setTargetDate(null);
    setShowDatePicker(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-700"
        onClick={() => setShowDatePicker(true)}
      >
        Move Workout
      </button>
      {showDatePicker && (
        <>
          <DatePicker
            selected={targetDate}
            onChange={(date: Date | null) => setTargetDate(date)}
            dateFormat="yyyy-MM-dd"
            className="mt-2 p-2 border-2 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <div className="flex mt-2 space-x-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={handleMoveWorkout}
            >
              Confirm Move
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MoveWorkout;
