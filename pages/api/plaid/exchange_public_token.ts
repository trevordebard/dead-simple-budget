import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/client';
import { plaidClient } from 'lib/plaidClient';

const prisma = new PrismaClient({});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // TODO: redirect if user is not logged in
    const session = await getSession({ req })
    console.log(req.body.publicToken)
    const data = await plaidClient.exchangePublicToken(req.query.publicToken as string)

    // add bank account and access token to db
    await prisma.bankAccout.create({ data: { plaidAccessToken: data.access_token, plaidItemId: data.item_id, user: { connect: { email: session.user.email } } } })
    res.status(200).json(data)
}

