import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UrlModel } from "../models/url.model.js";
import { errorResponseSchema, redirectParamsSchema } from "../schemas/url.schema.js";
import { decodeCode } from "../utils/hashids.js";

export const redirectRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/:code",
    {
      schema: {
        tags: ["URLs"],
        summary: "Redirecionar URL",
        description: "Decodifica código Base62 para ID numérico, busca no MongoDB e redireciona com status 301",
        params: redirectParamsSchema,
        response: {
          404: errorResponseSchema
        }
      }
    },
    async (request, reply) => {
      const { code } = request.params;

      const numericId = decodeCode(code);
      if (numericId === null) {
        return reply.status(404).send({ message: "Invalid short URL code" });
      }

      const urlRecord = await UrlModel.findOne({ numericId });
      if (!urlRecord) {
        return reply.status(404).send({ message: "URL not found" });
      }

      return reply.redirect(urlRecord.originalUrl, 301);
    }
  );
};
