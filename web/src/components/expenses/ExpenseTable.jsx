import EmptyState from "../common/EmptyState.jsx";
import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories.js";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "../../utils/formatters.js";

const categoryLabels = EXPENSE_CATEGORIES.reduce((labels, category) => {
  labels[category.value] = category.label;
  return labels;
}, {});

const ExpenseTableSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((item) => (
      <div
        className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-slate-50 sm:h-20"
        key={item}
      />
    ))}
  </div>
);

const ExpenseEmptyState = ({ hasActiveFilters, onClearFilters }) => (
  <EmptyState
    action={
      hasActiveFilters ? (
        <button
          className="min-h-11 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          onClick={onClearFilters}
          type="button"
        >
          Clear filters
        </button>
      ) : null
    }
    description={
      hasActiveFilters
        ? "Your expenses may exist, but the current category or date range is hiding them."
        : "Create your first expense and it will appear here with amount, category, and date details."
    }
    icon={hasActiveFilters ? "!" : "+"}
    title={
      hasActiveFilters
        ? "No expenses match these filters"
        : "No expenses recorded yet"
    }
  />
);

const ExpenseErrorState = ({ message, onRetry }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
    <p className="text-sm font-semibold text-red-800">Unable to load expenses</p>
    <p className="mt-2 text-sm leading-6 text-red-700">{message}</p>
    <button
      className="mt-4 min-h-11 rounded-2xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200"
      onClick={onRetry}
      type="button"
    >
      Retry
    </button>
  </div>
);

const ExpenseTable = ({
  editingExpenseId,
  error,
  expenses,
  hasActiveFilters,
  isLoading,
  onClearFilters,
  onDeleteExpense,
  onEditExpense,
  onRetry,
}) => {
  return (
    <section className="rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6 lg:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
            Expense table
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Review the latest saved entries from your workspace.
          </p>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600">
          {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="mt-6">
        {isLoading ? <ExpenseTableSkeleton /> : null}
        {!isLoading && error ? (
          <ExpenseErrorState message={error} onRetry={onRetry} />
        ) : null}
        {!isLoading && !error && expenses.length === 0 ? (
          <ExpenseEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
          />
        ) : null}
        {!isLoading && !error && expenses.length > 0 ? (
          <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white">
            <div className="hidden bg-slate-50/90 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid lg:grid-cols-[minmax(220px,1.35fr)_150px_150px_150px_170px]">
              <span>Expense</span>
              <span>Category</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <article
                  className={`grid gap-4 px-4 py-5 transition hover:bg-slate-50/80 sm:px-5 lg:grid-cols-[minmax(220px,1.35fr)_150px_150px_150px_170px] lg:items-center ${
                    editingExpenseId === expense._id ? "bg-emerald-50/70" : ""
                  }`}
                  key={expense._id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-950">
                      {expense.title}
                    </p>
                    {expense.note ? (
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                        {expense.note}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:contents">
                    <div className="lg:contents">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                        Category
                      </p>
                      <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        {categoryLabels[expense.category] ?? expense.category}
                      </span>
                    </div>
                    <div className="lg:contents">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                        Date
                      </p>
                      <p className="text-sm font-medium text-slate-600">
                        {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 lg:contents">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                        Amount
                      </p>
                      <p
                        className="text-left text-base font-semibold text-slate-950 lg:text-right"
                        title={formatCurrency(expense.amount)}
                      >
                        {formatCompactCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                    <button
                      className="min-h-11 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                      onClick={() => onEditExpense(expense)}
                      type="button"
                    >
                      {editingExpenseId === expense._id ? "Editing" : "Edit"}
                    </button>
                    <button
                      className="min-h-11 rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                      onClick={() => onDeleteExpense(expense)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ExpenseTable;
