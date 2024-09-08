import React from "react";

type FilterControlsProps = {
  timeInterval: string;
  metric: string;
  setTimeInterval: React.Dispatch<React.SetStateAction<string>>;
  setMetric: React.Dispatch<React.SetStateAction<string>>;
};

const FilterControls: React.FC<FilterControlsProps> = ({
  timeInterval,
  metric,
  setTimeInterval,
  setMetric,
}) => {
  return (
    <div className="mb-4">
      <select
        className="border dark:border-gray-500 dark:bg-gray-700 p-2 mr-2"
        value={metric}
        onChange={(e) => setMetric(e.target.value)}
      >
        <optgroup label="WORKOUT GRAPHS">
          <option value="volume_per_workout">Volume per workout</option>
          <option value="sets_per_workout">Sets per workout</option>
          <option value="reps_per_workout">Reps per workout</option>
        </optgroup>
        <optgroup label="MONTHLY GRAPHS">
          <option value="volume_per_month">Volume per month</option>
          <option value="sets_per_month">Sets per month</option>
          <option value="reps_per_month">Reps per month</option>
        </optgroup>
        <optgroup label="WEEKLY GRAPHS">
          <option value="volume_per_week">Volume per week</option>
          <option value="sets_per_week">Sets per week</option>
          <option value="reps_per_week">Reps per week</option>
        </optgroup>
        <optgroup label="YEARLY GRAPHS">
          <option value="volume_per_year">Volume per year</option>
          <option value="sets_per_year">Sets per year</option>
          <option value="reps_per_year">Reps per year</option>
        </optgroup>
      </select>
      <select
        className="border dark:border-gray-500 p-2 dark:bg-gray-700"
        value={timeInterval}
        onChange={(e) => setTimeInterval(e.target.value)}
      >
        <option value="1month">1 Month</option>
        <option value="3month">3 Months</option>
        <option value="6month">6 Months</option>
        <option value="1year">1 Year</option>
        <option value="all">All</option>
      </select>
    </div>
  );
};

export default FilterControls;
