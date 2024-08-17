import { useState } from "react";
import Banner from "../components/Banner";
import VolumeGraph from "../components/VolumeGraph";
import WorkoutBreakdown from "../components/WorkoutBreakdown";

const Home = () => {
  const [view, setView] = useState("workout");

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <Banner>
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
      </Banner>
      <div className="w-full h-full p-2">
        {view === "workout" && <WorkoutBreakdown />}
        {view === "volume" && <VolumeGraph />}
      </div>
    </div>
  );
};

export default Home;
