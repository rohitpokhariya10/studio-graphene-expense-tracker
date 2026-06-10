import { Budget } from "../models/budget.model.js";
import { EXPENSE_CATEGORIES } from "../models/expense.model.js";

const createDefaultBudget = (category) => ({
  amount: 0,
  category,
});

const normalizeBudgets = (budgets) => {
  const budgetByCategory = budgets.reduce((budgetMap, budget) => {
    budgetMap[budget.category] = {
      amount: Number(budget.amount),
      category: budget.category,
    };
    return budgetMap;
  }, {});

  return EXPENSE_CATEGORIES.map(
    (category) => budgetByCategory[category] ?? createDefaultBudget(category)
  );
};

export const getBudgets = async () => {
  const budgets = await Budget.find({}).lean();
  return normalizeBudgets(budgets);
};

export const updateBudgets = async (budgetUpdates) => {
  await Promise.all(
    budgetUpdates.map((budget) =>
      Budget.findOneAndUpdate(
        { category: budget.category },
        { amount: budget.amount, category: budget.category },
        { new: true, runValidators: true, upsert: true }
      )
    )
  );

  return getBudgets();
};
