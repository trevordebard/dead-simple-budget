import React, { useState, useEffect } from 'react';
import useBudget from '../hooks/useBudget';
import useInput from '../hooks/useInput';
import { getCategories } from '../lib/budgetUtils';

const Transactions = () => {
  const {
    state: { transactions },
  } = useBudget();
  return (
    <>
      <h1>Transactions</h1>
      {transactions.map(transaction => (
        <p key={`${transaction.label}-${transaction.amount}`}>
          {transaction.label}:{transaction.amount}
        </p>
      ))}
      <NewTransaction />
    </>
  );
};

const NewTransaction = () => {
  const { addTransaction, state } = useBudget();
  const [label, handleLabelChange, setLabel] = useInput('');
  const [amount, handleAmountChange, setAmount] = useInput('');
  const [date, handleDateChange, setDate] = useInput('');
  const [category, handleCategoryChange, setCategory] = useInput('');
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setCategories(getCategories(state.stacks));
  }, [state, state.stacks]);
  useEffect(() => {
    setCategory(categories[0]);
  }, [categories, setCategory]);
  const handleSubmit = e => {
    e.preventDefault();
    addTransaction(label, amount, category, date);
    setLabel('');
    setAmount('');
    setDate('');
    setCategory(categories[0]);
    console.log('submitted!');
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        Label: <input name="label" value={label} onChange={handleLabelChange} />
        Amount: <input name="amount" type="text" value={amount} onChange={handleAmountChange} />
        Date: <input name="date" type="text" value={date} onChange={handleDateChange} />
        <select name="category" value={category || categories[0]} onChange={handleCategoryChange}>
          {categories.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <input type="submit" value="Add" />
      </form>
    </>
  );
};
export default Transactions;
