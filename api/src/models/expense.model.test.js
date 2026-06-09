import { describe, expect, it } from "vitest";
import { Expense, EXPENSE_CATEGORIES } from "./expense.model.js";

describe("Expense model", () => {
  it("validates a valid expense payload", async () => {
    const expense = new Expense({
      title: "Lunch",
      amount: 250,
      category: "food",
      date: new Date("2026-06-09"),
      note: "Team lunch",
    });

    await expect(expense.validate()).resolves.toBeUndefined();
  });

  it("requires title, amount, category, and date", async () => {
    const expense = new Expense({});

    await expect(expense.validate()).rejects.toMatchObject({
      errors: {
        title: expect.any(Object),
        amount: expect.any(Object),
        category: expect.any(Object),
      },
    });
  });

  it("rejects invalid amount and category values", async () => {
    const expense = new Expense({
      title: "Cab",
      amount: 0,
      category: "invalid",
      date: new Date("2026-06-09"),
    });

    await expect(expense.validate()).rejects.toMatchObject({
      errors: {
        amount: expect.any(Object),
        category: expect.any(Object),
      },
    });
  });

  it("keeps category options centralized", () => {
    expect(EXPENSE_CATEGORIES).toContain("food");
    expect(EXPENSE_CATEGORIES).toContain("other");
  });
});
