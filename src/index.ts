import swagger from "@elysiajs/swagger";
import { Elysia, status, t } from "elysia";
import { todoRoutes } from "./todo";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Elysia Todo API",
          description: "A simple Todo API built with Elysia",
          version: "1.0.0",
          contact: {
            name: "Your Name",
            email: "",
          },
        },
        tags: [
          { name: "Todos", description: "Todo operations" },
          { name: "Health", description: "Health check" },
        ],
      },
    })
  )
  .get(
    "/healthz",
    ({ set }) => {
      set.status = 200;
      return {
        success: true,
        message: "Service is healthy",
      };
    },
    {
      response: {
        200: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
      tags: ["Health"],
    }
  )
  .use(todoRoutes)
  .listen(Bun.env.PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
