import React from "react";

interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<DateInputProps> = React.memo(
  ({ id, label, value, onChange }) => (
    <div className="mb-4 lg:mb-0">
      <label
        className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={onChange}
        className="appearance-none dark:border-gray-500 w-full bg-white dark:bg-gray-700 border px-4 py-2 shadow leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  )
);

export default DateInput;
