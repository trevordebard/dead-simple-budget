import React, { useState } from 'react';
import Head from '../components/head';
import Budget from '../components/Budget';

const Home = () => (
  <div>
    <Head title="Budget Trace" />
    <h1>Budget Trace</h1>
    <Budget />
  </div>
);

export default Home;
