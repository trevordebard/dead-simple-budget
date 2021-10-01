import React, { useState } from 'react';
import styled from 'styled-components';
import BudgetStack from './BudgetStack';
import { Button, Input } from 'components/Styled';
import EditableText from 'components/Shared/EditableText';
import { useAlert } from 'components/Alert';
import { useSession } from 'next-auth/client';
import { useUpdateUserTotal, useStacks, useUser, useCreateStack } from 'lib/hooks';
import { centsToDollars, dollarsToCents } from 'lib/money';

const ToplineBudget = styled.div`
  text-align: center;
  margin-bottom: 30px; /*TODO: temporary */
`;

const BudgetWrapper = styled.div`
  max-width: 85vw;
  margin: 0 auto;
  width: 400px;
`;
const Amount = styled.span<{ danger?: boolean; editable?: boolean }>`
  font-weight: 500;
  color: ${props => (props.danger ? 'var(--danger)' : 'var(--fontColor)')};
  ::before {
    content: '$';
  }
  span {
    &:hover {
      color: ${props => (props.editable ? 'var(--action)' : 'inherit')};
      cursor: ${props => (props.editable ? 'pointer' : 'inherit')};
    }
  }
`;
const SubText = styled.span`
  font-weight: 400;
  color: var(--fontColor-o60);
`;

const NewStackWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 10px 0px;
  grid-column-gap: 5px;
  white-space: nowrap;
`;

function Budget() {
  const { data: user, isLoading: isLoadingUser, error: userError } = useUser();
  const { data: stacks, isLoading: isLoadingStacks, error: stacksError } = useStacks();
  const { mutate: updateUserTotal } = useUpdateUserTotal();
  const [session] = useSession();
  const [editTotalVisible, setEditTotalVisible] = useState(false);
  if (isLoadingUser || isLoadingStacks) {
    return <span>loading...</span>;
  }
  if (userError || stacksError) {
    return <span>There was a problem</span>;
  }

  return (
    <BudgetWrapper>
      <ToplineBudget>
        <h1>Budget</h1>
        <h5>
          <Amount editable danger={user?.total < 0} onClick={() => setEditTotalVisible(!editTotalVisible)}>
            <EditableText
              text={centsToDollars(user.total)}
              update={total => {
                let newTotal = parseFloat(total);
                newTotal = dollarsToCents(newTotal);
                updateUserTotal({ email: session.user.email, total: newTotal });
              }}
              inputType="number"
            />
          </Amount>
          <SubText> in account</SubText>
        </h5>
        <h5>
          <Amount danger={user.toBeBudgeted < 0}>{centsToDollars(user.toBeBudgeted)}</Amount>
          <SubText> to be budgeted</SubText>
        </h5>
      </ToplineBudget>
      <Stacks stacks={stacks} budgetId={1} />
      <NewStackWrapper>
        <NewStack />
      </NewStackWrapper>
      <br />
    </BudgetWrapper>
  );
}

const Stacks = ({ stacks, budgetId }) => {
  if (stacks) {
    return stacks.map(item => (
      <div key={item.id}>
        <BudgetStack id={item.id} label={item.label} amount={item.amount} />
      </div>
    ));
  }
  return <></>;
};

const NewStack = () => {
  const { addAlert } = useAlert();
  const { mutate: createStack } = useCreateStack();
  const [newStack, setNewStack] = useState<string>('');
  const handleAddStack = (stackName: string) => {
    if (!newStack || newStack.trim() === '') {
      addAlert({ message: 'Stack name cannot be empty.', type: 'error' });
    } else {
      createStack({ label: newStack });
      setNewStack('');
    }
  };
  return (
    <>
      <Input
        name="newStack"
        placeholder="Stack Name"
        autoComplete="off"
        value={newStack}
        onChange={e => setNewStack(e.target.value)}
      />
      <Button category="ACTION" name="addStack" onClick={() => handleAddStack(newStack)}>
        Add Stack
      </Button>
    </>
  );
};
export default Budget;
