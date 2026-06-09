import { Router } from "express";
import { createExpense } from "../controllers/expense.controller.js";
import { validateCreateExpense } from "../middlewares/validate-expense.js";

const router = Router();

router.post("/", validateCreateExpense, createExpense);

export default router;
