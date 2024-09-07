import { useEffect, useState } from "react";
import api from "../api";
import { Exercise } from "../types";

const RecordsTable = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [recordWeights, setRecordWeights] = useState<{
    [key: string]: { [rep: number]: number };
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/sets/records");
        const data = response.data;

        setExercises(data.exercises);
        setRecordWeights(data.record_weights);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const repRanges = Array.from({ length: 20 }, (_, i) => i + 1);

  // Fill in missing data based on the highest recorded RM
  const fillMissingData = (exercise: string) => {
    const weights = recordWeights[exercise] || {};
    const filledWeights = { ...weights };

    // Determine the maximum rep range with recorded weight
    const maxRep = Math.max(...Object.keys(weights).map(Number), 0);

    // Fill in missing data
    for (let i = maxRep; i >= 1; i--) {
      if (filledWeights[i + 1] !== undefined) {
        filledWeights[i] = Math.max(
          filledWeights[i] || 0,
          filledWeights[i + 1]
        );
      }
    }

    return filledWeights;
  };

  // Get the highest RM weight for each exercise
  const getHighestRM = (exercise: string) => {
    const weights = recordWeights[exercise] || {};
    const maxRep = Math.max(...Object.keys(weights).map(Number), 0);
    return { weight: weights[maxRep], rep: maxRep };
  };

  return (
    <div className="max-h-[calc(100vh-60px)] overflow-y-auto">
      <table className="min-w-full bg-white dark:border-gray-600 dark:bg-gray-700 border dark:text-white border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 dark:border-gray-600 border-b dark:bg-gray-800 border-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium">Reps</th>
            {exercises.map((exercise) => (
              <th
                key={exercise.id}
                className="py-3 px-4 text-left text-sm font-medium"
              >
                {exercise.toString()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {repRanges.map((rep) => (
            <tr
              key={rep}
              className="border-b border-gray-200 dark:border-gray-600"
            >
              <td className="py-3 px-4 text-sm">{rep} RM</td>
              {exercises.map((exercise) => {
                const weights = fillMissingData(exercise.toString());
                const weight = weights[rep];
                const { weight: highestWeight, rep: highestRep } = getHighestRM(
                  exercise.toString()
                );

                return (
                  <td
                    key={exercise.id}
                    className={`py-3 px-4 text-sm ${
                      weight === highestWeight && rep === highestRep
                        ? "font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {weight !== undefined ? weight : "N/A"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
