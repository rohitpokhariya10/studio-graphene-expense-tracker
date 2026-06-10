import * as budgetService from "../services/budget.service.js";

export const getBudgets = async (_req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets();

    res.status(200).json({
      success: true,
      message: "Budgets fetched successfully",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.updateBudgets(req.body.budgets);

    res.status(200).json({
      success: true,
      message: "Budgets updated successfully",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};
