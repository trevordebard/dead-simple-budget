import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const d = await prisma.account.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      compoundId: process.env['SEED_ACCOUNT_compoundId'],
      userId: 1,
      providerType: 'oauth',
      providerId: 'google',
      providerAccountId: process.env['SEED_ACCOUNT_providerAccountId'],
      refreshToken: null,
      accessToken: process.env['SEED_ACCOUNT_accessToken'],
      accessTokenExpires: null,
    },
  });
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: process.env['SEED_USER_name'],
      email: process.env['SEED_USER_email'],
      emailVerified: null,
      image: process.env['SEED_USER_image'],
    },
  });

  await prisma.session.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: 1,
      expires: new Date('2021-07-23'),
      sessionToken: process.env['SEED_SESSION_sessionToken'],
      accessToken: process.env['SEED_SESSION_accessToken'],
    },
  });
  await prisma.transaction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      amount: 32,
      date: new Date('2021-06-22'),
      description: 'Yummy pizza',
      stack: 'food',
      type: 'deposit',
      userId: 1,
    },
  });
  await prisma.bankAccout.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      plaidAccessToken: process.env['SEED_BANKACCOUNT_plaidAccessToken'],
      plaidItemId: process.env['SEED_BANKACCOUNT_plaidItemId'],
      plaidAccountIds: [process.env['SEED_BANKACCOUNT_plaidAccountId']],
      userId: 1,
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
