import mongoose from "mongoose";

export const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "shopping",
  "bills",
  "health",
  "entertainment",
  "travel",
  "education",
  "other",
];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
      minlength: [2, "Expense title must be at least 2 characters"],
      maxlength: [80, "Expense title cannot exceed 80 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0.01, "Expense amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Expense category is required"],
      enum: {
        values: EXPENSE_CATEGORIES,
        message: "Expense category is invalid",
      },
    },
    date: {
      type: Date,
      required: [true, "Expense date is required"],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [240, "Expense note cannot exceed 240 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });

export const Expense = mongoose.model("Expense", expenseSchema);
