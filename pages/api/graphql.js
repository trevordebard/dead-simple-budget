import { gql, ApolloServer } from 'apollo-server-micro';
import connect from '../../database';
import User from '../../models/UserModel';
import Transaction from '../../models/TransactionModel';

connect();

const user = {
  _id: 'aldfkj40vlsd',
  email: 'abc@gmail.com',
  password: 'pw1234',
};
const budget = {
  total: 5000,
  toBeBudgeted: 4900,
  stacks: [
    {
      _id: '5eb3492f5b357f91fb30b8a9',
      label: 'Rent',
      value: 100,
    },
  ],
  _userId: '5eb34a25f56c9892e1923fad',
};

const transactions = [
  {
    _id: '5eaf5e1227c42a6f3714db63',
    description: 'Some Transaction 2',
    stack: 'Restaurants',
    amount: 30,
    _userId: '5eb34a25f56c9892e1923fad',
  },
  {
    _id: '5eaf61cad04163713840a01d',
    description: 'Some Transaction 3',
    stack: 'Bars',
    amount: 30,
    _userId: '5eb34a25f56c9892e1923fad',
  },
];
const typeDefs = gql`
  type Query {
    hello: String!
    user(id: String!): User
    transactions(userId: String!): [Transaction]
    budget: Budget
  }
  type Mutation {
    addUser(user: UserInput!): String!
    addBudget(budget: BudgetInput): String!
  }
  input UserInput {
    email: String!
    password: String!
  }
  input BudgetInput {
    balance: Float
    stacks: [StackInput]
  }
  input StackInput {
    label: String!
    value: Int!
  }
  type User {
    email: String!
    password: String!
    budget: Budget
    transactions: [Transaction]
  }
  type Budget {
    balance: Float
    toBeBudgeted: Int
    stacks: [Stack]
    test: String
  }
  type Stack {
    label: String
    value: Int
  }
  type Transaction {
    id: ID!
    description: String
    stack: String
    amount: Float
    userId: ID!
  }
`;
const resolvers = {
  Query: {
    transactions: async (_, args) => transactions,
    user: () => user,
  },
  Mutation: {
    addUser: (_, args) => {
      console.log(args);
      return 'temp';
    },
    addBudget: (_, args) => {
      console.log(args);
      return 'temp2';
    },
  },
  User: {
    budget: () => 'some parent?',
    transactions: () => transactions,
  },
  Budget: {
    test: parent => {
      console.log(parent);
      return 'it works!';
    },
  },
  Transaction: {
    amount: parent => {
      console.log(parent);
      return 50;
    },
  },
};

const apollo = new ApolloServer({ typeDefs, resolvers });
const handler = apollo.createHandler({ path: '/api/graphql' });
export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
