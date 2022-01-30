export function dollarsToCents(value: string | number) {
  let res = `${value}`.replace(/[^\d.-]/g, '');
  if (res && res.includes('.')) {
    res = res.substring(0, res.indexOf('.') + 3);
  }

  return value ? Math.round(parseFloat(res) * 100) : 0;
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
