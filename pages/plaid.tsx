import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { GetServerSideProps } from 'next';

const Plaid = ({ linkToken }) => {
  const [accessToken, setAccessToken] = useState<null | string>();
  const [transactions, setTransactions] = useState<null | string>();
  const onSuccess = useCallback(async (publicToken, metadata) => {
    // send token to server
    console.log('success!');
    console.log(metadata);
    const data = await axios.get('/api/plaid/exchange_public_token', { params: { publicToken } });
    setAccessToken(data.data.access_token);
    const transactionResponse = await axios.get('/api/plaid/get_transactions', {
      params: { accessToken: data.data.access_token },
    });
    console.log(transactionResponse.data);
    setTransactions(transactionResponse.data);
  }, []);

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready, error } = usePlaidLink(config);
  return (
    <div>
      <button onClick={() => open()}>Connect a bank account</button>
      <pre>{transactions && JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
};
export default Plaid;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let response = await axios.post('http://localhost:3000/api/plaid/create_link_token');

  return {
    props: {
      linkToken: response.data.link_token,
    },
  };
};
