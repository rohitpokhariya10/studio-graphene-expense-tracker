import { formatCurrency } from "../../utils/formatters.js";

const SummaryCard = ({ label, value, helper }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    <p className="mt-3 text-sm text-slate-500">{helper}</p>
  </article>
);

const SummaryPanel = ({ summary }) => {
  const hasExpenses = summary.totalCount > 0;

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
        <SummaryCard
          helper="Current calendar month based on expense dates."
          label="Monthly total"
          value={formatCurrency(summary.monthlyTotal)}
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
    </section>
  );
};

export default SummaryPanel;
