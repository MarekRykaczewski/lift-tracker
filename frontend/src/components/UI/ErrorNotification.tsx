import React from "react";

interface ErrorNotificationProps {
  message: string;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  return (
    <div className="bg-red-100 text-red-700 p-4 rounded-sm">{message}</div>
  );
};

export default ErrorNotification;
