export const formatLargeNumber = (value: string) => {
  // Convert string to number and handle invalid inputs
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";

  // Format numbers in billions/millions with 2 decimal places
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }

  // Format regular numbers with commas and 2 decimal places
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};
