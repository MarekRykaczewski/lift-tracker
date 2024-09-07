import { useEffect, useState } from "react";
import api from "../api";
import { Set as SetType } from "../types";

interface UseSetsProps {
  setGroupId: number | undefined;
}

const useSets = ({ setGroupId }: UseSetsProps) => {
  const [sets, setSets] = useState<SetType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<{ weight: number; reps: number }>({
    weight: 0,
    reps: 0,
  });
  const [selectedSet, setSelectedSet] = useState<SetType | null>(null);

  useEffect(() => {
    const fetchSetsData = async () => {
      if (!setGroupId) return;

      try {
        const response = await api.get<SetType[]>(
          `/api/set-groups/${setGroupId}/sets/`
        );
        setSets(response.data);
        setError(null);
      } catch (error) {
        setError("Error fetching sets");
      }
    };

    fetchSetsData();
  }, [setGroupId]);

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
        `/api/set-groups/${setGroupId}/sets/`,
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
        `/api/set-groups/${setGroupId}/sets/${selectedSet.id}/`,
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
      await api.delete(`/api/set-groups/${setGroupId}/sets/${selectedSet.id}`);
      const updatedSets = sets.filter((set) => set.id !== selectedSet.id);
      setSets(updatedSets);
      setSelectedSet(null);
      setFormState({ weight: 0, reps: 0 });
      setError(null);
    } catch (error) {
      setError("Error deleting set");
    }
  };

  return {
    sets,
    setSets,
    error,
    formState,
    selectedSet,
    setFormState,
    setSelectedSet,
    handleCreateSet,
    handleUpdateSet,
    handleDeleteSet,
  };
};

export default useSets;
