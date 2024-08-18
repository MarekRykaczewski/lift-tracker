import classNames from "classnames";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  labelClassName?: string;
  inputClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  labelClassName,
  inputClassName,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={classNames(
          "uppercase mb-2 text-xs font-bold text-gray-400",
          labelClassName
        )}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        className={classNames(
          "border-2 dark:border-gray-600 px-2 py-2 text-sm rounded-sm dark:bg-gray-700 placeholder:text-gray-300",
          inputClassName
        )}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
