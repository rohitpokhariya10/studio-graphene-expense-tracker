import { EXPENSE_CATEGORIES, Expense } from "../models/expense.model.js";
import mongoose from "mongoose";
import { createHttpError } from "../utils/http-error.js";

export const createExpense = async (payload) => {
  const expense = await Expense.create(payload);
  return expense.toObject();
};

const getDateFromFilter = (value, fieldName) => {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw createHttpError(400, `${fieldName} must be a valid date`);
  }

  return date;
};

export const getExpenses = async ({ category, endDate, startDate } = {}) => {
  const query = {};

  if (category) {
    if (!EXPENSE_CATEGORIES.includes(category)) {
      throw createHttpError(400, "Expense category is invalid");
    }

    query.category = category;
  }

  if (startDate || endDate) {
    query.date = {};

    if (startDate) {
      query.date.$gte = getDateFromFilter(startDate, "startDate");
    }

    if (endDate) {
      const parsedEndDate = getDateFromFilter(endDate, "endDate");
      // Include the full selected end date instead of stopping at midnight.
      parsedEndDate.setUTCHours(23, 59, 59, 999);
      query.date.$lte = parsedEndDate;
    }

    if (query.date.$gte && query.date.$lte && query.date.$gte > query.date.$lte) {
      throw createHttpError(400, "startDate cannot be after endDate");
    }
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
