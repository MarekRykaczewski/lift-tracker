import React from "react";

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}

const SelectField: React.FC<SelectFieldProps> = React.memo(
  ({ id, label, value, onChange, options }) => (
    <div className="mb-4 lg:mb-0">
      <label
        className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="block dark:border-gray-500 appearance-none w-full bg-white dark:bg-gray-700 border px-4 py-2 pr-8 shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
);

export default SelectField;
