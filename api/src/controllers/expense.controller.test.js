import { beforeEach, describe, expect, it, vi } from "vitest";
import { createExpense } from "./expense.controller.js";
import * as expenseService from "../services/expense.service.js";

vi.mock("../services/expense.service.js", () => ({
  createExpense: vi.fn(),
}));

describe("createExpense controller", () => {
  const createResponse = () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an expense and returns a 201 response", async () => {
    const payload = {
      title: "Lunch",
      amount: 250,
      category: "food",
      date: new Date("2026-06-09"),
      note: "Team lunch",
    };
    const createdExpense = { _id: "expense-id", ...payload };
    const req = { body: payload };
    const res = createResponse();
    const next = vi.fn();

    expenseService.createExpense.mockResolvedValue(createdExpense);

    await createExpense(req, res, next);

    expect(expenseService.createExpense).toHaveBeenCalledWith(payload);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Expense created successfully",
      data: createdExpense,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("passes service errors to the error middleware", async () => {
    const error = new Error("Database failed");
    const req = { body: { title: "Lunch" } };
    const res = createResponse();
    const next = vi.fn();

    expenseService.createExpense.mockRejectedValue(error);

    await createExpense(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
