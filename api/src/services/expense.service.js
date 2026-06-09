import { Expense } from "../models/expense.model.js";

export const createExpense = async (payload) => {
  const expense = await Expense.create(payload);
  return expense.toObject();
};

export const getExpenses = async () => {
  return Expense.find().sort({ date: -1, createdAt: -1 }).lean();
};
