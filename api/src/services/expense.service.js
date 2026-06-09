import { EXPENSE_CATEGORIES, Expense } from "../models/expense.model.js";
import mongoose from "mongoose";
import { createHttpError } from "../utils/http-error.js";

export const createExpense = async (payload) => {
  const expense = await Expense.create(payload);
  return expense.toObject();
};

export const getExpenses = async ({ category } = {}) => {
  const query = {};

  if (category) {
    if (!EXPENSE_CATEGORIES.includes(category)) {
      throw createHttpError(400, "Expense category is invalid");
    }

    query.category = category;
  }

  return Expense.find(query).sort({ date: -1, createdAt: -1 }).lean();
};

export const updateExpense = async (expenseId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    throw createHttpError(400, "Expense id is invalid");
  }

  const expense = await Expense.findByIdAndUpdate(expenseId, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!expense) {
    throw createHttpError(404, "Expense not found");
  }

  return expense;
};

export const deleteExpense = async (expenseId) => {
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    throw createHttpError(400, "Expense id is invalid");
  }

  const expense = await Expense.findByIdAndDelete(expenseId).lean();

  if (!expense) {
    throw createHttpError(404, "Expense not found");
  }

  return expense;
};
