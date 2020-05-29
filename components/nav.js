import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
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
`;
const Nav = () => {
  const { user, loggedIn } = useUser();
  return <NavContainer>{loggedIn ? <LoggedInNav email={user.email} /> : <LoggedOutNav />}</NavContainer>;
};

const LoggedInNav = ({ email }) => {
  console.log(email);
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
