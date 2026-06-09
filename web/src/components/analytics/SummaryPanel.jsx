import { formatCurrency, formatDate } from "../../utils/formatters.js";

const SummaryCard = ({ label, value, helper }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    <p className="mt-3 text-sm text-slate-500">{helper}</p>
  </article>
);

const MonthlyTotalCard = ({ monthLabel, monthlyTotal }) => {
  const visualBenchmark = 10000;
  const progress = Math.min((monthlyTotal / visualBenchmark) * 100, 100);

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">Monthly total</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(monthlyTotal)}
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
          {monthLabel}
        </span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/15">
        <div
          className="h-2 rounded-full bg-emerald-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Visual progress against a Rs. 10,000 reference line.
      </p>
    </article>
  );
};

const SummaryPanel = ({ summary }) => {
  const hasExpenses = summary.totalCount > 0;
  const highestExpense = summary.highestExpense;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Analytics
        </p>
        <h2 className="text-2xl font-semibold text-slate-950">
          Spending summary
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          A quick read on the expenses currently visible in your workspace.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <SummaryCard
          helper="Total value across the visible expense list."
          label="Total spend"
          value={formatCurrency(summary.totalAmount)}
        />
        <MonthlyTotalCard
          monthLabel={summary.monthLabel}
          monthlyTotal={summary.monthlyTotal}
        />
        <SummaryCard
          helper="Number of entries returned by the active filters."
          label="Entries"
          value={summary.totalCount.toString()}
        />
        <SummaryCard
          helper={
            hasExpenses
              ? "Average spend per visible expense."
              : "Add expenses to calculate an average."
          }
          label="Average expense"
          value={formatCurrency(summary.averageAmount)}
        />
      </div>

      <article className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/70 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Highest expense
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              {highestExpense?.title ?? "No expense yet"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {highestExpense
                ? `${formatDate(highestExpense.date)} · ${highestExpense.category}`
                : "Add expenses to identify your largest spend."}
            </p>
          </div>
          <p className="text-2xl font-semibold text-slate-950">
            {formatCurrency(highestExpense?.amount ?? 0)}
          </p>
        </div>
      </article>
    </section>
  );
};

export default SummaryPanel;
