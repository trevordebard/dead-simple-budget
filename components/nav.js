import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import useUser from '../hooks/useUser';
import Logo from './Logo.svg';
import { TransparentButton } from './styled';

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 1px solid var(--lineColor);
  a {
    text-decoration: none;
  }
  padding: 10px;
`;
const LogoWrapper = styled.div`
  grid-column: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  h1 {
    cursor: pointer;
  }
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
`;
const Nav = () => {
  const { user, loggedIn, loading } = useUser();
  if (loading) {
    return null;
  }
  return <NavContainer>{loggedIn ? <LoggedInNav email={user.email} /> : <LoggedOutNav />}</NavContainer>;
};
const LOGOUT = gql`
  mutation LOGOUT {
    userLogout {
      record {
        email
      }
    }
  }
`;
const LoggedInNav = ({ email }) => {
  const router = useRouter();
  const client = useApolloClient();
  const [logout] = useMutation(LOGOUT, {
    onCompleted: async () => {
      await client.clearStore();
      router.push('/login');
    },
  });
  return (
    <>
      <LogoWrapper>
        <Link href="/">
          <>
            <Logo />
          </>
        </Link>
      </LogoWrapper>

      <Account>
        <p>{email}</p>
        <TransparentButton transparent onClick={() => logout()}>
          Logout
        </TransparentButton>
      </Account>
    </>
  );
};

const LoggedOutNav = () => (
  <>
    <LogoWrapper>
      <Link href="/">
        <h1>Budget Trace</h1>
      </Link>
    </LogoWrapper>
    <Account>
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </Account>
  </>
);

export default Nav;
