import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories.js";

const inputClasses =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm shadow-slate-200/40 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

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
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
          <p className="mt-1 text-sm text-slate-500">
            Narrow the table by category and transaction date.
          </p>
        </div>
        {hasActiveFilters ? (
          <button
            className="w-fit rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
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
          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          onClick={() => onChange(getCurrentMonthRange())}
          type="button"
        >
          This month
        </button>
        <button
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          onClick={() => onChange(getPreviousMonthRange())}
          type="button"
        >
          Last month
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div>
          <label
            className="text-sm font-medium text-slate-700"
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
            className="text-sm font-medium text-slate-700"
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
            className="text-sm font-medium text-slate-700"
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
