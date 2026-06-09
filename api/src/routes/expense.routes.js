import { Router } from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controller.js";
import {
  validateCreateExpense,
  validateUpdateExpense,
} from "../middlewares/validate-expense.js";

const router = Router();

router.get("/", getExpenses);
router.post("/", validateCreateExpense, createExpense);
router.put("/:id", validateUpdateExpense, updateExpense);

export default router;
