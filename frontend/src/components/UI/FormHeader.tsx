import React from "react";

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="border-b border-gray-100 dark:border-gray-500 p-6">
      <h1 className="font-bold text-2xl uppercase mb-2">{title}</h1>
      <p className="text-gray-400 uppercase text-xs mb-2 font-bold">
        {subtitle}
      </p>
    </div>
  );
};

export default FormHeader;
