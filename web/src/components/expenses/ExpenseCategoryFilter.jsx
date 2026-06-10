import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories.js";

const inputClasses =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-950 shadow-sm shadow-slate-200/40 outline-none transition hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100";

const formatDateInputValue = (date) => date.toISOString().slice(0, 10);

const getCurrentMonthRange = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    endDate: formatDateInputValue(endOfMonth),
    startDate: formatDateInputValue(startOfMonth),
  };
};

const getPreviousMonthRange = () => {
  const today = new Date();
  const startOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    endDate: formatDateInputValue(endOfPreviousMonth),
    startDate: formatDateInputValue(startOfPreviousMonth),
  };
};

const ExpenseCategoryFilter = ({
  category,
  endDate,
  onChange,
  startDate,
}) => {
  const hasActiveFilters = Boolean(category || endDate || startDate);

  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Filters</h2>
          <p className="mt-1 text-sm text-slate-500">
            Narrow the table by category and transaction date.
          </p>
        </div>
        {hasActiveFilters ? (
          <button
            className="min-h-11 w-fit rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            onClick={() =>
              onChange({
                category: "",
                endDate: "",
                startDate: "",
              })
            }
            type="button"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="min-h-10 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          onClick={() => onChange(getCurrentMonthRange())}
          type="button"
        >
          This month
        </button>
        <button
          className="min-h-10 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
          onClick={() => onChange(getPreviousMonthRange())}
          type="button"
        >
          Last month
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <label
            className="text-sm font-semibold text-slate-700"
            htmlFor="category-filter"
          >
            Category
          </label>
          <select
            className={inputClasses}
            id="category-filter"
            onChange={(event) => onChange({ category: event.target.value })}
            value={category}
          >
            <option value="">All categories</option>
            {EXPENSE_CATEGORIES.map((categoryOption) => (
              <option key={categoryOption.value} value={categoryOption.value}>
                {categoryOption.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="text-sm font-semibold text-slate-700"
            htmlFor="start-date-filter"
          >
            Start date
          </label>
          <input
            className={inputClasses}
            id="start-date-filter"
            onChange={(event) => onChange({ startDate: event.target.value })}
            type="date"
            value={startDate}
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-slate-700"
            htmlFor="end-date-filter"
          >
            End date
          </label>
          <input
            className={inputClasses}
            id="end-date-filter"
            onChange={(event) => onChange({ endDate: event.target.value })}
            type="date"
            value={endDate}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseCategoryFilter;
