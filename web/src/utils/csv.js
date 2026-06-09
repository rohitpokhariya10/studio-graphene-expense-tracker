const escapeCsvValue = (value) => {
  const stringValue = String(value ?? "");

  // RFC-style escaping keeps commas, quotes, and multiline notes importable in spreadsheets.
  if (
    stringValue.includes(",") ||
    stringValue.includes("\"") ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll("\"", "\"\"")}"`;
  }

  return stringValue;
};

export const buildExpensesCsv = (expenses) => {
  const headers = ["Title", "Amount", "Category", "Date", "Note"];
  const rows = expenses.map((expense) => [
    expense.title,
    expense.amount,
    expense.category,
    new Date(expense.date).toISOString().slice(0, 10),
    expense.note,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
};

export const downloadCsv = (filename, csvContent) => {
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};
