import { useEffect, useMemo, useState } from "react";
import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories.js";
import { getBudgets, updateBudgets } from "../../services/budgetApi.js";
import { formatCurrency } from "../../utils/formatters.js";

const getCurrentMonthSpendByCategory = (expenses) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.reduce((spendByCategory, expense) => {
    const expenseDate = new Date(expense.date);

    if (
      expenseDate.getMonth() !== currentMonth ||
      expenseDate.getFullYear() !== currentYear
    ) {
      return spendByCategory;
    }

    spendByCategory[expense.category] =
      (spendByCategory[expense.category] ?? 0) + Number(expense.amount);

    return spendByCategory;
  }, {});
};

const getInitialBudgetValues = () =>
  EXPENSE_CATEGORIES.reduce((values, category) => {
    values[category.value] = "0";
    return values;
  }, {});

const normalizeBudgetResponse = (budgets) =>
  budgets.reduce((values, budget) => {
    values[budget.category] = String(Number(budget.amount));
    return values;
  }, getInitialBudgetValues());

const BudgetTracker = ({ expenses }) => {
  const [budgetValues, setBudgetValues] = useState(getInitialBudgetValues);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const spendByCategory = useMemo(
    () => getCurrentMonthSpendByCategory(expenses),
    [expenses]
  );
  const handleBudgetChange = (category, value) => {
    setBudgetValues((currentValues) => ({
      ...currentValues,
      [category]: value,
    }));
    setSaveMessage(null);
    setError(null);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await updateBudgets(
        EXPENSE_CATEGORIES.map((category) => ({
          amount: Number(budgetValues[category.value] || 0),
          category: category.value,
        }))
      );

      setBudgetValues(normalizeBudgetResponse(response.data ?? []));
      setSaveMessage("Category budgets saved.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          requestError.userMessage ??
          "Unable to save budgets. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getBudgets();
        setBudgetValues(normalizeBudgetResponse(response.data ?? []));
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ??
            requestError.userMessage ??
            "Unable to load budgets. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <section className="rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Bonus
        </p>
        <h2 className="text-2xl font-semibold text-slate-950">
          Category budgets
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Compare this month&apos;s spend against a target for each category.
        </p>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {EXPENSE_CATEGORIES.map((category) => {
            const budget = Number(budgetValues[category.value] || 0);
            const spent = spendByCategory[category.value] ?? 0;
            const hasBudget = Number.isFinite(budget) && budget > 0;
            const remaining = hasBudget ? budget - spent : 0;
            const isOverBudget = hasBudget && remaining < 0;
            const progress = hasBudget
              ? Math.min((spent / budget) * 100, 100)
              : 0;

            return (
              <div
                className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-dashboard-soft ${
                  isOverBudget
                    ? "border-red-200 bg-red-50/70"
                    : "border-slate-200 bg-slate-50/80"
                }`}
                key={category.value}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label
                      className="text-sm font-semibold text-slate-950"
                      htmlFor={`budget-${category.value}`}
                    >
                      {category.label}
                    </label>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {formatCurrency(spent)} spent this month
                    </p>
                  </div>
                  <p
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isOverBudget
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {hasBudget
                      ? isOverBudget
                        ? `${formatCurrency(Math.abs(remaining))} over`
                        : `${formatCurrency(remaining)} left`
                      : "No limit"}
                  </p>
                </div>

                <input
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm shadow-slate-200/40 outline-none transition hover:border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  disabled={isLoading || isSaving}
                  id={`budget-${category.value}`}
                  min="0"
                  onChange={(event) =>
                    handleBudgetChange(category.value, event.target.value)
                  }
                  step="100"
                  type="number"
                  value={budgetValues[category.value]}
                />

                <div className="mt-3 h-2.5 rounded-full bg-slate-200">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      isOverBudget ? "bg-red-600" : "bg-emerald-600"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {saveMessage ? (
            <p className="text-sm font-medium text-emerald-700">
              {saveMessage}
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Set 0 to leave a category without a limit.
            </p>
          )}
          <button
            className="min-h-12 rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:translate-y-0"
            disabled={isLoading || isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save budgets"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BudgetTracker;
