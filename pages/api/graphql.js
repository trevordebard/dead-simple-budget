import { ApolloServer } from 'apollo-server-micro';
import connect from '../../database';
import Schema from '../../schema';

connect();
const graphqlSchema = Schema.buildSchema();

const apollo = new ApolloServer({ schema: graphqlSchema });
const handler = apollo.createHandler({ path: '/api/graphql' });
export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
