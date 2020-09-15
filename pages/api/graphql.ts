import app, { server, use } from 'nexus';
import { auth } from 'nexus-plugin-jwt-auth'
import '../../graphql/schema';

const protectedPaths = [
  'Query.me',
]
use(auth({
  appSecret: process.env.JWT_SECRET,
  protectedPaths
}))

app.settings.change({
  server: {
    path: '/api/graphql',
  },
});
app.assemble();

// const handler = (req, res) => {
//   console.log('cookies!', req.cookies)
//   return app.server.handlers.graphql(req, res)
// }
export default app.server.handlers.graphql