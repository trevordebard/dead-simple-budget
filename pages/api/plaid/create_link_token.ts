import { plaidClient } from 'lib/plaidClient';

export default async function handler(req, res) {
  const data = await plaidClient.createLinkToken({
    client_name: 'dead simple budget',
    country_codes: ['US'],
    language: 'en',
    user: { client_user_id: '1234' },
    products: ['auth', 'transactions'],
  });
  res.status(200).json(data);
}
