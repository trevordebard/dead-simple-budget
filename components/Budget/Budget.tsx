import React, { useState } from 'react';
import styled from 'styled-components';
import EditableText from 'components/Shared/EditableText';
import { useSession } from 'next-auth/client';
import { useUpdateUserTotal, useStacks, useUser, useCreateStack } from 'lib/hooks';
import { centsToDollars, dollarsToCents } from 'lib/money';
import { CategorizedStacks, NewStack } from 'components/Stack';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { Button, Input } from 'components/Styled';
import { useCreateStackCategory } from 'lib/hooks/stack/useCreateStackCategory';
import { useQueryClient } from 'react-query';

const ToplineBudget = styled.div`
  text-align: center;
`;

const BudgetWrapper = styled.div`
  max-width: 85vw;
  margin: 0 auto;
  width: 400px;
`;
const Amount = styled.span<{ danger?: boolean; editable?: boolean }>`
  font-weight: 400;
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
      <AddCategory />
      <CategorizedStacks stacks={stacks} />
      <NewStackWrapper>
        <NewStack />
      </NewStackWrapper>
      <br />
    </BudgetWrapper>
  );
}

const AddCategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--grey-800);
  border-bottom: 1px dashed var(--grey-200);
  border-top: 1px dashed var(--grey-200);
  padding: 10px;
  margin: 10px 0;
`;
function AddCategory() {
  const queryClient = useQueryClient();

  const [isInputVisibile, setIsInputVisible] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const { mutate: createStackCategory } = useCreateStackCategory();
  const handleCreate = () => {
    createStackCategory(
      { category: newCategory },
      { onSuccess: () => queryClient.invalidateQueries('fetch-stacks-by-category') }
    );
    setNewCategory('');
    setIsInputVisible(false);
  };
  return (
    <AddCategoryWrapper>
      <div
        style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}
        onClick={() => setIsInputVisible(!isInputVisibile)}
      >
        <PlusCircleIcon width="20" />
        <p>Category</p>
      </div>
      {isInputVisibile && (
        <div style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
          <Input
            name="newStack"
            placeholder="Category Name"
            autoComplete="off"
            style={{ width: '100%' }}
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <Button category="ACTION" name="addStack" onClick={handleCreate}>
            Add
          </Button>
        </div>
      )}
    </AddCategoryWrapper>
  );
}

export { Budget };
