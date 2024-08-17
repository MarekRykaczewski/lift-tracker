import React from "react";
import api from "../api";
import Button from "./UI/Button";

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
      <Button variant={"primary"} onClick={handleExport}>
        Export Workouts to CSV
      </Button>
    </div>
  );
};

export default ExportWorkouts;
