import { afterEach, describe, expect, it, vi } from "vitest";
import { Budget } from "../models/budget.model.js";
import { getBudgets, updateBudgets } from "./budget.service.js";

describe("budget service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns every category with zero defaults when no budget exists", async () => {
    const lean = vi.fn().mockResolvedValue([{ amount: 5000, category: "food" }]);
    vi.spyOn(Budget, "find").mockReturnValue({ lean });

    const budgets = await getBudgets();

    expect(Budget.find).toHaveBeenCalledWith({});
    expect(budgets).toEqual(
      expect.arrayContaining([
        { amount: 5000, category: "food" },
        { amount: 0, category: "transport" },
      ])
    );
  });

  it("upserts each budget update and returns normalized budgets", async () => {
    const updates = [
      { amount: 5000, category: "food" },
      { amount: 2000, category: "transport" },
    ];
    const findOneAndUpdate = vi
      .spyOn(Budget, "findOneAndUpdate")
      .mockResolvedValue({});
    const lean = vi.fn().mockResolvedValue(updates);
    vi.spyOn(Budget, "find").mockReturnValue({ lean });

    const budgets = await updateBudgets(updates);

    expect(findOneAndUpdate).toHaveBeenCalledTimes(2);
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { category: "food" },
      { amount: 5000, category: "food" },
      { new: true, runValidators: true, upsert: true }
    );
    expect(budgets).toEqual(expect.arrayContaining(updates));
  });
});
