import { useEffect, useState } from "react";
import api from "../api";
import { SetGroup as SetGroupType } from "../types";

const useSetGroups = (date: string | undefined) => {
  const [setGroups, setSetGroups] = useState<SetGroupType[]>([]);
  const [loadingSetGroups, setLoadingSetGroups] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetGroupsData = async () => {
      try {
        const setGroupsResponse = await api.get<SetGroupType[]>(
          `api/workouts/${date}/set-groups/`
        );
        setSetGroups(setGroupsResponse.data);
        setError(null);
      } catch (error) {
        setError("Error fetching set groups");
      } finally {
        setLoadingSetGroups(false);
      }
    };

    if (date) {
      fetchSetGroupsData();
    }
  }, [date]);

  const updateSetOrderInBackend = async (updatedSetGroups: SetGroupType[]) => {
    try {
      await api.put(`api/workouts/${date}/set-groups/update-order/`, {
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
    setError,
    updateSetOrderInBackend,
  };
};

export default useSetGroups;
