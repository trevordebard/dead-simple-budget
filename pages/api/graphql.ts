import app, { server, use } from 'nexus';
import { auth } from 'nexus-plugin-jwt-auth'
import '../../graphql/schema';

const protectedPaths = [
  'Query.me',
]
use(auth({
  appSecret: process.env.JWT_SECRET,
  protectedPaths,
  useCookie: true,
  cookieName: 'token',
}))

app.settings.change({
  server: {
    path: '/api/graphql',
  },
});
app.assemble();
export default app.server.handlers.graphql