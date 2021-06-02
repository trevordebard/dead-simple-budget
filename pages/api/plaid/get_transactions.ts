import plaid from 'plaid';
import { NextApiRequest, NextApiResponse } from 'next';
import { format, sub } from 'date-fns';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET_SANDBOX;
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
export default async (req: NextApiRequest, res: NextApiResponse) => {

    let start = format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd')
    let end = format(new Date(), 'yyyy-MM-dd')

    const data = await client.getTransactions(req.query.accessToken as string, start, end);
    res.status(200).json(data)
}

