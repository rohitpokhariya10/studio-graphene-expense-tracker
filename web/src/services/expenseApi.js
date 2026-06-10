import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5050/api/v1",
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.userMessage = "API request timed out. Please check the backend URL.";
    } else if (!error.response) {
      error.userMessage =
        "Cannot reach the API. Check deployed API URL, HTTPS, and CORS settings.";
    }

    return Promise.reject(error);
  }
);

export const createExpense = async (payload) => {
  const { data } = await apiClient.post("/expenses", payload);
  return data;
};

export const getExpenses = async (params = {}) => {
  const { data } = await apiClient.get("/expenses", { params });
  return data;
};

export const updateExpense = async (expenseId, payload) => {
  const { data } = await apiClient.put(`/expenses/${expenseId}`, payload);
  return data;
};

export const deleteExpense = async (expenseId) => {
  const { data } = await apiClient.delete(`/expenses/${expenseId}`);
  return data;
};

export default apiClient;
