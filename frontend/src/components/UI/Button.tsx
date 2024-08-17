import classNames from "classnames";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "danger" | "success";
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  className,
  ...props
}) => {
  const buttonClass = classNames(
    "px-3 py-1 rounded-md text-white font-semibold",
    {
      "bg-blue-500 hover:bg-blue-700": variant === "primary",
      "bg-gray-500 hover:bg-gray-700": variant === "secondary",
      "bg-red-500 hover:bg-red-700": variant === "danger",
      "bg-green-500 hover:bg-green-700": variant === "success",
    },
    className
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
