import React from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';
import RequireLogin from '../components/RequireLogin';

const Home = () => (
  <>
    <Head title="Budget Trace" />
    <Budget />
    <hr />
    <Transactions />
  </>
);
export default RequireLogin(Home);
