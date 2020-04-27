import React from 'react';
import useBudget from '../hooks/useBudget';
import useInput from '../hooks/useInput';

const Transactions = () => {
  console.log('placeholder');
  return (
    <>
      <h1>Transactions</h1>
      <NewTransaction />
    </>
  );
};

const NewTransaction = () => {
  const { addTransaction } = useBudget();
  const [label, handleLabelChange] = useInput();
  const [amount, handleAmountChange] = useInput();
  const [date, handleDateChange] = useInput();
  const [category, handleCategoryChange] = useInput();
  const handleSubmit = e => {
    e.preventDefault();
    addTransaction(label, amount, category, date);
    console.log('submitted!');
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        Label: <input name="label" type="text" value={label} onChange={handleLabelChange} />
        Amount: <input name="amount" type="text" value={amount} onChange={handleAmountChange} />
        Date: <input name="date" type="text" value={date} onChange={handleDateChange} />
        Category: <input name="category" type="text" value={category} onChange={handleCategoryChange} />
        <input type="submit" value="Add" />
      </form>
    </>
  );
};
export default Transactions;
