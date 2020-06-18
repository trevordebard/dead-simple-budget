import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import useUser from '../hooks/useUser';

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 5fr 1fr;
  border-bottom: 1px solid #eaeaea;
  padding: 4px 16px;
  p,
  h1 {
    margin: 0;
  }
  p,
  a {
    padding: 5px;
    text-decoration: none;
  }
`;
const Logo = styled.div`
  grid-column: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  h1 {
    cursor: pointer;
  }
`;
const Tabs = styled.div`
  grid-column: 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  .active {
    color: green;
  }
`;

const Account = styled.div`
  grid-column: 3 / -1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  /*TODO: Not wasting time styling because eventually this component should be an icon with dropdown to logout, see settings, etc*/
  button {
    background: none;
    border: none;
    font-family: inherit;
  }
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
  console.log(router.pathname);
  const [logout] = useMutation(LOGOUT);
  return (
    <>
      <Logo>
        {' '}
        <Link href="/">
          <h1>Budget Trace</h1>
        </Link>
      </Logo>
      <Tabs>
        <Link href="/budget">
          <a className={router.pathname === '/budget' ? 'active' : ''}>Budget</a>
        </Link>
        <Link href="/transactions">
          <a className={router.pathname === '/transactions' ? 'active' : ''}>Transactions</a>
        </Link>
      </Tabs>
      <Account>
        <p>{email}</p>
        <button type="button" onClick={() => logout()}>
          Logout
        </button>
      </Account>
    </>
  );
};

const LoggedOutNav = () => (
  <>
    <Logo>
      <Link href="/">
        <h1>Budget Trace</h1>
      </Link>
    </Logo>
    <Tabs />
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
