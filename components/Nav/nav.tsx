import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useSession, signOut } from 'next-auth/client';
import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { Button } from 'components/Styled';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  margin-left: 20px;
  justify-content: flex-start;
`;

const Logo = styled.a`
  font-weight: 500;
  color: var(--grey-1000);
  cursor: pointer;
`;

const RightNav = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AvatarWrapper = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ProfileDropdown = styled.div`
  border-radius: 10px;
  padding: 15px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--level3);
`;

const Nav = () => {
  const [session] = useSession();

  return (
    <NavContainer>
      <LoggedInNav email={session.user.email.split('@')[0]} />
    </NavContainer>
  );
};

const LoggedInNav = ({ email }) => {
  return (
    <>
      <LogoWrapper>
        <Link href="/budget" passHref={true}>
          <Logo>Dead Simple Budget</Logo>
        </Link>
      </LogoWrapper>

      <RightNav>
        <ProfileMenu />
      </RightNav>
    </>
  );
};

export default Nav;

const ProfileMenu = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [session] = useSession();
  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom', 'left']}
      padding={0}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={({ position, nudgedLeft, nudgedTop }) => (
        <ProfileDropdown>
          <p>{session.user.email.split('@')[0]}</p>
          <Button
            category="TRANSPARENT"
            onClick={async () => {
              signOut();
              queryClient.clear();
              router.push('/login');
            }}
          >
            Logout
          </Button>
        </ProfileDropdown>
      )}
    >
      <AvatarWrapper onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
        <ProfileAvatar width="30" height="30" fill="hsl(210, 24%, 16%)" />
      </AvatarWrapper>
    </Popover>
  );
};

function ProfileAvatar(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88" {...props}>
      <path d="M61.44 0a61.3 61.3 0 0123.5 4.66l.11.05c7.47 3.11 14.2 7.66 19.83 13.3a61.414 61.414 0 0113.34 19.95c3.01 7.24 4.66 15.18 4.66 23.49a61.3 61.3 0 01-4.66 23.5l-.05.11a61.537 61.537 0 01-13.3 19.83 61.414 61.414 0 01-19.95 13.34c-7.24 3.01-15.18 4.66-23.49 4.66-8.31 0-16.25-1.66-23.5-4.66l-.11-.05a61.51 61.51 0 01-19.83-13.29l.01-.02A61.648 61.648 0 014.66 84.94C1.66 77.69 0 69.76 0 61.44s1.66-16.25 4.66-23.5l.05-.11A61.51 61.51 0 0118 18h.01A61.584 61.584 0 0137.95 4.66C45.19 1.66 53.12 0 61.44 0zM16.99 94.47l.24-.14c5.9-3.29 21.26-4.38 27.64-8.83.47-.7.97-1.72 1.46-2.83.73-1.67 1.4-3.5 1.82-4.74-1.78-2.1-3.31-4.47-4.77-6.8l-4.83-7.69c-1.76-2.64-2.68-5.04-2.74-7.02-.03-.93.13-1.77.48-2.52.36-.78.91-1.43 1.66-1.93.35-.24.74-.44 1.17-.59-.32-4.17-.43-9.42-.23-13.82.1-1.04.31-2.09.59-3.13 1.24-4.41 4.33-7.96 8.16-10.4 2.11-1.35 4.43-2.36 6.84-3.04 1.54-.44-1.31-5.34.28-5.51 7.67-.79 20.08 6.22 25.44 12.01 2.68 2.9 4.37 6.75 4.73 11.84l-.3 12.54c1.34.41 2.2 1.26 2.54 2.63.39 1.53-.03 3.67-1.33 6.6-.02.05-.05.11-.08.16l-5.51 9.07c-2.02 3.33-4.08 6.68-6.75 9.31.25.36.5.71.74 1.06 1.09 1.6 2.19 3.2 3.6 4.63.05.05.09.1.12.15 6.34 4.48 21.77 5.57 27.69 8.87l.24.14c6.87-9.22 10.93-20.65 10.93-33.03 0-15.29-6.2-29.14-16.22-39.15-10-10.03-23.85-16.23-39.14-16.23s-29.14 6.2-39.15 16.22C12.27 32.3 6.07 46.15 6.07 61.44c0 12.38 4.06 23.81 10.92 33.03z" />
    </svg>
  );
}
