import { EXPENSE_CATEGORIES } from "../models/expense.model.js";
import { createHttpError } from "../utils/http-error.js";

export const validateUpdateBudgets = (req, _res, next) => {
  const { budgets } = req.body;
  const errors = {};
  const normalizedBudgets = [];

  if (!Array.isArray(budgets)) {
    return next(
      createHttpError(400, "Budget validation failed", {
        budgets: "Budgets must be an array",
      })
    );
  }

  const seenCategories = new Set();

  budgets.forEach((budget, index) => {
    const key = `budgets.${index}`;

    if (!budget || typeof budget !== "object" || Array.isArray(budget)) {
      errors[key] = "Budget must be an object";
      return;
    }

    const { amount, category } = budget;

    if (!EXPENSE_CATEGORIES.includes(category)) {
      errors[`${key}.category`] = "Budget category is invalid";
    } else if (seenCategories.has(category)) {
      errors[`${key}.category`] = "Budget category cannot be duplicated";
    } else {
      seenCategories.add(category);
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) < 0) {
      errors[`${key}.amount`] = "Budget amount must be zero or greater";
    }

    if (!errors[`${key}.category`] && !errors[`${key}.amount`]) {
      normalizedBudgets.push({
        amount: Number(amount),
        category,
      });
    }
  });

  if (Object.keys(errors).length > 0) {
    return next(createHttpError(400, "Budget validation failed", errors));
  }

  req.body.budgets = normalizedBudgets;

  return next();
};
