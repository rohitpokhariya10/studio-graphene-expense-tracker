export const getMonthlyTotal = (expenses) => {
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

export const getExpenseSummary = (expenses) => {
  const now = new Date();
  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const highestExpense = expenses.reduce((highest, expense) => {
    if (!highest || Number(expense.amount) > Number(highest.amount)) {
      return expense;
    }

    return highest;
  }, null);
  const monthlyTotal = getMonthlyTotal(expenses);
  const totalCount = expenses.length;

  return {
    averageAmount: totalCount > 0 ? totalAmount / totalCount : 0,
    highestExpense,
    monthLabel: new Intl.DateTimeFormat("en-IN", {
      month: "long",
      year: "numeric",
    }).format(now),
    monthlyTotal,
    totalAmount,
    totalCount,
  };
};
