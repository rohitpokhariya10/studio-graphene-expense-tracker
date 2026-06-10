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
import { formatCurrency, formatDate } from "./utils/formatters.js";

const navigationItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "add", label: "Add transaction" },
  { id: "transactions", label: "Transactions" },
  { id: "budgets", label: "Budgets" },
  { id: "analytics", label: "Analytics" },
];

const sectionTitles = {
  add: {
    eyebrow: "Capture",
    title: "Add transaction",
    description: "Create or update a transaction in a focused workspace.",
  },
  analytics: {
    eyebrow: "Reports",
    title: "Analytics",
    description: "Review category concentration and spending signals.",
  },
  budgets: {
    eyebrow: "Planning",
    title: "Budgets",
    description: "Set category budgets and track monthly progress.",
  },
  dashboard: {
    eyebrow: "Overview",
    title: "Finance dashboard",
    description: "A clean snapshot of spending, records, and quick actions.",
  },
  transactions: {
    eyebrow: "Records",
    title: "Transactions",
    description: "Filter, export, edit, and manage every saved expense.",
  },
};

const getCategoryLabel = (categoryValue) =>
  EXPENSE_CATEGORIES.find((category) => category.value === categoryValue)
    ?.label ?? categoryValue;

const MetricCard = ({ accent = "slate", helper, label, value }) => {
  const accentClasses = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <article className="rounded-[1.35rem] border border-white/70 bg-white p-5 shadow-dashboard-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 break-words text-3xl font-semibold leading-tight text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${accentClasses[accent]}`}
        >
          Live
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{helper}</p>
    </article>
  );
};

