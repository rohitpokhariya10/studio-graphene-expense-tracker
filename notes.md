# 1

budget.service.js ke saare exports ko ek object me daal do

# 2

# .reduce((accumulator , item)=> { // logic , {}})

const normalizeBudgets = (budgets) => {
const budgetByCategory = budgets.reduce((budgetMap, budget) => {
budgetMap[budget.category] = {
amount: Number(budget.amount),
category: budget.category,
};
return budgetMap;
}, {});

return EXPENSE_CATEGORIES.map(
(category) => budgetByCategory[category] ?? createDefaultBudget(category)
);
};

#

{ new: true, runValidators: true, upsert: true }

# web

#

Frontend mein modular folder structure follow kiya gaya hai jahan files ko unke responsibility ke basis par separate kiya gaya hai. UI components ko components folder mein rakha gaya hai, API calls ko services mein, reusable logic ko hooks mein, constants ko constants mein, aur helper functions ko utils mein. Isse code maintainable, reusable aur scalable banta hai.

Folder Structure : Feature-based layered structure

#

API Usage Short Notes
expenseApi.js
getExpenses()
Used in:
useExpenses.js
Purpose:
Expense list fetch karne ke liye
createExpense()
Used in:
ExpenseForm.jsx
Purpose:
New expense add karne ke liye
updateExpense()
Used in:
ExpenseForm.jsx
Purpose:
Existing expense edit/update karne ke liye
deleteExpense()
Used in:
App.jsx
Purpose:
Expense delete karne ke liye
budgetApi.js
getBudgets()
Used in:
BudgetTracker.jsx
Purpose:
Budgets fetch/display karne ke liye
updateBudgets()
Used in:
BudgetTracker.jsx
Purpose:
Budget amount update/save karne ke liye
Very short interview line:
Expense APIs are used in useExpenses, ExpenseForm, and App.jsx, while budget APIs are used in BudgetTracker.jsx.

#
Binary Large Object

Blob kisi bhi raw data ko file jaisa bana deta hai, jaise CSV, image, PDF, text file, etc.

#
useExpenses ek custom hook hai jo backend API call karke expenses data fetch karta hai, us data ko state me save karta hai, loading state manage karta hai, aur agar API call fail ho jaye toh error state bhi manage karta hai.
Is hook ko hum App.jsx me use kar rahe hain:

# useExpenses.js
expenses      -> expense list
isLoading     -> data load ho raha hai ya nahi
error         -> API error hai ya nahi
refreshExpenses -> data dobara fetch karne ke liye

#
refreshExpenses backend ko dobara call karta hai, aur current filters ke saath latest data laata hai.