import { EXPENSE_CATEGORIES } from "../models/expense.model.js";
import { createHttpError } from "../utils/http-error.js";

const hasValue = (value) => value !== undefined && value !== null && value !== "";

export const validateCreateExpense = (req, _res, next) => {
  const { title, amount, category, date, note } = req.body;
  const errors = {};

  if (!hasValue(title)) {
    errors.title = "Title is required";
  } else if (typeof title !== "string") {
    errors.title = "Title must be a string";
  } else if (title.trim().length < 2 || title.trim().length > 80) {
    errors.title = "Title must be between 2 and 80 characters";
  }

  if (!hasValue(amount)) {
    errors.amount = "Amount is required";
  } else if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!hasValue(category)) {
    errors.category = "Category is required";
  } else if (!EXPENSE_CATEGORIES.includes(category)) {
    errors.category = "Category is invalid";
  }

  if (!hasValue(date)) {
    errors.date = "Date is required";
  } else if (Number.isNaN(Date.parse(date))) {
    errors.date = "Date must be a valid date";
  }

  if (note !== undefined && typeof note !== "string") {
    errors.note = "Note must be a string";
  } else if (typeof note === "string" && note.trim().length > 240) {
    errors.note = "Note cannot exceed 240 characters";
  }

  if (Object.keys(errors).length > 0) {
    return next(createHttpError(400, "Expense validation failed", errors));
  }

  req.body = {
    title: title.trim(),
    amount: Number(amount),
    category,
    date: new Date(date),
    note: typeof note === "string" ? note.trim() : "",
  };

  return next();
};
