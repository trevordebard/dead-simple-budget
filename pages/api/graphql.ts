import app, { server, use } from 'nexus';
import { auth } from 'nexus-plugin-jwt-auth'
import '../../graphql/schema';
import nextConnect from 'next-connect'

//TODO: update with all paths (or at least most)
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

export default nextConnect()
  .use(app.server.handlers.graphql)