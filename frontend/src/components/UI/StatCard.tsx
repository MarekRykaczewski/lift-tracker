import React from "react";

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ title, value }) => (
  <div className="dark:bg-gray-700 bg-white text-center border dark:border-gray-500 p-2">
    <h2 className="font-bold">{title}</h2>
    <p className="text-blue-500 text-xl">{value}</p>
  </div>
));

export default StatCard;
