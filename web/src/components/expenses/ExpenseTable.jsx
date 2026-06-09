import EmptyState from "../common/EmptyState.jsx";
import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const categoryLabels = EXPENSE_CATEGORIES.reduce((labels, category) => {
  labels[category.value] = category.label;
  return labels;
}, {});

const ExpenseTableSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((item) => (
      <div
        className="h-16 animate-pulse rounded-md border border-slate-100 bg-slate-50"
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
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
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
  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
    <p className="text-sm font-semibold text-red-800">Unable to load expenses</p>
    <p className="mt-2 text-sm leading-6 text-red-700">{message}</p>
    <button
      className="mt-4 rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Expense table
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Review the latest saved entries from your workspace.
          </p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
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
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid lg:grid-cols-[1fr_120px_120px_110px_150px]">
              <span>Expense</span>
              <span>Category</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <article
                  className={`grid gap-4 px-4 py-4 lg:grid-cols-[1fr_120px_120px_110px_150px] lg:items-center ${
                    editingExpenseId === expense._id ? "bg-emerald-50/60" : ""
                  }`}
                  key={expense._id}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
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
                      <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {categoryLabels[expense.category] ?? expense.category}
                      </span>
                    </div>
                    <div className="lg:contents">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                        Date
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 lg:contents">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
                        Amount
                      </p>
                      <p className="text-left text-sm font-semibold text-slate-950 lg:text-right">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                    <button
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      onClick={() => onEditExpense(expense)}
                      type="button"
                    >
                      {editingExpenseId === expense._id ? "Editing" : "Edit"}
                    </button>
                    <button
                      className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
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
