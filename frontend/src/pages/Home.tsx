import { useState } from "react";
import Banner from "../components/UI/Banner";
import Button from "../components/UI/Button";
import VolumeGraph from "../components/VolumeGraph";
import WorkoutBreakdown from "../components/WorkoutBreakdown";

const Home = () => {
  const [view, setView] = useState("workout");

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <Banner>
        <Button
          variant={"primary"}
          className={`mr-2 ${view === "workout" ? "bg-blue-700" : ""}`}
          onClick={() => setView("workout")}
        >
          Workout Breakdown
        </Button>
        <Button
          variant={"primary"}
          className={`${view === "volume" ? "bg-blue-700" : ""}`}
          onClick={() => setView("volume")}
        >
          Volume Graph
        </Button>
      </Banner>
      <div className="w-full h-full p-2">
        {view === "workout" && <WorkoutBreakdown />}
        {view === "volume" && <VolumeGraph />}
      </div>
    </div>
  );
};

export default Home;
