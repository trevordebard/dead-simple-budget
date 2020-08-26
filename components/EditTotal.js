import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import FormInput from './FormInput';
import { ActionButton } from './styled';
import useBudget from '../hooks/useBudget';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  * {
    margin-bottom: 5px;
  }
`;

const EditTotalWrapper = styled.div``;
const EditTotal = ({ total, budgetId }) => {
  const { register, handleSubmit } = useForm();
  const { updateTotal } = useBudget();

  const onSubmit = payload => {
    const { newTotal } = payload;
    updateTotal({
      variables: {
        total: parseFloat(newTotal),
        budgetId,
      },
    });
  };
  return (
    <EditTotalWrapper>
      <h3 style={{ marginBottom: 10 }}>Edit Total</h3>
      <Form method="POST" onSubmit={handleSubmit(onSubmit)}>
        <FormInput register={register} name="newTotal" type="number" defaultValue={total} />
        <ActionButton>Save</ActionButton>
      </Form>
    </EditTotalWrapper>
  );
};

export default EditTotal;
