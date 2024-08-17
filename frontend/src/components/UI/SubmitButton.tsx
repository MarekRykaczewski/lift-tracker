import React from "react";

interface SubmitButtonProps {
  text: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text }) => {
  return (
    <button
      className="bg-blue-500 text-sm text-white rounded-sm py-4"
      type="submit"
    >
      {text}
    </button>
  );
};

export default SubmitButton;
