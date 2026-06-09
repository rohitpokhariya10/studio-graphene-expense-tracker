import { useState } from "react";
import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories.js";
import { createExpense } from "../../services/expenseApi.js";

const initialFormValues = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

const validateForm = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  } else if (values.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters";
  }

  if (!values.amount) {
    errors.amount = "Amount is required";
  } else if (Number(values.amount) <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!values.category) {
    errors.category = "Category is required";
  }

  if (!values.date) {
    errors.date = "Date is required";
  }

  if (values.note.length > 240) {
    errors.note = "Note cannot exceed 240 characters";
  }

  return errors;
};

const inputClasses =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm shadow-slate-200/40 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const labelClasses = "text-sm font-medium text-slate-700";

const FieldError = ({ message }) => {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
};

const ExpenseForm = () => {
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
    setSubmitState(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitState(null);

    try {
      await createExpense({
        title: values.title.trim(),
        amount: Number(values.amount),
        category: values.category,
        date: values.date,
        note: values.note.trim(),
      });

      setValues(initialFormValues);
      setSubmitState({
        type: "success",
        message: "Expense created successfully.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error.response?.data?.message ??
          "Unable to create expense. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">
          Add expense
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Keep each entry simple, accurate, and easy to reconcile later.
        </p>
      </div>

      {submitState ? (
        <div
          className={`rounded-md border px-4 py-3 text-sm font-medium ${
            submitState.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {submitState.message}
        </div>
      ) : null}

      <div>
        <label className={labelClasses} htmlFor="title">
          Title
        </label>
        <input
          className={inputClasses}
          id="title"
          name="title"
          onChange={handleChange}
          placeholder="Lunch, cab, groceries"
          type="text"
          value={values.title}
        />
        <FieldError message={errors.title} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="amount">
            Amount
          </label>
          <input
            className={inputClasses}
            id="amount"
            min="0"
            name="amount"
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={values.amount}
          />
          <FieldError message={errors.amount} />
        </div>

        <div>
          <label className={labelClasses} htmlFor="date">
            Date
          </label>
          <input
            className={inputClasses}
            id="date"
            name="date"
            onChange={handleChange}
            type="date"
            value={values.date}
          />
          <FieldError message={errors.date} />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="category">
          Category
        </label>
        <select
          className={inputClasses}
          id="category"
          name="category"
          onChange={handleChange}
          value={values.category}
        >
          <option value="">Select category</option>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.category} />
      </div>

      <div>
        <label className={labelClasses} htmlFor="note">
          Note
        </label>
        <textarea
          className={`${inputClasses} min-h-28 resize-y`}
          id="note"
          maxLength={240}
          name="note"
          onChange={handleChange}
          placeholder="Optional context"
          value={values.note}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <FieldError message={errors.note} />
          <p className="ml-auto text-xs text-slate-500">
            {values.note.length}/240
          </p>
        </div>
      </div>

      <button
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Saving expense..." : "Save expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;
