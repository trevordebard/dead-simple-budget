import React from 'react';

import { useForm, ErrorMessage } from 'react-hook-form';
import styled from 'styled-components';
import { useMutation, gql } from '@apollo/client';
import Router from 'next/router';
import useUser from '../hooks/useUser';

const Form = styled.form`
  label {
    display: block;
    margin-bottom: 1rem;
  }
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
    <>
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
        <input type="submit" disabled={loginLoading} value={loginLoading ? 'Loading...' : 'Submit'}></input>
        {loginError && <p style={{ color: 'red' }}>There was an error logging in. Please try again!</p>}
      </Form>
    </>
  );
};

export default Login;
