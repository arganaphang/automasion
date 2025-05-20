import swagger from "@elysiajs/swagger";
import { Elysia, status } from "elysia";
import { todoRoutes } from "./todo";

const app = new Elysia()
  .use(swagger())
  .get("/healthz", () => {
    status(200);
    return { success: true, message: "OK" };
  })
  .use(todoRoutes)
  .listen(Bun.env.PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
