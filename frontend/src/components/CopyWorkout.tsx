import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import Button from "./UI/Button";

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

  const handleCancel = () => {
    setTargetDate(null);
    setShowDatePicker(false);
  };

  return (
    <div className="flex flex-col items-center">
      <Button variant="success" onClick={() => setShowDatePicker(true)}>
        Copy Workout
      </Button>
      {showDatePicker && (
        <>
          <DatePicker
            selected={targetDate}
            onChange={(date: Date | null) => setTargetDate(date)}
            dateFormat="yyyy-MM-dd"
            className="mt-2 p-2 border-2 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <div className="flex mt-2 space-x-2">
            <Button variant="primary" onClick={handleCopyWorkout}>
              Confirm Copy
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CopyWorkout;
