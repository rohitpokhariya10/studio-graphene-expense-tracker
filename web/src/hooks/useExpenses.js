import { useCallback, useEffect, useState } from "react";
import { getExpenses } from "../services/expenseApi.js";

const normalizeExpenses = (response) => response.data ?? [];

export const useExpenses = ({ category } = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getExpenses({
        ...(category ? { category } : {}),
      });
      setExpenses(normalizeExpenses(response));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          "Unable to load expenses. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    error,
    expenses,
    isLoading,
    refreshExpenses: fetchExpenses,
  };
};
