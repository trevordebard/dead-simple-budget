import app, { server, use } from 'nexus';
import { auth } from 'nexus-plugin-jwt-auth'
import '../../graphql/schema';
import { APP_SECRET } from '../../auth/utils'

const protectedPaths = [
  'Query.me',
]
use(auth({
  appSecret: APP_SECRET,
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