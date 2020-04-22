import React from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';
import BudgetState from '../context/BudgetState';

const Home = () => (
  <BudgetState>
    <Head title="Budget Trace" />
    <h1>Budget Trace</h1>
    <Budget />
  </BudgetState>
);

export default Home;
