import { describe, expect, it, vi } from "vitest";
import { getExpenses } from "./expense.service.js";
import { Expense } from "../models/expense.model.js";

describe("expense service", () => {
  it("fetches expenses sorted by latest date and creation time", async () => {
    const lean = vi.fn();
    const sort = vi.fn(() => ({ lean }));
    const find = vi.spyOn(Expense, "find").mockReturnValue({ sort });

    await getExpenses();

    expect(find).toHaveBeenCalledWith();
    expect(sort).toHaveBeenCalledWith({ date: -1, createdAt: -1 });
    expect(lean).toHaveBeenCalledWith();
  });
});
