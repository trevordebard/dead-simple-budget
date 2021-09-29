import { useState, memo, useContext } from 'react';
import styled from 'styled-components';
import { evaluate } from 'mathjs';
import { ListRow } from '../Styled';
import { BudgetContext } from 'pages/budget';
import { useUpdateStack } from 'lib/hooks';
import { centsToDollars, dollarsToCents } from 'lib/money';

const StackInput = styled.input<{ danger: boolean }>`
  text-align: right;
  border: none;
  background-color: ${props => (props.danger ? 'var(--dangerSubtle)' : 'transparent')};
  border-radius: 5px;
  padding: 5px 10px;
  max-width: 100px;
  :hover {
    background-color: ${props => !props.danger && 'var(--rowHoverDark)'};
    border: ${props => props.danger && '1px solid var(--danger)'};
  }
`;

const BudgetStack = ({ label, amount, id }) => {
  const [prevAmount, setPrevAmount] = useState<number>(amount);
  const { mutate: updateStack } = useUpdateStack();
  const budgetContext = useContext(BudgetContext);
  const handleRowClick = () => {
    if (budgetContext.stackInFocus === id) {
      budgetContext.setStackInFocus(null);
    } else {
      budgetContext.setStackInFocus(id);
    }
  };
  return (
    <ListRow selected={id === budgetContext.stackInFocus} onClick={handleRowClick}>
      <p>{label} </p>
      <StackInput
        name={label}
        type=""
        defaultValue={centsToDollars(amount)}
        danger={amount < 0}
        onClick={e => e.stopPropagation()} // Prevent ListRow from being selected
        onBlur={e => {
          const newVal = evaluate(e.target.value);
          // Prevent api call if vlaue didn't change
          if (newVal !== prevAmount) {
            updateStack({ id, label, amount: dollarsToCents(newVal) });
            setPrevAmount(newVal);
          }
        }}
      />
    </ListRow>
  );
};
export default memo(BudgetStack);
