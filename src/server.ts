import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { connectMongo, disconnectMongo } from "./config/mongo.js";
import { initRedisCounter, redis } from "./config/redis.js";

async function bootstrap() {
  try {
    await redis.connect();
    await initRedisCounter();
    await connectMongo();

    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST
    });

    console.log(`Server running at http://localhost:${env.PORT}`);
    console.log(`Documentation available at http://localhost:${env.PORT}/docs`);

    const shutdown = async () => {
      await app.close();
      await redis.quit();
      await disconnectMongo();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