const RecentTransactionsPreview = ({ expenses, onViewAll }) => {
  const recentExpenses = expenses.slice(0, 4);

  return (
    <section className="rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Recent activity
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Recent transactions
          </h2>
        </div>
        <button
          className="min-h-11 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          onClick={onViewAll}
          type="button"
        >
          View all
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {recentExpenses.length > 0 ? (
          recentExpenses.map((expense) => (
            <article
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              key={expense._id}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {expense.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {getCategoryLabel(expense.category)} ·{" "}
                  {formatDate(expense.date)}
                </p>
              </div>
              <p className="text-base font-semibold text-slate-950">
                {formatCurrency(expense.amount)}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm leading-6 text-slate-500">
            No transactions yet. Add your first expense to populate this
            workspace.
          </div>
        )}
      </div>
    </section>
  );
};

const CategoryPreview = ({ categoryBreakdown, onOpenAnalytics }) => {
  const topCategories = categoryBreakdown.slice(0, 3);

  return (
    <section className="rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Analytics preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Category signals
          </h2>
        </div>
        <button
          className="min-h-11 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          onClick={onOpenAnalytics}
          type="button"
        >
          Reports
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {topCategories.length > 0 ? (
          topCategories.map((category) => (
            <div key={category.category}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-slate-700">
                  {category.label}
                </p>
                <p className="text-sm font-semibold text-slate-950">
                  {formatCurrency(category.amount)}
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-600"
                  style={{
                    width: `${Math.min(
                      (category.amount / topCategories[0].amount) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm leading-6 text-slate-500">
            Add expenses to unlock category insights.
          </p>
        )}
      </div>
    </section>
  );
};

const QuickActionsPanel = ({ onNavigate }) => (
  <section className="rounded-[1.5rem] border border-white/70 bg-slate-950 p-5 text-white shadow-dashboard-card sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
      Quick actions
    </p>
    <h2 className="mt-2 text-2xl font-semibold">Control center</h2>
    <p className="mt-2 text-sm leading-6 text-slate-300">
      Jump into the task you need without scanning the whole product.
    </p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Add expense", "add"],
        ["Review records", "transactions"],
        ["Set budgets", "budgets"],
        ["Open reports", "analytics"],
      ].map(([label, section]) => (
        <button
          className="min-h-16 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
          key={section}
          onClick={() => onNavigate(section)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  </section>
);

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
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const categoryBreakdown = getCategoryBreakdown(expenses, EXPENSE_CATEGORIES);
  const hasActiveFilters = Boolean(
    filters.category || filters.endDate || filters.startDate
  );
  const summary = getExpenseSummary(expenses);
  const clearFilters = () => setFilters(defaultFilters);
  const activeSectionMeta = sectionTitles[activeSection];

  const navigateTo = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileNavOpen(false);
  };

  const handleExpenseSaved = async () => {
    await refreshExpenses();
    setEditingExpense(null);
    setActiveSection("transactions");
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setActiveSection("add");
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
          requestError.userMessage ??
          "Unable to delete expense. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/90 px-5 py-6 shadow-dashboard-soft backdrop-blur xl:sticky xl:top-0 xl:block xl:h-screen">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-base font-semibold text-white">
              ET
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">
                Expense Tracker
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                Finance OS
              </p>
            </div>
          </div>

          <nav className="mt-8 space-y-2" aria-label="Primary navigation">
            {navigationItems.map((item) => (
              <button
                className={`flex min-h-12 w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-slate-200 ${
                  activeSection === item.id
                    ? "bg-slate-950 text-white shadow-dashboard-soft"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
                key={item.id}
                onClick={() => navigateTo(item.id)}
                type="button"
              >
                {item.label}
                {activeSection === item.id ? <span>•</span> : null}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-[1.35rem] border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Workspace status
            </p>
            <p className="mt-2 text-sm font-semibold text-emerald-950">
              {summary.totalCount}{" "}
              {summary.totalCount === 1 ? "transaction" : "transactions"} ·{" "}
              {summary.monthLabel}
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8 xl:hidden">
            <div className="flex items-center justify-between gap-3">
              <button
                className="flex items-center gap-3 rounded-2xl text-left focus:outline-none focus:ring-4 focus:ring-slate-200"
                onClick={() => navigateTo("dashboard")}
                type="button"
              >
                <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                  ET
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-950">
                    Expense Tracker
                  </span>
                  <span className="block text-xs font-medium text-slate-500">
                    {activeSectionMeta.title}
                  </span>
                </span>
              </button>
              <button
                aria-expanded={isMobileNavOpen}
                className="min-h-11 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-200"
                onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
                type="button"
              >
                Menu
              </button>
            </div>
            {isMobileNavOpen ? (
              <nav
                className="mt-3 grid gap-2 rounded-[1.35rem] border border-slate-200 bg-white p-2 shadow-dashboard-card sm:grid-cols-2"
                aria-label="Mobile navigation"
              >
                {navigationItems.map((item) => (
                  <button
                    className={`min-h-11 rounded-2xl px-4 py-2 text-left text-sm font-semibold transition ${
                      activeSection === item.id
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            ) : null}
          </header>

          <section className="flex w-full flex-col gap-6 px-4 pb-24 pt-5 sm:gap-7 sm:px-6 sm:py-7 lg:px-8 xl:px-10 xl:pb-8 2xl:px-12">
            <header className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-dashboard-card backdrop-blur sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {activeSectionMeta.eyebrow}
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                    {activeSectionMeta.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    {activeSectionMeta.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="min-h-12 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-dashboard-soft transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                    onClick={() => navigateTo("add")}
                    type="button"
                  >
                    Add transaction
                  </button>
                  <button
                    className="min-h-12 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                    onClick={() => navigateTo("transactions")}
                    type="button"
                  >
                    View records
                  </button>
                </div>
              </div>
            </header>

            {activeSection === "dashboard" ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  <MetricCard
                    accent="emerald"
                    helper="Total across the currently visible transaction set."
                    label="Visible spend"
                    value={formatCurrency(summary.totalAmount)}
                  />
                  <MetricCard
                    helper={`Current month: ${summary.monthLabel}`}
                    label="Monthly spending"
                    value={formatCurrency(summary.monthlyTotal)}
                  />
                  <MetricCard
                    helper="Records returned by filters and saved data."
                    label="Transactions"
                    value={summary.totalCount.toString()}
                  />
                  <MetricCard
                    accent="red"
                    helper={
                      summary.highestExpense
                        ? summary.highestExpense.title
                        : "Add expenses to reveal the largest spend."
                    }
                    label="Highest expense"
                    value={formatCurrency(summary.highestExpense?.amount ?? 0)}
                  />
                </div>

                <QuickActionsPanel onNavigate={navigateTo} />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
                  <RecentTransactionsPreview
                    expenses={expenses}
                    onViewAll={() => navigateTo("transactions")}
                  />
                  <CategoryPreview
                    categoryBreakdown={categoryBreakdown}
                    onOpenAnalytics={() => navigateTo("analytics")}
                  />
                </div>
              </div>
            ) : null}

            {activeSection === "add" ? (
              <section className="max-w-5xl rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6 lg:p-7">
                <ExpenseForm
                  editingExpense={editingExpense}
                  onCancelEdit={() => setEditingExpense(null)}
                  onExpenseSaved={handleExpenseSaved}
                />
              </section>
            ) : null}

            {activeSection === "transactions" ? (
              <div className="space-y-6">
                <section className="grid gap-4 rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Visible records
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      {expenses.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Visible value
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      {formatCurrency(summary.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Filter state
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-950">
                      {hasActiveFilters ? "Filtered view" : "All records"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Export uses the records currently visible below.
                    </p>
                  </div>
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

                <div className="flex justify-stretch sm:justify-end">
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
                  onEditExpense={handleEditExpense}
                  onRetry={refreshExpenses}
                />
              </div>
            ) : null}

            {activeSection === "budgets" ? (
              <div className="space-y-6">
                <section className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 shadow-dashboard-card sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Budget health
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-emerald-950">
                        Category limits for this month
                      </h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-800">
                        Budgets are saved to the shared workspace and compared
                        against the current month&apos;s category spend.
                      </p>
                    </div>
                    <p className="rounded-full border border-emerald-300 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-800">
                      {EXPENSE_CATEGORIES.length} categories
                    </p>
                  </div>
                </section>
                <BudgetTracker expenses={expenses} />
              </div>
            ) : null}

            {activeSection === "analytics" ? (
              <div className="space-y-6">
                <section className="grid gap-4 rounded-[1.5rem] border border-white/70 bg-white/95 p-5 shadow-dashboard-card sm:p-6 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Categories
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      {categoryBreakdown.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Top category
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {categoryBreakdown[0]?.label ?? "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Report basis
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-950">
                      {hasActiveFilters ? "Filtered data" : "All visible data"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Charts use the same records as the transaction table.
                    </p>
                  </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.68fr)_minmax(0,1fr)]">
                  <SummaryPanel summary={summary} />
                  <CategoryPieChart
                    data={categoryBreakdown}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                  />
                </div>
              </div>
            ) : null}
          </section>

          <nav
            className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-[1.35rem] border border-slate-200 bg-white/95 p-1.5 shadow-xl shadow-slate-950/15 backdrop-blur xl:hidden"
            aria-label="Quick section navigation"
          >
            {navigationItems.map((item) => (
              <button
                className={`min-h-12 rounded-2xl px-1.5 py-2 text-center text-[0.68rem] font-semibold transition focus:outline-none focus:ring-4 focus:ring-slate-200 sm:text-xs ${
                  activeSection === item.id
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                key={item.id}
                onClick={() => navigateTo(item.id)}
                type="button"
              >
                {item.id === "transactions" ? "Records" : item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

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
