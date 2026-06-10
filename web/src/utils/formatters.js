export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const compactCurrencyUnits = [
  { suffix: "T", value: 1_000_000_000_000 },
  { suffix: "Cr", value: 10_000_000 },
  { suffix: "L", value: 100_000 },
  { suffix: "K", value: 1_000 },
];

const trimCompactNumber = (value) =>
  value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2).replace(/\.0+$/, "");

export const formatCompactCurrency = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return formatCurrency(0);
  }

  const absoluteAmount = Math.abs(numericAmount);
  const sign = numericAmount < 0 ? "-" : "";

  if (absoluteAmount >= 1_000_000_000_000_000) {
    return `${sign}₹${absoluteAmount.toExponential(2)}`;
  }

  const compactUnit = compactCurrencyUnits.find(
    (unit) => absoluteAmount >= unit.value
  );

  if (!compactUnit) {
    return formatCurrency(numericAmount);
  }

  return `${sign}₹${trimCompactNumber(absoluteAmount / compactUnit.value)}${compactUnit.suffix}`;
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
