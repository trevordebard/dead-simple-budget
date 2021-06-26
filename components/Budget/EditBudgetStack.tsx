import { gql } from '@apollo/client';
import { BudgetContext } from 'pages/budget';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Styled';
import useBudget from './useBudget';
import { fetchStackById } from './queries/getStackById';
import { useQuery } from 'react-query';
import { Stack } from '.prisma/client';

const GET_STACK = gql`
  query getStack($id: Int!) {
    stacks(where: { id: { equals: $id } }) {
      amount
      label
      id
    }
  }
`;

const DELETE_ONE_STACK = gql`
  mutation deleteOneStack($stackId: Int!) {
    deleteOneStack(where: { id: $stackId }) {
      id
    }
  }
`;
const EditStackWrapper = styled.div`
  margin: 1rem auto;
  padding: 0 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  h4 {
    font-weight: bold;
  }
  p {
    margin-bottom: 1rem;
  }
`;
const EditBudgetStack = ({ id }: { id: number }) => {
  const [stack, setStack] = useState<Stack>();
  const budgetContext = useContext(BudgetContext);
  const { data: fetchResponse, isLoading: loading } = useQuery([`fetch-stack-${id}`, { stackId: id }], fetchStackById);
  useEffect(() => {
    if (fetchResponse) {
      setStack(fetchResponse.data);
    }
  }, [fetchResponse]);
  const { deleteStack } = useBudget();
  if (!loading && !stack) return null;
  return (
    <EditStackWrapper>
      <h4>{loading ? 'Loading...' : stack.label}</h4>
      <p>Amount: {!loading && stack.amount}</p>
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
