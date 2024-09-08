import React from "react";

interface TableProps {
  data: { [key: string]: number };
  breakdown: string;
}

const Table: React.FC<TableProps> = React.memo(({ data, breakdown }) => {
  const sumOfBreakdownValues = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="mt-4 w-full">
      <table className="w-full table-auto bg-white dark:bg-gray-700">
        <thead>
          <tr>
            <th className="border dark:border-gray-500 px-4 py-2">Category</th>
            <th className="border dark:border-gray-500 px-4 py-2">
              {breakdown}
            </th>
            <th className="border dark:border-gray-500 px-4 py-2">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((label, index) => (
            <tr key={index}>
              <td className="border dark:border-gray-500 px-4 py-2">{label}</td>
              <td className="border dark:border-gray-500 px-4 py-2">
                {data[label]}
              </td>
              <td className="border dark:border-gray-500 px-4 py-2">
                {sumOfBreakdownValues > 0
                  ? ((data[label] / sumOfBreakdownValues) * 100).toFixed(2)
                  : 0}
                %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default Table;
