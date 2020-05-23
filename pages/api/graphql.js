import { ApolloServer } from 'apollo-server-micro';
import connect from '../../database';
import { buildSchema } from '../../schema';
import cookie from '../../auth/cookies';

const schema = buildSchema();
connect();

function context(ctx) {
  return {
    cookie: ctx.res.cookie,
    isMe: true,
  };
}
const apollo = new ApolloServer({
  schema,
  context,
  // context: ({ req }) => {
  //   // Get the user token from the headers.
  //   const token = req.headers.authorization || '';
  //   // console.log('token', token);
  //   // try to retrieve a user with the token
  //   // const user = getUser(token);
  //   // add the user to the context
  //   return { user: 'hi', cookies: req.cookies };
  // },
});
const handler = apollo.createHandler({ path: '/api/graphql' });
export default cookie(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
