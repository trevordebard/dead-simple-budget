import { BudgetContext } from 'pages/budget';
import { useContext } from 'react';
import { Button } from '../Styled';
import { SimpleFormWrapper } from 'components/Styled/SimpleFormWrapper';
import { useDeleteStackCategory } from 'lib/hooks/stack/useDeleteStackCategory';
import { useStackCategory } from 'lib/hooks/stack/useStackCategory';

const EditStackCategory = ({ id }: { id: number }) => {
  const budgetContext = useContext(BudgetContext);
  const { mutate: deleteStackCategory } = useDeleteStackCategory();
  const { data: stackCategory, isLoading } = useStackCategory(id);
  return (
    <SimpleFormWrapper as="div">
      <h4 style={{ marginBottom: '20px' }}>{isLoading ? 'Loading...' : stackCategory.category}</h4>
      <Button
        outline
        small
        category="DANGER"
        onClick={e => {
          e.preventDefault();
          deleteStackCategory({ stackCategoryId: id });
          budgetContext.setCategoryInFocus(null);
        }}
      >
        Delete Category
      </Button>
      <Button
        small
        category="TRANSPARENT"
        onClick={e => {
          e.preventDefault();
          budgetContext.setCategoryInFocus(null);
        }}
      >
        Cancel
      </Button>
    </SimpleFormWrapper>
  );
};

export { EditStackCategory };
