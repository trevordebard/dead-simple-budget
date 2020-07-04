import { useForm, ErrorMessage } from 'react-hook-form';
import styled from 'styled-components';
import { useMutation, gql } from '@apollo/client';
import Router from 'next/router';
import useUser from '../hooks/useUser';
import { ActionButton } from './styled';

const Form = styled.form`
  * {
    display: block;
  }
  label {
    margin-bottom: 1rem;
  }
`;

const LoginWrapper = styled.div`
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
`;

const Card = styled.div`
  box-shadow: var(--level3);
  border-radius: 5px;
  padding: 20px;
  display: grid;
  place-items: center;
  border: 1px solid var(--lineColor);
`;
const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      record {
        email
      }
    }
  }
`;

const Login = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const { user, loading: userLoading, loggedIn } = useUser();

  const [loginUser, { loading: loginLoading, error: loginError }] = useMutation(LOGIN, {
    onCompleted: () => Router.push('/'),
    onError: err => console.error(err.message),
  });
  const onSubmit = async payload => {
    loginUser({ variables: { email: payload.email, password: payload.password } });
    reset();
  };
  if (userLoading) {
    return <p>Loading...</p>;
  }
  if (loggedIn) {
    return <p>{user?.email} is logged in!</p>;
  }
  return (
    <LoginWrapper>
      <Content>
        <Card>
          <h1>Login</h1>
          <hr />
          <Form method="POST" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">
              Email
              <input name="email" defaultValue="" type="email" ref={register({ required: true })} />
            </label>
            <ErrorMessage errors={errors} name="email">
              {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
            </ErrorMessage>
            <label htmlFor="password">
              Password
              <input name="password" defaultValue="" type="password" ref={register({ required: true })} />
            </label>
            <ErrorMessage errors={errors} name="password">
              {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
            </ErrorMessage>
            <ActionButton style={{ width: '100%' }} disabled={loginLoading}>
              {loginLoading ? 'Loading...' : 'Login'}
            </ActionButton>
            {loginError && <p style={{ color: 'red' }}>There was an error logging in. Please try again!</p>}
          </Form>
        </Card>
      </Content>
    </LoginWrapper>
  );
};

export default Login;
