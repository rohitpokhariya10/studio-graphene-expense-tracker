import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBudgets, updateBudgets } from "./budget.controller.js";
import * as budgetService from "../services/budget.service.js";

vi.mock("../services/budget.service.js", () => ({
  getBudgets: vi.fn(),
  updateBudgets: vi.fn(),
}));

const createResponse = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

describe("budget controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns budgets", async () => {
    const budgets = [{ amount: 5000, category: "food" }];
    const res = createResponse();
    const next = vi.fn();

    budgetService.getBudgets.mockResolvedValue(budgets);

    await getBudgets({}, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Budgets fetched successfully",
      data: budgets,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("updates budgets", async () => {
    const budgets = [{ amount: 5000, category: "food" }];
    const req = { body: { budgets } };
    const res = createResponse();
    const next = vi.fn();

    budgetService.updateBudgets.mockResolvedValue(budgets);

    await updateBudgets(req, res, next);

    expect(budgetService.updateBudgets).toHaveBeenCalledWith(budgets);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Budgets updated successfully",
      data: budgets,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
