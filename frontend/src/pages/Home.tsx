import { useState } from "react";
import VolumeGraph from "../components/VolumeGraph";
import WorkoutBreakdown from "../components/WorkoutBreakdown";

const Home = () => {
  const [view, setView] = useState("workout");

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full py-3 flex items-center px-2 justify-center gap-3 text-2xl text-center dark:bg-gray-700 bg-gray-200 text-black dark:text-white border-b-4 border-sky-500">
        <button
          className={`mr-2 ${
            view === "workout" ? "bg-blue-700" : ""
          } px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700`}
          onClick={() => setView("workout")}
        >
          Workout Breakdown
        </button>
        <button
          className={`${
            view === "volume" ? "bg-blue-700" : ""
          } px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700`}
          onClick={() => setView("volume")}
        >
          Volume Graph
        </button>
      </div>
      <div className="w-full h-full p-2">
        {view === "workout" && <WorkoutBreakdown />}
        {view !== "workout" && <VolumeGraph />}
      </div>
    </div>
  );
};

export default Home;
