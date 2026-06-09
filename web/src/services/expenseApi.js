import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5050/api/v1",
  timeout: 10000,
});

export const createExpense = async (payload) => {
  const { data } = await apiClient.post("/expenses", payload);
  return data;
};

export const getExpenses = async () => {
  const { data } = await apiClient.get("/expenses");
  return data;
};
