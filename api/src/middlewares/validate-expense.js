import { EXPENSE_CATEGORIES } from "../models/expense.model.js";
import { createHttpError } from "../utils/http-error.js";

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const validateExpensePayload = (payload, { requireAllFields }) => {
  const { title, amount, category, date, note } = payload;
  const errors = {};
  const normalizedPayload = {};

  // One validator supports both create and update so payload normalization stays consistent.
  if (requireAllFields && !hasValue(title)) {
    errors.title = "Title is required";
  } else if (hasValue(title) && typeof title !== "string") {
    errors.title = "Title must be a string";
  } else if (
    hasValue(title) &&
    (title.trim().length < 2 || title.trim().length > 80)
  ) {
    errors.title = "Title must be between 2 and 80 characters";
  } else if (hasValue(title)) {
    normalizedPayload.title = title.trim();
  }

  if (requireAllFields && !hasValue(amount)) {
    errors.amount = "Amount is required";
  } else if (
    hasValue(amount) &&
    (!Number.isFinite(Number(amount)) || Number(amount) <= 0)
  ) {
    errors.amount = "Amount must be greater than 0";
  } else if (hasValue(amount)) {
    normalizedPayload.amount = Number(amount);
  }

  if (requireAllFields && !hasValue(category)) {
    errors.category = "Category is required";
  } else if (hasValue(category) && !EXPENSE_CATEGORIES.includes(category)) {
    errors.category = "Category is invalid";
  } else if (hasValue(category)) {
    normalizedPayload.category = category;
  }

  if (requireAllFields && !hasValue(date)) {
    errors.date = "Date is required";
  } else if (hasValue(date) && Number.isNaN(Date.parse(date))) {
    errors.date = "Date must be a valid date";
  } else if (hasValue(date)) {
    normalizedPayload.date = new Date(date);
  }

  if (note !== undefined && typeof note !== "string") {
    errors.note = "Note must be a string";
  } else if (typeof note === "string" && note.trim().length > 240) {
    errors.note = "Note cannot exceed 240 characters";
  } else if (typeof note === "string") {
    normalizedPayload.note = note.trim();
  } else if (requireAllFields) {
    normalizedPayload.note = "";
  }

  return { errors, normalizedPayload };
};

export const validateCreateExpense = (req, _res, next) => {
  const { errors, normalizedPayload } = validateExpensePayload(req.body, {
    requireAllFields: true,
  });

  if (Object.keys(errors).length > 0) {
    return next(createHttpError(400, "Expense validation failed", errors));
  }

  req.body = normalizedPayload;

  return next();
};

export const validateUpdateExpense = (req, _res, next) => {
  const { errors, normalizedPayload } = validateExpensePayload(req.body, {
    requireAllFields: false,
  });

  if (Object.keys(errors).length > 0) {
    return next(createHttpError(400, "Expense validation failed", errors));
  }

  if (Object.keys(normalizedPayload).length === 0) {
    return next(
      createHttpError(400, "Expense validation failed", {
        body: "At least one field is required",
      })
    );
  }

  req.body = normalizedPayload;

  return next();
};
