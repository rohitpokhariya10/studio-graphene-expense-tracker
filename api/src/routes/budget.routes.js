import { Router } from "express";
import {
  getBudgets,
  updateBudgets,
} from "../controllers/budget.controller.js";
import { validateUpdateBudgets } from "../middlewares/validate-budget.js";

const router = Router();

router.get("/", getBudgets);
router.put("/", validateUpdateBudgets, updateBudgets);

export default router;
