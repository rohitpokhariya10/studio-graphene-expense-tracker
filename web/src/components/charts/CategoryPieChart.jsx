import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import EmptyState from "../common/EmptyState.jsx";
import { formatCurrency } from "../../utils/formatters.js";

const CHART_COLORS = [
  "#059669",
  "#0f172a",
  "#2563eb",
  "#d97706",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
  "#65a30d",
  "#64748b",
];

const CategoryTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const category = payload[0].payload;

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-slate-950">{category.label}</p>
      <p className="mt-1 text-sm text-slate-600">
        {formatCurrency(category.amount)} · {category.count}{" "}
        {category.count === 1 ? "entry" : "entries"}
      </p>
    </div>
  );
};

const CategoryPieChart = ({ data, hasActiveFilters, onClearFilters }) => {
  const hasData = data.length > 0;
  const totalAmount = data.reduce(
    (total, category) => total + Number(category.amount),
    0
  );
  const topCategory = data[0];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-dashboard-card sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Visualization
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          Category split
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          See where the visible expenses are concentrated.
        </p>
      </div>

      {hasData ? (
        <>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-500">
                Top category
              </p>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-lg font-semibold text-slate-950">
                  {topCategory.label}
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {formatCurrency(topCategory.amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-5 h-72">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={data}
                  dataKey="amount"
                  innerRadius={58}
                  nameKey="label"
                  outerRadius={88}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((category, index) => (
                    <Cell
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      key={category.category}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {data.slice(0, 5).map((category, index) => (
              <div
                className="flex items-center justify-between gap-4"
                key={category.category}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                  <p className="text-sm font-medium text-slate-700">
                    {category.label}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-950">
                  {Math.round((category.amount / totalAmount) * 100)}%
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5">
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
                ? "The current filters do not return expenses, so there is no category breakdown to show."
                : "Add expenses to populate category distribution."
            }
            icon="○"
            title={
              hasActiveFilters
                ? "No chart data for these filters"
                : "No chart data yet"
            }
          />
        </div>
      )}
    </section>
  );
};

export default CategoryPieChart;
