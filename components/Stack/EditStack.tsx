import { BudgetContext } from 'pages/budget';
import { useContext, useEffect } from 'react';
import { Button, Input } from '../Styled';
import { useDeleteStack, useStack, useUpdateStack } from 'lib/hooks';
import { centsToDollars, dollarsToCents } from 'lib/money';
import { SimpleFormWrapper } from 'components/Styled/SimpleFormWrapper';
import { useStackCategories } from 'lib/hooks/stack/useStackCategories';
import { useForm } from 'react-hook-form';
import { ErrorText } from 'components/Transactions/NewTransaction';
import { useQueryClient } from 'react-query';

const EditStack = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const budgetContext = useContext(BudgetContext);
  const { stack, isLoading } = useStack(id);
  const { data: stackCategories, isLoading: isLoadingStackCategories } = useStackCategories();
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();
  const { mutate: updateStack } = useUpdateStack();
  const { mutate: deleteStack } = useDeleteStack();

  useEffect(() => {
    reset(); // necessary for select defaultValue to update. Bad pattern?
  }, [stack, stackCategories, reset]);

  if (isLoading || !stack || isLoadingStackCategories) return <p>loading...</p>;
  const onSubmit = payload => {
    const amount = dollarsToCents(payload.amount);
    updateStack(
      { id: stack.id, label: stack.label, stackCategoryId: parseInt(payload.category), amount },
      { onSuccess: () => queryClient.invalidateQueries('fetch-stacks-by-category') }
    );
  };
  return (
    <SimpleFormWrapper onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '20px' }}>
        <h4>{isLoading ? 'Loading...' : stack.label}</h4>
      </div>
      <label htmlFor="amount">Amount {errors.description && <ErrorText> (Required)</ErrorText>}</label>
      <Input
        name="amount"
        {...register('amount', { required: true })}
        category="underline"
        type="text"
        value={centsToDollars(stack.amount)}
        autoComplete="off"
      />
      <label htmlFor="category">Category {errors.category && <ErrorText> (Required)</ErrorText>}</label>
      <select
        key={stack.id}
        name="category"
        {...register('category', { required: true })}
        defaultValue={stack.stackCategoryId}
      >
        {!isLoadingStackCategories &&
          stackCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
      </select>

      <Button category="ACTION">Save</Button>
      <hr />
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
    </SimpleFormWrapper>
  );
};

EditStack.whyDidYouRender = true;

export { EditStack };
