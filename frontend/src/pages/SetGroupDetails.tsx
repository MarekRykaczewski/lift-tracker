import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import Set from "../components/Set";
import { Set as SetType } from "../types";

const SetGroupDetails: React.FC = () => {
  const location = useLocation();
  const setGroupId: number = location.state?.setGroupId;

  const [sets, setSets] = useState<SetType[]>([]);
  const [selectedSet, setSelectedSet] = useState<SetType | null>(null);
  const [formState, setFormState] = useState<{ weight: number; reps: number }>({
    weight: 0,
    reps: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        if (setGroupId) {
          const response = await api.get<SetType[]>(
            `/api/workouts/set-groups/${setGroupId}/sets/`
          );
          setSets(response.data);
        }
      } catch (error) {
        setError("Error fetching sets");
      }
    };

    fetchSets();
  }, [setGroupId]);

  const handleSetClick = (set: SetType) => {
    setSelectedSet(set);
    setFormState({ weight: set.display_weight, reps: set.reps });
  };

  const handleCreateSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!setGroupId) return;

    const order = sets.length + 1;

    const setData = {
      weight: formState.weight,
      reps: formState.reps,
      order: order,
    };

    try {
      const response = await api.post<SetType>(
        `/api/workouts/set-groups/${setGroupId}/sets/`,
        setData
      );
      setSets([...sets, response.data]);
      setFormState({ weight: 0, reps: 0 });
      setError(null);
    } catch (error) {
      setError("Error creating set");
    }
  };

  const handleUpdateSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!setGroupId || !selectedSet) return;

    const setData = {
      order: selectedSet.order,
      weight: formState.weight,
      reps: formState.reps,
    };

    try {
      const response = await api.put<SetType>(
        `/api/workouts/set-groups/${setGroupId}/sets/${selectedSet.id}/`,
        setData
      );
      const updatedSets = sets.map((set) =>
        set.id === selectedSet.id ? response.data : set
      );
      setSets(updatedSets);
      setSelectedSet(null);
      setFormState({ weight: 0, reps: 0 });
      setError(null);
    } catch (error) {
      setError("Error updating set");
    }
  };

  const handleDeleteSet = async () => {
    if (!setGroupId || !selectedSet) return;

    try {
      await api.delete(
        `/api/workouts/set-groups/${setGroupId}/sets/${selectedSet.id}/`
      );
      const updatedSets = sets.filter((set) => set.id !== selectedSet.id);
      setSets(updatedSets);
      setSelectedSet(null);
      setFormState({ weight: 0, reps: 0 });
      setError(null);
    } catch (error) {
      setError("Error deleting set");
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-100">
      <h1 className="w-full font-bold text-2xl text-center py-3 mb-3 bg-gray-900 text-white border-b-4 border-sky-500">
        Track
      </h1>
      <div className="max-w-[40vw] w-full border-b flex flex-col">
        <form
          className="flex flex-col mb-2"
          onSubmit={selectedSet ? handleUpdateSet : handleCreateSet}
        >
          <label className="border-b-2 mb-1 font-semibold border-sky-500">
            WEIGHT
          </label>
          <input
            className="border-b self-center font-bold text-xl border-gray-400 text-center w-1/3 bg-transparent"
            type="number"
            value={formState.weight}
            onChange={(e) =>
              setFormState({ ...formState, weight: parseInt(e.target.value) })
            }
          />
          <label className="border-b-2 mb-1 font-semibold border-sky-500">
            REPS
          </label>
          <input
            className="border-b self-center font-bold text-xl border-gray-400 text-center w-1/3 bg-transparent"
            type="number"
            value={formState.reps}
            onChange={(e) =>
              setFormState({ ...formState, reps: parseInt(e.target.value) })
            }
          />
          <div className="flex justify-center gap-2 mt-2">
            <button
              className="rounded text-white font-bold px-4 py-2 bg-blue-500"
              type="submit"
            >
              {selectedSet ? "Update" : "Add"}
            </button>
            {!selectedSet && (
              <button
                className="rounded text-white font-bold px-4 py-2 bg-gray-500"
                type="button"
                onClick={() => {
                  setSelectedSet(null);
                  setFormState({ weight: 0, reps: 0 });
                }}
              >
                Clear
              </button>
            )}
            {selectedSet && (
              <button
                className="rounded text-white font-bold px-4 py-2 bg-red-500"
                type="button"
                onClick={handleDeleteSet}
              >
                Delete
              </button>
            )}
          </div>
        </form>
        {error && <div className="text-red-500">{error}</div>}
        <div>
          {sets.map((set) => (
            <div key={set.id} onClick={() => handleSetClick(set)}>
              <Set set={set} isSelected={selectedSet?.id === set.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetGroupDetails;
