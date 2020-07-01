import React from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';
import Transactions from '../components/Transactions';

import Layout from '../components/Layout';

const IndexPage = () => (
  <Layout>
    <Head title="Budget Trace" />
    <Budget />
    <hr />
    <Transactions />
  </Layout>
);
export default IndexPage;
