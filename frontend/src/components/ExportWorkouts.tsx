import React from "react";
import api from "../api";

const ExportWorkouts: React.FC = () => {
  const handleExport = async () => {
    try {
      const response = await api.get("/api/workouts/export/", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "workouts.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error exporting workouts:", error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        onClick={handleExport}
      >
        Export Workouts to CSV
      </button>
    </div>
  );
};

export default ExportWorkouts;
