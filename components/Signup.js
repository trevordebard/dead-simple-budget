import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { ADD_USER } from '../lib/queries/ADD_USER';
import FormInput from './FormInput';
import { ActionButton } from './styled';

const Form = styled.form`
  * {
    display: block;
  }
`;

const SignUpWrapper = styled.div`
  display: grid;
  place-items: center;
  margin-top: 5rem;
`;

const Content = styled.div`
  width: 400px;
  max-width: 80vw;
  h1 {
    font-weight: 600;
  }
  hr {
    width: 100%;
    margin: 1rem;
    border: 0;
    height: 0;
    border-top: 1px solid rgba(0, 0, 0, 0);
    border-bottom: 1px solid var(--lineColor);
  }
  label,
  button {
    margin-top: 1rem;
  }
`;

const Card = styled.div`
  box-shadow: var(--level3);
  border-radius: 5px;
  padding: 20px;
  display: grid;
  place-items: center;
  border: 1px solid var(--lineColor);
  background-color: white;
`;

const Signup = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const router = useRouter();
  const [addUser, { loading, error }] = useMutation(ADD_USER, { onCompleted: () => router.push('/') });
  const onSubmit = data => {
    const { email, password } = data;
    addUser({
      variables: { email, password },
    });
    reset();
  };
  return (
    <SignUpWrapper>
      <Content>
        <Card>
          <h2>Signup</h2>
          <hr />
          <Form method="POST" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <FormInput register={register} errors={errors} name="email" type="email" required />
            <label htmlFor="password">Password</label>
            <FormInput register={register} errors={errors} name="password" type="password" required />
            <ActionButton style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Loading...' : 'Signup'}
            </ActionButton>
            {error && <p style={{ color: 'red' }}>There was an error logging in. Please try again!</p>}
          </Form>
        </Card>
      </Content>
    </SignUpWrapper>
  );
};

export default Signup;
