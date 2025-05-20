import { app } from "./super.test";
import { describe, test, expect } from "bun:test";

describe("Todos", () => {
  test("GET /todos", async () => {
    const response = await app.get("/todos");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body["data"])).toEqual(true);
  });
  test("GET /todos/:id", async () => {
    const response = await app.get("/todos/1");
    expect(response.statusCode).toBe(200);
    expect(response.body["data"]).toHaveProperty("id");
    expect(response.body["data"]["id"]).toEqual("1");
    expect(response.body["data"]).toHaveProperty("title");
    expect(response.body["data"]).toHaveProperty("completed");
    expect(response.body["data"]).toHaveProperty("createdAt");
  });
  test("POST /todos", async () => {
    const response = await app.post("/todos").send({
      title: "Test Todo",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body["data"]).toBeDefined();
    expect(response.body["data"]).toHaveProperty("id");
    expect(response.body["data"]["title"]).toEqual("Test Todo");
    expect(response.body["data"]).toHaveProperty("completed");
    expect(response.body["data"]["completed"]).toEqual(false);
    expect(response.body["data"]).toHaveProperty("createdAt");
    expect(response.body["success"]).toBe(true);
    expect(response.body["message"]).toBe("Todo created");
  });
  test("PUT /todos/:id", async () => {
    const todo = {
      title: "Updated Todo",
      completed: true,
    };
    const response = await app.put("/todos/1").send(todo);
    expect(response.statusCode).toBe(200);
    expect(response.body["data"]).toBeDefined();
    expect(response.body["data"]).toHaveProperty("id");
    expect(response.body["data"]["title"]).toEqual(todo.title);
    expect(response.body["data"]).toHaveProperty("completed");
    expect(response.body["data"]["completed"]).toEqual(todo.completed);
    expect(response.body["data"]).toHaveProperty("createdAt");
    expect(response.body["success"]).toBe(true);
    expect(response.body["message"]).toBe("Todo updated");
  });
  test("DELETE /todos/:id", async () => {
    const newTodo = await app.post("/todos").send({
      title: "New Test Todo",
    });
    const response = await app.delete(`/todos/${newTodo.body.data.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body["data"]).toBeNull();
    expect(response.body["success"]).toBe(true);
    expect(response.body["message"]).toBe("Todo deleted");
  });
});
