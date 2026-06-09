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
  // Summary is based on the currently visible list, so filters update analytics instantly.
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

export const getCategoryBreakdown = (expenses, categories) => {
  const categoryLabels = categories.reduce((labels, category) => {
    labels[category.value] = category.label;
    return labels;
  }, {});

  return expenses
    .reduce((breakdown, expense) => {
      const existingCategory = breakdown.find(
        (item) => item.category === expense.category
      );

      if (existingCategory) {
        existingCategory.amount += Number(expense.amount);
        existingCategory.count += 1;
        return breakdown;
      }

      breakdown.push({
        amount: Number(expense.amount),
        category: expense.category,
        count: 1,
        label: categoryLabels[expense.category] ?? expense.category,
      });

      return breakdown;
    }, [])
    .sort((firstCategory, secondCategory) => secondCategory.amount - firstCategory.amount);
};
