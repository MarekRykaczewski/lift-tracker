import { useState } from "react";
import api from "../api";
import { SetGroup as SetGroupType } from "../types";

const useSetGroups = (date: string | undefined) => {
  const [setGroups, setSetGroups] = useState<SetGroupType[]>([]);
  const [loadingSetGroups, setLoadingSetGroups] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSetGroups = async () => {
    setLoadingSetGroups(true);
    try {
      const response = await api.get(`/api/workouts/${date}/set-groups`);
      setSetGroups(response.data);
    } catch (error) {
      setError("Error fetching workout");
    } finally {
      setLoadingSetGroups(false);
    }
  };

  const createSetGroup = async () => {
    try {
      const setGroupsResponse = await api.get(
        `api/workouts/${date}/set-groups/`
      );
      setSetGroups(setGroupsResponse.data);
      setError(null);
    } catch (error) {
      setError("Error fetching set groups");
    }
  };

  const deleteSetGroup = async (setGroupId: number) => {
    try {
      await api.delete(`/api/workouts/set-groups/${setGroupId}/`);
      setSetGroups((prevSetGroups) =>
        prevSetGroups.filter((setGroup) => setGroup.id !== setGroupId)
      );
      setError(null);
    } catch (error) {
      setError("Error deleting set group");
    }
  };

  const updateSetOrderInBackend = async (updatedSetGroups: SetGroupType[]) => {
    try {
      await api.put(`api/workouts/${date}/set-groups/order/`, {
        setGroups: updatedSetGroups.map((setGroup, index) => ({
          id: setGroup.id,
          order: index + 1,
        })),
      });
    } catch (err) {
      setError("Error updating set group order");
      throw err;
    }
  };

  return {
    setGroups,
    loadingSetGroups,
    error,
    setSetGroups,
    createSetGroup,
    fetchSetGroups,
    deleteSetGroup,
    setError,
    updateSetOrderInBackend,
  };
};

export default useSetGroups;
