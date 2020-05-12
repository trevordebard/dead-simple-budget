import { ApolloServer } from 'apollo-server-micro';
import connect from '../../database';
import { schema } from '../../schema';

connect();

const apollo = new ApolloServer({ schema });
const handler = apollo.createHandler({ path: '/api/graphql' });
export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
