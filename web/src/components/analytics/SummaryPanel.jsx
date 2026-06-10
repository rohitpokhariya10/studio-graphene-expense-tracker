import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "../../utils/formatters.js";

const SummaryCard = ({ fullValue, label, value, helper }) => (
  <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-dashboard-soft transition hover:-translate-y-0.5 hover:shadow-dashboard-card">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p
      className="mt-2 max-w-full truncate text-[clamp(1.75rem,4vw,2.15rem)] font-semibold leading-tight text-slate-950"
      title={fullValue ?? value}
    >
      {value}
    </p>
    <p className="mt-3 text-sm leading-5 text-slate-500">{helper}</p>
  </article>
);

const MonthlyTotalCard = ({ monthLabel, monthlyTotal }) => {
  const visualBenchmark = 10000;
  const progress = Math.min((monthlyTotal / visualBenchmark) * 100, 100);

  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 p-5 text-white shadow-dashboard-soft">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-sm font-medium text-slate-300">Monthly total</p>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
            {monthLabel}
          </span>
        </div>
        <p
          className="max-w-full truncate text-[clamp(1.9rem,4vw,2.4rem)] font-semibold leading-tight"
          title={formatCurrency(monthlyTotal)}
        >
          {formatCompactCurrency(monthlyTotal)}
        </p>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/15">
        <div
          className="h-2 rounded-full bg-emerald-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-300">
        Visual progress against a Rs. 10,000 reference line.
      </p>
    </article>
  );
};

const HighestExpenseCard = ({ expense }) => (
  <article className="min-w-0 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-dashboard-soft">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-emerald-800">Highest expense</p>
        <h3 className="mt-2 truncate text-lg font-semibold text-slate-950">
          {expense?.title ?? "No expense yet"}
        </h3>
        <p className="mt-2 text-sm leading-5 text-slate-600">
          {expense
            ? `${formatDate(expense.date)} · ${expense.category}`
            : "Add expenses to identify your largest spend."}
        </p>
      </div>
      <p
        className="max-w-full truncate text-xl font-semibold leading-tight text-slate-950 sm:text-right"
        title={formatCurrency(expense?.amount ?? 0)}
      >
        {formatCompactCurrency(expense?.amount ?? 0)}
      </p>
    </div>
  </article>
);

const SummaryPanel = ({ summary }) => {
  const hasExpenses = summary.totalCount > 0;

  return (
    <section className="rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Analytics
        </p>
        <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl xl:text-2xl">
          Spending summary
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          A quick read on the expenses currently visible in your workspace.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        <SummaryCard
          helper="Total value across the visible expense list."
          label="Total spend"
          fullValue={formatCurrency(summary.totalAmount)}
          value={formatCompactCurrency(summary.totalAmount)}
        />
        <MonthlyTotalCard
          monthLabel={summary.monthLabel}
          monthlyTotal={summary.monthlyTotal}
        />
        <SummaryCard
          helper="Entries returned by active filters."
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
          fullValue={formatCurrency(summary.averageAmount)}
          value={formatCompactCurrency(summary.averageAmount)}
        />
      </div>

      <div className="mt-3">
        <HighestExpenseCard expense={summary.highestExpense} />
      </div>
    </section>
  );
};

export default SummaryPanel;
