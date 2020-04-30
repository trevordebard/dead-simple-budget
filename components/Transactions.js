import React, { useState, useEffect } from 'react';
import useBudget from '../hooks/useBudget';
import useInput from '../hooks/useInput';
import { getStackLabels } from '../lib/budgetUtils';

const Transactions = () => {
  const {
    state: { transactions },
  } = useBudget();
  return (
    <>
      <h1>Transactions</h1>
      {transactions.map(transaction => (
        <p key={`${transaction.description}-${transaction.amount}`}>
          {transaction.description}:{transaction.amount}
        </p>
      ))}
      <NewTransaction />
    </>
  );
};

const NewTransaction = () => {
  const { addTransaction, state } = useBudget();
  const [description, handleLabelChange, setDescription] = useInput('');
  const [amount, handleAmountChange, setAmount] = useInput('');
  const [date, handleDateChange, setDate] = useInput('');
  const [stack, handleCategoryChange, setStack] = useInput('');
  const [stackLabels, setStackLabels] = useState([]);

  useEffect(() => {
    setStackLabels(getStackLabels(state.stacks));
  }, [state, state.stacks]);
  useEffect(() => {
    setStack(stackLabels[0]);
  }, [stackLabels, setStack]);
  const handleSubmit = e => {
    e.preventDefault();
    addTransaction(description, amount, stack, date);
    setDescription('');
    setAmount('');
    setDate('');
    setStack(stackLabels[0]);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        Description: <input name="description" value={description} onChange={handleLabelChange} />
        Amount: <input name="amount" type="text" value={amount} onChange={handleAmountChange} />
        Date: <input name="date" type="text" value={date} onChange={handleDateChange} />
        <select name="stack" value={stack || stackLabels[0]} onChange={handleCategoryChange}>
          {stackLabels.map(name => (
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
