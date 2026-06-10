import { buildExpensesCsv, downloadCsv } from "../../utils/csv.js";

const ExpenseExportButton = ({ expenses }) => {
  const isDisabled = expenses.length === 0;

  const handleExport = () => {
    const csvContent = buildExpensesCsv(expenses);
    const exportDate = new Date().toISOString().slice(0, 10);

    downloadCsv(`expense-export-${exportDate}.csv`, csvContent);
  };

  return (
    <button
      className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0 sm:w-auto"
      disabled={isDisabled}
      onClick={handleExport}
      type="button"
    >
      Export CSV
    </button>
  );
};

export default ExpenseExportButton;
