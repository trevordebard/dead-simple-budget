// Pass this to the reduce funtion to get the sum of all the values for each category in a budget
export const sumBudget = (acc, el) => acc + parseInt(el.value);
