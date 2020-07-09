import styled from 'styled-components';
import { useState } from 'react';
import { Button, ActionButton, DangerButton } from '../components/styled';
import Modal, { ModalCard } from '../components/Modal';

const ButtonContainer = styled.div`
  /* display: block; */
`;

const Sink = () => {
  const [displayModal, setDisplayModal] = useState(true);
  return (
    <>
      <h1>Hello World</h1>

      <p>
        Lorem ipsum dolor sit amet, <a href="#">consectetur</a> adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
      </p>

      <h2>Hello World</h2>
      <h3>Hello World</h3>
      <h4>Hello World</h4>
      <h5>Hello World</h5>
      <h6>Hello World</h6>
      <hr />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
      <hr />

      <ul>
        <li>Hi</li>
        <li>Hello</li>
        <li>It's me</li>
      </ul>

      <form>
        <div>
          <label htmlFor="text">Text</label>
          <input id="text" type="text" />
        </div>
        <div>
          <label htmlFor="number">Number</label>
          <input id="number" type="number" />
        </div>
        <div>
          <label htmlFor="select">Select</label>
          <select id="select" type="text">
            <option value="one">One</option>
            <option value="two">One</option>
          </select>
        </div>
        <ButtonContainer>
          <Button type="button">Normal Button</Button>
          <ActionButton type="button">Submit</ActionButton>
          <DangerButton type="button">Cancel</DangerButton>
          <Button small type="button">
            Small Button
          </Button>
        </ButtonContainer>
      </form>
      <Modal visible={displayModal} hide={() => setDisplayModal(false)}>
        <ModalCard>
          <p>Hello!</p>
        </ModalCard>
      </Modal>
      {/* 
      Alternative approach to modal. Key is to wrap the child component in a div
      So that the clickaway listener works 
      <Modal visible={displayModal} hide={() => setDisplayModal(false)}>
        <div>
          <Signup />
        </div>
      </Modal> */}
      <Button
        onClick={() => {
          console.log(displayModal);
          setDisplayModal(!displayModal);
        }}
      >
        Show Modal
      </Button>
    </>
  );
};
export default Sink;
