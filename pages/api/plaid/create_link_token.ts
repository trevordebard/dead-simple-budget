import plaid from 'plaid';
import { NextApiRequest, NextApiResponse } from 'next';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET_SANDBOX;
// const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
const PLAID_ENV = process.env.PLAID_ENV;

// Initialize the Plaid client
export const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments.sandbox, // TODO: make env

  options: {
    version: '2020-09-14',
    timeout: 30 * 60 * 1000, // 30 minutes }

  }
});
export default async function handler(req, res) {
  const data = await client.createLinkToken({
    client_name: "dead simple budget",
    country_codes: ['US'],
    language: 'en',
    user: { client_user_id: '1234' },
    products: ['auth', 'transactions']
  })
  res.status(200).json(data)
}