export function dollarsToCents(value: string | number) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error('Amount passed must be of type String or Number.');
  }

  return Math.round(100 * parseFloat(typeof value === 'string' ? value.replace(/[$,]/g, '') : value.toString()));
}

export function centsToDollars(amount = 0) {
  const options = {
    style: 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  // check if its a clean dollar amount
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-US', options);

  return formatter.format(amount / 100);
}

export function formatDollars(amountInDollars: string | number) {
  let amount = amountInDollars;
  if (typeof amountInDollars === 'string') {
    // @ts-ignore
    amount = parseFloat(amount);
  }
  amount = Number(amount);

  const options = {
    style: 'currency',
    // style: 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  // check if its a clean dollar amount
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-US', options);
  return formatter.format(amount);
}
