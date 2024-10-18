import cors from "@fastify/cors";
import Fastify from "fastify";
import { wineRoutes } from "./routes/wine";

const fastify = Fastify({
  logger: true,
});

const startApp = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
    });

    await fastify.register(wineRoutes);

    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Server listening at ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startApp();
