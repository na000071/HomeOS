const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatExpenseAmount = (amount: number): string =>
  currencyFormatter.format(amount);
