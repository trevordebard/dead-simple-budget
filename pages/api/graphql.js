import { gql, ApolloServer } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    hello: String!
    user: User
  }
  type User {
    email: String
    password: String
    budget: Budget
  }
  type Budget {
    total: Float
    toBeBudgeted: Int
    stacks: [Stack]
  }
  type Stack {
    label: String
    value: Int
  }
`;
const resolvers = {
  Query: {
    hello: (_parent, _args, _context) => 'hi',
    user: () => ({
      email: 'hi',
      password: '123NotSecure',
    }),
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
