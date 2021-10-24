import { BudgetContext } from 'pages/budget';
import { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '../Styled';
import { useDeleteStack, useStack } from 'lib/hooks';
import { centsToDollars } from 'lib/money';

const EditStackWrapper = styled.div`
  margin: 1rem auto;
  padding: 0 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  p {
    margin-bottom: 1rem;
  }
`;
const EditBudgetStack = ({ id }: { id: number }) => {
  const budgetContext = useContext(BudgetContext);
  const { stack, isLoading } = useStack(id);
  const { mutate: deleteStack } = useDeleteStack();
  if (!isLoading && !stack) return null;
  return (
    <EditStackWrapper>
      <h4>{isLoading ? 'Loading...' : stack.label}</h4>
      <p>Amount: {!isLoading && centsToDollars(stack.amount)}</p>
      <Button
        outline
        small
        category="DANGER"
        onClick={() => {
          deleteStack({ stackId: id });
          budgetContext.setStackInFocus(null);
        }}
      >
        Delete Stack
      </Button>
      <Button small category="TRANSPARENT" onClick={() => budgetContext.setStackInFocus(null)}>
        Cancel
      </Button>
    </EditStackWrapper>
  );
};

export default EditBudgetStack;
