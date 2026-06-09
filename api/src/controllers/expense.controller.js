import * as expenseService from "../services/expense.service.js";

export const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.body);

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};
