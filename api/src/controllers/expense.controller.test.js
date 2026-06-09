import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "./expense.controller.js";
import * as expenseService from "../services/expense.service.js";

vi.mock("../services/expense.service.js", () => ({
  createExpense: vi.fn(),
  deleteExpense: vi.fn(),
  getExpenses: vi.fn(),
  updateExpense: vi.fn(),
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

describe("getExpenses controller", () => {
  const createResponse = () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns expenses with count", async () => {
    const expenses = [
      {
        _id: "expense-id",
        title: "Lunch",
        amount: 250,
        category: "food",
        date: new Date("2026-06-09"),
      },
    ];
    const req = { query: {} };
    const res = createResponse();
    const next = vi.fn();

    expenseService.getExpenses.mockResolvedValue(expenses);

    await getExpenses(req, res, next);

    expect(expenseService.getExpenses).toHaveBeenCalledWith({
      category: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Expenses fetched successfully",
      count: 1,
      data: expenses,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("passes service errors to the error middleware", async () => {
    const error = new Error("Database failed");
    const req = { query: { category: "food" } };
    const res = createResponse();
    const next = vi.fn();

    expenseService.getExpenses.mockRejectedValue(error);

    await getExpenses(req, res, next);

    expect(expenseService.getExpenses).toHaveBeenCalledWith({
      category: "food",
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("updateExpense controller", () => {
  const createResponse = () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates an expense and returns a 200 response", async () => {
    const payload = {
      title: "Updated lunch",
      amount: 300,
    };
    const updatedExpense = {
      _id: "expense-id",
      title: "Updated lunch",
      amount: 300,
      category: "food",
    };
    const req = { params: { id: "expense-id" }, body: payload };
    const res = createResponse();
    const next = vi.fn();

    expenseService.updateExpense.mockResolvedValue(updatedExpense);

    await updateExpense(req, res, next);

    expect(expenseService.updateExpense).toHaveBeenCalledWith(
      "expense-id",
      payload
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("passes update errors to the error middleware", async () => {
    const error = new Error("Database failed");
    const req = { params: { id: "expense-id" }, body: { title: "Lunch" } };
    const res = createResponse();
    const next = vi.fn();

    expenseService.updateExpense.mockRejectedValue(error);

    await updateExpense(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("deleteExpense controller", () => {
  const createResponse = () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes an expense and returns a 200 response", async () => {
    const req = { params: { id: "expense-id" } };
    const res = createResponse();
    const next = vi.fn();

    expenseService.deleteExpense.mockResolvedValue({ _id: "expense-id" });

    await deleteExpense(req, res, next);

    expect(expenseService.deleteExpense).toHaveBeenCalledWith("expense-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Expense deleted successfully",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("passes delete errors to the error middleware", async () => {
    const error = new Error("Database failed");
    const req = { params: { id: "expense-id" } };
    const res = createResponse();
    const next = vi.fn();

    expenseService.deleteExpense.mockRejectedValue(error);

    await deleteExpense(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
