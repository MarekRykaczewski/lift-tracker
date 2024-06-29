import VolumeGraph from "../components/VolumeGraph";

const Home = () => {
  return (
    <div className="min-h-screen w-full flex bg-gray-100 items-center justify-center">
      <div className="p-3 w-full">
        <VolumeGraph />
      </div>
    </div>
  );
};

export default Home;
