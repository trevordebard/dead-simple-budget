import { signIn } from 'next-auth/client';
import styled from 'styled-components';
import { ActionButton } from './styled';

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
  input {
    margin-bottom: 1rem;
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

const Login = () => {
  const signInUser = async () => {
    await signIn('google');
  };
  return (
    <LoginWrapper>
      <Content>
        <Card>
          <h2>Login</h2>
          <hr />
          <ActionButton transparent onClick={signInUser}>
            Sign in with Google
          </ActionButton>
        </Card>
      </Content>
    </LoginWrapper>
  );
};

export default Login;
