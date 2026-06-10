import apiClient from "./expenseApi.js";

export const getBudgets = async () => {
  const { data } = await apiClient.get("/budgets");
  return data;
};

export const updateBudgets = async (budgets) => {
  const { data } = await apiClient.put("/budgets", { budgets });
  return data;
};
