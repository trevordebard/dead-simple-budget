import React from 'react';
import fetch from 'isomorphic-fetch';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import BudgetState from '../context/BudgetState';

const Home = props => {
  const { data: budgetData } = props;
  return (
    <BudgetState initialState={budgetData}>
      <Head title="Budget Trace" />
      <h1>Budget Trace</h1>
      <Budget />
      <Transactions />
    </BudgetState>
  );
};
export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/budget');
  const data = await res.json();
  return {
    props: data,
  };
}
export default Home;
