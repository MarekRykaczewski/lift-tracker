import React from "react";

interface BannerProps {
  children: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ children }) => {
  return (
    <div className="w-full py-3 flex items-center px-2 justify-center gap-3 text-2xl text-center dark:bg-gray-700 bg-gray-200 text-black dark:text-white border-b-4 border-sky-500">
      {children}
    </div>
  );
};

export default Banner;
