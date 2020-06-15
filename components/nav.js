import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useMutation, gql } from '@apollo/client';
import useUser from '../hooks/useUser';

const NavContainer = styled.nav`
  nav {
    text-align: center;
  }
  ul {
    display: flex;
    justify-content: flex-end;
  }
  nav > ul {
    padding: 4px 16px;
  }
  li {
    display: flex;
    padding: 6px 8px;
  }
  a {
    text-decoration: none;
  }
  p {
    margin: 0;
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
  const [logout] = useMutation(LOGOUT);
  return (
    <ul>
      <li>{email}</li>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/transactions">
          <a>Transactions</a>
        </Link>
      </li>
      <li>
        <p onClick={() => logout()}>Logout</p>
      </li>
    </ul>
  );
};

const LoggedOutNav = () => (
  <ul>
    <li>
      <Link href="/">
        <a>Home</a>
      </Link>
    </li>
    <li>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </li>
    <li>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </li>
  </ul>
);

export default Nav;
