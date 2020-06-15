import { ApolloServer } from 'apollo-server-micro';
import connect from '../../database';
import { buildSchema } from '../../schema';
import cookie from '../../auth/cookies';

const schema = buildSchema();
connect();

const apollo = new ApolloServer({
  schema,
  context: ctx => ctx,
});
const handler = apollo.createHandler({ path: '/api/graphql' });
export default cookie(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
