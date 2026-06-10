import mongoose from "mongoose";
import { EXPENSE_CATEGORIES } from "./expense.model.js";

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Budget category is required"],
      enum: {
        values: EXPENSE_CATEGORIES,
        message: "Budget category is invalid",
      },
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0, "Budget amount cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Budget = mongoose.model("Budget", budgetSchema);
