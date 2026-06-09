import { useState } from "react";
import SummaryPanel from "./components/analytics/SummaryPanel.jsx";
import BudgetTracker from "./components/bonus/BudgetTracker.jsx";
import CategoryPieChart from "./components/charts/CategoryPieChart.jsx";
import DeleteExpenseModal from "./components/expenses/DeleteExpenseModal.jsx";
import ExpenseCategoryFilter from "./components/expenses/ExpenseCategoryFilter.jsx";
import ExpenseExportButton from "./components/expenses/ExpenseExportButton.jsx";
import ExpenseForm from "./components/expenses/ExpenseForm.jsx";
import ExpenseTable from "./components/expenses/ExpenseTable.jsx";
import { EXPENSE_CATEGORIES } from "./constants/expenseCategories.js";
import { useExpenses } from "./hooks/useExpenses.js";
import { deleteExpense } from "./services/expenseApi.js";
import {
  getCategoryBreakdown,
  getExpenseSummary,
} from "./utils/analytics.js";

const App = () => {
  const defaultFilters = {
    category: "",
    endDate: "",
    startDate: "",
  };
  const [filters, setFilters] = useState({
    ...defaultFilters,
  });
  const { error, expenses, isLoading, refreshExpenses } = useExpenses({
    category: filters.category,
    endDate: filters.endDate,
    startDate: filters.startDate,
  });
  const [deleteError, setDeleteError] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const categoryBreakdown = getCategoryBreakdown(expenses, EXPENSE_CATEGORIES);
  const hasActiveFilters = Boolean(
    filters.category || filters.endDate || filters.startDate
  );
  const summary = getExpenseSummary(expenses);
  const clearFilters = () => setFilters(defaultFilters);

  const handleExpenseSaved = async () => {
    await refreshExpenses();
    setEditingExpense(null);
  };

  const handleDeleteExpense = async () => {
    if (!deletingExpense) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteExpense(deletingExpense._id);
      await refreshExpenses();

      if (editingExpense?._id === deletingExpense._id) {
        setEditingExpense(null);
      }

      setDeletingExpense(null);
    } catch (requestError) {
      setDeleteError(
        requestError.response?.data?.message ??
          "Unable to delete expense. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Expense tracker
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Record spending with clear categorization and reliable validation.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Ready to capture
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
              <ExpenseForm
                editingExpense={editingExpense}
                onCancelEdit={() => setEditingExpense(null)}
                onExpenseSaved={handleExpenseSaved}
              />
            </section>

            <ExpenseCategoryFilter
              category={filters.category}
              endDate={filters.endDate}
              onChange={(nextFilters) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  ...nextFilters,
                }))
              }
              startDate={filters.startDate}
            />

            <div className="flex justify-end">
              <ExpenseExportButton expenses={expenses} />
            </div>

            <ExpenseTable
              editingExpenseId={editingExpense?._id}
              error={error}
              expenses={expenses}
              hasActiveFilters={hasActiveFilters}
              isLoading={isLoading}
              onClearFilters={clearFilters}
              onDeleteExpense={(expense) => {
                setDeleteError(null);
                setDeletingExpense(expense);
              }}
              onEditExpense={setEditingExpense}
              onRetry={refreshExpenses}
            />
          </div>

          <aside className="space-y-4">
            <SummaryPanel summary={summary} />
            <BudgetTracker monthlyTotal={summary.monthlyTotal} />
            <CategoryPieChart
              data={categoryBreakdown}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          </aside>
        </div>
      </section>

      {deleteError ? (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg">
          {deleteError}
        </div>
      ) : null}

      <DeleteExpenseModal
        expense={deletingExpense}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteError(null);
            setDeletingExpense(null);
          }
        }}
        onConfirm={handleDeleteExpense}
      />
    </main>
  );
};

export default App;
