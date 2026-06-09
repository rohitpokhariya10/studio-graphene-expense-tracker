import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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

const CategoryPieChart = ({ data }) => {
  const hasData = data.length > 0;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
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
          <div className="mt-5 h-64">
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
                  {formatCurrency(category.amount)}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
          <p className="text-sm font-semibold text-slate-950">
            No chart data yet
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add expenses or clear filters to populate category distribution.
          </p>
        </div>
      )}
    </section>
  );
};

export default CategoryPieChart;
