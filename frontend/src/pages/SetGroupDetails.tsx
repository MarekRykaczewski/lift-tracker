import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import Set from "../components/Set";

const SetGroupDetails = () => {
  const location = useLocation();
  const setGroupId = location.state.setGroupId;

  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [formState, setFormState] = useState({ weight: "", reps: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await api.get(
          `/api/workouts/set-groups/${setGroupId}/sets/`
        );
        setSets(response.data);
      } catch (error) {
        setError("Error fetching sets");
      }
    };

    fetchSets();
  }, [setGroupId]);

  const handleSetClick = (set) => {
    setSelectedSet(set);
    setFormState({ weight: set.weight, reps: set.reps });
  };

  const handleCreateSet = async (e) => {
    e.preventDefault();
    const order = sets.length + 1;

    const setData = {
      weight: formState.weight,
      reps: formState.reps,
      order: order,
    };

    try {
      const response = await api.post(
        `/api/workouts/set-groups/${setGroupId}/sets/`,
        setData
      );
      setSets([...sets, response.data]);
      setFormState({ weight: "", reps: "" });
      setError(null);
    } catch (error) {
      setError("Error creating set");
    }
  };

  const handleUpdateSet = async (e) => {
    e.preventDefault();

    const setData = {
      order: selectedSet.order,
      weight: formState.weight,
      reps: formState.reps,
    };

    try {
      const response = await api.put(
        `/api/workouts/set-groups/${setGroupId}/sets/${selectedSet.id}/`,
        setData
      );
      const updatedSets = sets.map((set) =>
        set.id === selectedSet.id ? response.data : set
      );
      setSets(updatedSets);
      setSelectedSet(null);
      setFormState({ weight: "", reps: "" });
      setError(null);
    } catch (error) {
      setError("Error updating set");
    }
  };

  const handleDeleteSet = async () => {
    if (!selectedSet) return;

    try {
      await api.delete(
        `/api/workouts/set-groups/${setGroupId}/sets/${selectedSet.id}/`
      );
      setSets(sets.filter((set) => set.id !== selectedSet.id));
      setSelectedSet(null);
      setFormState({ weight: "", reps: "" });
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
          <label className="border-b-2 mb-1 font-semibold border-sky-500 ">
            WEIGHT
          </label>
          <input
            className="border-b self-center font-bold text-xl border-gray-400 text-center w-1/3 bg-transparent"
            type="number"
            value={formState.weight}
            onChange={(e) =>
              setFormState({ ...formState, weight: e.target.value })
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
              setFormState({ ...formState, reps: e.target.value })
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
                  setFormState({ weight: "", reps: "" });
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
