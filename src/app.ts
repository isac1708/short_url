import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import apiReference from "@scalar/fastify-api-reference";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from "fastify-type-provider-zod";
import { redirectRoute } from "./routes/redirect.route.js";
import { shortenRoute } from "./routes/shorten.route.js";

export async function buildApp() {
  const app = Fastify({
    logger: false
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyCors, {
    origin: true
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "URL Shortener API",
        version: "1.0.0",
        description: "Encurtador de URLs de alta performance com Redis, MongoDB e Base62 Hashids"
      }
    },
    transform: jsonSchemaTransform
  });

  await app.register(apiReference, {
    routePrefix: "/docs",
    configuration: {
      title: "URL Shortener API Reference"
    }
  });

  await app.register(shortenRoute);
  await app.register(redirectRoute);

  return app;
}
