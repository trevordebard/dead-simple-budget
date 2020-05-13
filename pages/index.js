import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import BudgetState from '../context/BudgetState';
import { withApollo } from '../lib/withApollo';

const UserQuery = gql`
  query user {
    userById(_id: "5eb34a25f56c9892e1923fad") {
      email
      transactions {
        description
        amount
      }
      budget {
        total
        toBeBudgeted
        stacks {
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
