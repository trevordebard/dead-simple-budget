import { ApolloServer } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import connect from '../../database';
import { buildSchema } from '../../schema';
import cookie from '../../auth/cookies';

const schema = buildSchema();
connect();

function context(ctx) {
  const { token } = ctx.req.cookies;
  let userId;
  if (token) {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      userId = data.userId;
    } catch (e) {
      console.error('USER ATTEMPTED TO SUPPLY INVALID TOKEN');
      console.error(e);
    }
  }
  return {
    cookie: ctx.res.cookie,
    isMe: true,
    userId,
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
