import React from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';
import GlobalState from '../context/GlobalState';

const Home = () => (
  <GlobalState>
    <Head title="Budget Trace" />
    <h1>Budget Trace</h1>
    <Budget />
  </GlobalState>
);

export default Home;
