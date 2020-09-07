import { postgraphile } from 'postgraphile';

const conString = 'postgres://trevordebardeleben@localhost:5432/budget';

// Initializing the cors middleware
const graph = postgraphile(conString, 'public', {
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  graphiqlRoute: '/api/test',
});
export const config = {
  api: {
    bodyParser: true,
  },
};

// // Helper method to wait for a middleware to execute before continuing
// // And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function handler(req, res) {
  res.statusCode = 200;

  // Run the middleware
  await runMiddleware(req, res, graph);

  // Rest of the API logic
  res.end();
}

export default handler;
