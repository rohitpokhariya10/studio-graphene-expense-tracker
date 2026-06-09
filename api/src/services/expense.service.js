import { Expense } from "../models/expense.model.js";

export const createExpense = async (payload) => {
  const expense = await Expense.create(payload);
  return expense.toObject();
};
