import React from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import BudgetState from '../context/BudgetState';
import { withApollo } from '../lib/withApollo';
import useBudget2 from '../hooks/useBudget2';

const Home = () => {
  // const data = useQuery(GET_USER);
  const { data, loading } = useBudget2();
  console.log(data);
  if (!loading) {
    // const budgetData = data.data.userById;
    const budgetData = data.me.budget;
    console.log(budgetData);
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
export default withApollo(Home);
