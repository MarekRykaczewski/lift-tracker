import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";

interface CopyWorkoutProps {
  workoutDate: string;
  onCopyComplete: () => void;
}

const CopyWorkout: React.FC<CopyWorkoutProps> = ({
  workoutDate,
  onCopyComplete,
}) => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const formatDate = (date: Date) => {
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    return formattedDate;
  };

  const handleCopyWorkout = async () => {
    if (!targetDate) {
      alert("Please select a target date.");
      return;
    }

    try {
      await api.post(`/api/workouts/${workoutDate}/copy/`, {
        target_date: formatDate(targetDate),
      });
      onCopyComplete();
      setShowDatePicker(false);
    } catch (error) {
      console.error("Error copying workout", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-700"
        onClick={() => setShowDatePicker(true)}
      >
        Copy Workout
      </button>
      {showDatePicker && (
        <>
          <DatePicker
            selected={targetDate}
            onChange={(date: Date | null) => setTargetDate(date)}
            dateFormat="yyyy-MM-dd"
            className="mt-2 p-2 border rounded"
          />
          <button
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            onClick={handleCopyWorkout}
          >
            Confirm Copy
          </button>
        </>
      )}
    </div>
  );
};

export default CopyWorkout;
