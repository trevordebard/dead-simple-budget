import React from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import { withApollo } from '../lib/withApollo';

const Home = () => (
  <>
    <Head title="Budget Trace" />
    <h1>Budget Trace</h1>
    <Budget />
    <hr />
    <Transactions />
  </>
);
export default withApollo(Home);
