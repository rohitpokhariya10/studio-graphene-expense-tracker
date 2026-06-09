import { useState } from "react";
import ExpenseForm from "./components/expenses/ExpenseForm.jsx";
import ExpenseTable from "./components/expenses/ExpenseTable.jsx";
import { useExpenses } from "./hooks/useExpenses.js";
import { formatCurrency } from "./utils/formatters.js";

const getMonthlyTotal = (expenses) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);

    if (
      expenseDate.getMonth() !== currentMonth ||
      expenseDate.getFullYear() !== currentYear
    ) {
      return total;
    }

    return total + Number(expense.amount);
  }, 0);
};

const App = () => {
  const { error, expenses, isLoading, refreshExpenses } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);
  const monthlyTotal = getMonthlyTotal(expenses);

  const handleExpenseSaved = async () => {
    await refreshExpenses();
    setEditingExpense(null);
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

            <ExpenseTable
              editingExpenseId={editingExpense?._id}
              error={error}
              expenses={expenses}
              isLoading={isLoading}
              onEditExpense={setEditingExpense}
              onRetry={refreshExpenses}
            />
          </div>

          <aside className="space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Monthly total
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {formatCurrency(monthlyTotal)}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Live
                </span>
              </div>
              <div className="mt-5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-600 transition-all"
                  style={{
                    width: `${Math.min((monthlyTotal / 10000) * 100, 100)}%`,
                  }}
                />
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Expense stream
              </h2>
              <div className="mt-5 space-y-3">
                {["Create an expense", "Review saved entries", "Track totals"].map(
                  (item, index) => (
                    <div
                      className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-3"
                      key={item}
                    >
                      <span className="flex size-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 shadow-sm">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-700">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default App;
