import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import BudgetState from '../context/BudgetState';
import { withApollo } from '../lib/withApollo';
import { UserQuery } from '../lib/queries/UserQuery';

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
