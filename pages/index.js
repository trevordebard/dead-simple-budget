import React from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import BudgetState from '../context/BudgetState';

const Home = () => (
  <BudgetState>
    <Head title="Budget Trace" />
    <h1>Budget Trace</h1>
    <Budget />
    <Transactions />
  </BudgetState>
);

export default Home;
