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
  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const monthlyTotal = getMonthlyTotal(expenses);
  const totalCount = expenses.length;

  return {
    averageAmount: totalCount > 0 ? totalAmount / totalCount : 0,
    monthlyTotal,
    totalAmount,
    totalCount,
  };
};
