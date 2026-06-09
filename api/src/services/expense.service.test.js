import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deleteExpense,
  getExpenses,
  updateExpense,
} from "./expense.service.js";
import { Expense } from "../models/expense.model.js";

const validExpenseId = "665f2f5f7d9f9b3f7c6a1234";

describe("expense service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches expenses sorted by latest date and creation time", async () => {
    const lean = vi.fn();
    const sort = vi.fn(() => ({ lean }));
    const find = vi.spyOn(Expense, "find").mockReturnValue({ sort });

    await getExpenses();

    expect(find).toHaveBeenCalledWith();
    expect(sort).toHaveBeenCalledWith({ date: -1, createdAt: -1 });
    expect(lean).toHaveBeenCalledWith();
  });

  it("updates an expense by id", async () => {
    const payload = { title: "Updated lunch" };
    const updatedExpense = { _id: validExpenseId, ...payload };
    const lean = vi.fn().mockResolvedValue(updatedExpense);
    const findByIdAndUpdate = vi
      .spyOn(Expense, "findByIdAndUpdate")
      .mockReturnValue({ lean });

    const result = await updateExpense(validExpenseId, payload);

    expect(findByIdAndUpdate).toHaveBeenCalledWith(validExpenseId, payload, {
      new: true,
      runValidators: true,
    });
    expect(lean).toHaveBeenCalledWith();
    expect(result).toEqual(updatedExpense);
  });

  it("rejects invalid expense ids", async () => {
    await expect(updateExpense("invalid-id", {})).rejects.toMatchObject({
      statusCode: 400,
      message: "Expense id is invalid",
    });
  });

  it("throws not found when no expense matches the id", async () => {
    const lean = vi.fn().mockResolvedValue(null);
    vi.spyOn(Expense, "findByIdAndUpdate").mockReturnValue({ lean });

    await expect(updateExpense(validExpenseId, {})).rejects.toMatchObject({
      statusCode: 404,
      message: "Expense not found",
    });
  });

  it("deletes an expense by id", async () => {
    const deletedExpense = { _id: validExpenseId, title: "Lunch" };
    const lean = vi.fn().mockResolvedValue(deletedExpense);
    const findByIdAndDelete = vi
      .spyOn(Expense, "findByIdAndDelete")
      .mockReturnValue({ lean });

    const result = await deleteExpense(validExpenseId);

    expect(findByIdAndDelete).toHaveBeenCalledWith(validExpenseId);
    expect(lean).toHaveBeenCalledWith();
    expect(result).toEqual(deletedExpense);
  });

  it("rejects invalid expense ids when deleting", async () => {
    await expect(deleteExpense("invalid-id")).rejects.toMatchObject({
      statusCode: 400,
      message: "Expense id is invalid",
    });
  });

  it("throws not found when no expense is deleted", async () => {
    const lean = vi.fn().mockResolvedValue(null);
    vi.spyOn(Expense, "findByIdAndDelete").mockReturnValue({ lean });

    await expect(deleteExpense(validExpenseId)).rejects.toMatchObject({
      statusCode: 404,
      message: "Expense not found",
    });
  });
});
