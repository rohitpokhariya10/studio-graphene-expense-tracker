import { Router } from "express";
import {
  createExpense,
  getExpenses,
} from "../controllers/expense.controller.js";
import { validateCreateExpense } from "../middlewares/validate-expense.js";

const router = Router();

router.get("/", getExpenses);
router.post("/", validateCreateExpense, createExpense);

export default router;
