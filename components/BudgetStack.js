import { useState } from 'react';
import Input from './Input';

const BudgetStack = ({ label, register, budgetId, value, errors, updateStack, removeStack }) => {
  const [prevValue, setPrevValue] = useState(value);
  return (
    <>
      {label}:{' '}
      <Input
        name={label}
        type="number"
        defaultValue={value}
        register={register}
        onBlur={e => {
          const newVal = parseFloat(e.target.value);
          // Prevent api call if vlaue didn't change
          if (newVal !== prevValue) {
            updateStack({
              variables: {
                budgetId,
                label,
                value: newVal,
              },
            });
            setPrevValue(newVal);
          }
        }}
      />
      <Input
        type="button"
        value="Delete"
        onClick={e => {
          removeStack({
            variables: {
              budgetId,
              label,
            },
          });
        }}
      />
    </>
  );
};
export default BudgetStack;
