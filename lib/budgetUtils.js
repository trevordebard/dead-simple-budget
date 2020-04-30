// Pass this to the reduce funtion to get the sum of all the values for each category in a budget
export const sumStacks = (acc, el) => {
  if (el.label && el.label !== 'ignore'.toLowerCase()) {
    return acc + (parseInt(el.value) || 0);
  }
};

export const getStackLabels = budget => {
  const stackLabels = [];
  budget.forEach(el => stackLabels.push(el.label));
  return stackLabels;
};
