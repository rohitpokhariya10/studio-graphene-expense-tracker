import { describe, expect, it, vi } from "vitest";
import {
  validateCreateExpense,
  validateUpdateExpense,
} from "./validate-expense.js";

describe("validateCreateExpense middleware", () => {
  it("normalizes a valid create expense payload", () => {
    const req = {
      body: {
        title: "  Lunch  ",
        amount: "250",
        category: "food",
        date: "2026-06-09",
        note: "  Team lunch  ",
      },
    };
    const next = vi.fn();

    validateCreateExpense(req, {}, next);

    expect(req.body).toEqual({
      title: "Lunch",
      amount: 250,
      category: "food",
      date: new Date("2026-06-09"),
      note: "Team lunch",
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects missing required fields", () => {
    const req = { body: {} };
    const next = vi.fn();

    validateCreateExpense(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Expense validation failed",
        details: {
          title: "Title is required",
          amount: "Amount is required",
          category: "Category is required",
          date: "Date is required",
        },
      })
    );
  });

  it("rejects invalid field values", () => {
    const req = {
      body: {
        title: "A",
        amount: -10,
        category: "random",
        date: "not-a-date",
        note: "x".repeat(241),
      },
    };
    const next = vi.fn();

    validateCreateExpense(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Expense validation failed",
        details: {
          title: "Title must be between 2 and 80 characters",
          amount: "Amount must be greater than 0",
          category: "Category is invalid",
          date: "Date must be a valid date",
          note: "Note cannot exceed 240 characters",
        },
      })
    );
  });
});

describe("validateUpdateExpense middleware", () => {
  it("normalizes a partial update payload", () => {
    const req = {
      body: {
        title: "  Updated lunch  ",
        amount: "300",
      },
    };
    const next = vi.fn();

    validateUpdateExpense(req, {}, next);

    expect(req.body).toEqual({
      title: "Updated lunch",
      amount: 300,
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects an empty update payload", () => {
    const req = { body: {} };
    const next = vi.fn();

    validateUpdateExpense(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Expense validation failed",
        details: {
          body: "At least one field is required",
        },
      })
    );
  });

  it("rejects invalid update field values", () => {
    const req = {
      body: {
        amount: 0,
        category: "random",
      },
    };
    const next = vi.fn();

    validateUpdateExpense(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Expense validation failed",
        details: {
          amount: "Amount must be greater than 0",
          category: "Category is invalid",
        },
      })
    );
  });
});
