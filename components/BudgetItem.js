import React, { useState } from 'react';

export const useInput = init => {
  const [input, setInput] = useState(init);
  const handleInputChange = e => setInput(e.currentTarget.value);
  return [input, handleInputChange];
};

const BudgetItem = ({ label, type, id, value }) => {
  const [total, changeTotal] = useInput(value || '');
  return (
    <label htmlFor={id}>
      {label}: <input id={id} type={type} value={total} onChange={changeTotal} />
    </label>
  );
};
export default BudgetItem;
