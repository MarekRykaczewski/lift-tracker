import { useEffect, useState } from "react";
import api from "../api";

interface Category {
  id: number;
  name: string;
}

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/exercises");
        setCategories(response.data);
      } catch (error) {
        setError("There was an error fetching the categories!");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
