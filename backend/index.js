// ESM
import Fastify from "fastify";
import routes from "./src/routes/index.js";
import "dotenv/config";

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true,
});

fastify.register(routes);

const port = process.env.SERVICE_PORT || 8000;
console.log("Starting server on port: ", port);

fastify.listen({ port }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
