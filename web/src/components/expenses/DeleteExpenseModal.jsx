import { formatCurrency, formatDate } from "../../utils/formatters.js";

const DeleteExpenseModal = ({
  expense,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!expense) {
    return null;
  }

  return (
    <div
      aria-labelledby="delete-expense-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm sm:items-center"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-xl shadow-slate-950/20 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-lg font-semibold text-red-700">
            !
          </div>
          <div>
            <h2
              className="text-lg font-semibold text-slate-950"
              id="delete-expense-title"
            >
              Delete expense?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will permanently remove the selected expense from your
              records.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {expense.title}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(expense.date)}
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-950">
              {formatCurrency(expense.amount)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-red-300"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "Deleting..." : "Delete expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpenseModal;
