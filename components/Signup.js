import React from 'react';

import { useForm, ErrorMessage } from 'react-hook-form';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../lib/queries/ADD_USER';

const Form = styled.form`
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  select {
    display: block;
    padding: 0.5rem;
    border: 1px solid black;
    &:focus {
      outline: 0;
      border-color: purple;
    }
  }
`;

const Signup = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const [addUser] = useMutation(ADD_USER);
  const onSubmit = data => {
    const { email, password } = data;
    console.log(email, password);
    addUser({
      variables: { record: { email, password } },
    });
    reset();
  };
  return (
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
      <input type="submit"></input>
    </Form>
  );
};

export default Signup;
