// Pass this to the reduce funtion to get the sum of all the values for each category in a budget
export const sumBudget = (acc, el) => {
  console.log('place');
  if (el.category && el.category !== 'ignore'.toLowerCase()) {
    return acc + (parseInt(el.value) || 0);
  }
};

export const getCategories = budget => {
  const categories = [];
  budget.forEach(el => categories.push(el.category));
  return categories;
};
