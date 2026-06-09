import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories.js";

const ExpenseCategoryFilter = ({ value, onChange }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
          <p className="mt-1 text-sm text-slate-500">
            Narrow the table by spending category.
          </p>
        </div>
        {value ? (
          <button
            className="w-fit rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={() => onChange("")}
            type="button"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-4">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="category-filter"
        >
          Category
        </label>
        <select
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm shadow-slate-200/40 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          id="category-filter"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">All categories</option>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExpenseCategoryFilter;
