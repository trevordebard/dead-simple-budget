import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import BudgetState from '../context/BudgetState';
import { withApollo } from '../lib/withApollo';

const UserQuery = gql`
  query user {
    userById(_id: "5ec1d97edd768b5259f24b50") {
      email
      _id
      transactions {
        _userId
        description
        amount
      }
      budget {
        _userId
        _id
        total
        toBeBudgeted
        stacks {
          _id
          label
          value
        }
      }
    }
  }
`;

const Home = props => {
  const data = useQuery(UserQuery);
  if (!data.loading) {
    const budgetData = data.data.userById;
    return (
      <BudgetState initialState={budgetData}>
        <Head title="Budget Trace" />
        <h1>Budget Trace</h1>
        <Budget />
        <Transactions />
      </BudgetState>
    );
  }
  return <p>Loading...</p>;
};
export default withApollo({ ssr: true })(Home);
