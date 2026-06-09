import { useState } from "react";
import { formatCurrency } from "../../utils/formatters.js";
import { getStoredValue, setStoredValue } from "../../utils/storage.js";

const BUDGET_STORAGE_KEY = "expense-tracker-monthly-budget";

const BudgetTracker = ({ monthlyTotal }) => {
  const [budget, setBudget] = useState(() =>
    getStoredValue(BUDGET_STORAGE_KEY, "10000")
  );
  const numericBudget = Number(budget);
  const hasBudget = Number.isFinite(numericBudget) && numericBudget > 0;
  const progress = hasBudget
    ? Math.min((monthlyTotal / numericBudget) * 100, 100)
    : 0;
  const remainingBudget = hasBudget ? numericBudget - monthlyTotal : 0;
  const isOverBudget = hasBudget && remainingBudget < 0;
  const handleBudgetChange = (value) => {
    setBudget(value);
    setStoredValue(BUDGET_STORAGE_KEY, value);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-dashboard-card sm:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Bonus
        </p>
        <h2 className="text-xl font-semibold text-slate-950">
          Budget tracker
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Compare this month&apos;s spend against a target budget.
        </p>
      </div>

      <div className="mt-5">
        <label className="text-sm font-medium text-slate-700" htmlFor="budget">
          Monthly budget
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm shadow-slate-200/40 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          id="budget"
          min="0"
          onChange={(event) => handleBudgetChange(event.target.value)}
          step="100"
          type="number"
          value={budget}
        />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">Remaining</p>
          <p
            className={`text-lg font-semibold ${
              isOverBudget ? "text-red-700" : "text-slate-950"
            }`}
          >
            {formatCurrency(remainingBudget)}
          </p>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-200">
          <div
            className={`h-2 rounded-full transition-all ${
              isOverBudget ? "bg-red-600" : "bg-emerald-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-slate-500">
          {hasBudget
            ? `${formatCurrency(monthlyTotal)} spent this month.`
            : "Enter a budget greater than zero."}
        </p>
      </div>
    </section>
  );
};

export default BudgetTracker;
