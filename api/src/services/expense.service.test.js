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

    expect(find).toHaveBeenCalledWith({});
    expect(sort).toHaveBeenCalledWith({ date: -1, createdAt: -1 });
    expect(lean).toHaveBeenCalledWith();
  });

  it("fetches expenses by category", async () => {
    const lean = vi.fn();
    const sort = vi.fn(() => ({ lean }));
    const find = vi.spyOn(Expense, "find").mockReturnValue({ sort });

    await getExpenses({ category: "food" });

    expect(find).toHaveBeenCalledWith({ category: "food" });
    expect(sort).toHaveBeenCalledWith({ date: -1, createdAt: -1 });
    expect(lean).toHaveBeenCalledWith();
  });

  it("fetches expenses by date range", async () => {
    const lean = vi.fn();
    const sort = vi.fn(() => ({ lean }));
    const find = vi.spyOn(Expense, "find").mockReturnValue({ sort });

    await getExpenses({
      endDate: "2026-06-30",
      startDate: "2026-06-01",
    });

    expect(find).toHaveBeenCalledWith({
      date: {
        $gte: new Date("2026-06-01"),
        $lte: new Date("2026-06-30T23:59:59.999Z"),
      },
    });
    expect(sort).toHaveBeenCalledWith({ date: -1, createdAt: -1 });
    expect(lean).toHaveBeenCalledWith();
  });

  it("rejects invalid date range filters", async () => {
    await expect(getExpenses({ startDate: "invalid" })).rejects.toMatchObject({
      statusCode: 400,
      message: "startDate must be a valid date",
    });
  });

  it("rejects date ranges where startDate is after endDate", async () => {
    await expect(
      getExpenses({
        endDate: "2026-06-01",
        startDate: "2026-06-30",
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "startDate cannot be after endDate",
    });
  });

  it("rejects invalid category filters", async () => {
    await expect(getExpenses({ category: "invalid" })).rejects.toMatchObject({
      statusCode: 400,
      message: "Expense category is invalid",
    });
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
