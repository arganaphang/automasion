import Elysia, { status, t } from "elysia";
import type { Todo } from "./model";

abstract class TodoService {
  static todos: Todo[] = [
    {
      id: "1",
      title: "First Todo",
      completed: false,
      createdAt: new Date(),
    },
  ];
  static addTodo(todo: Todo): Todo {
    this.todos.push(todo);
    return todo;
  }
  static getTodos(): Todo[] {
    return this.todos;
  }
  static getTodoById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }
  static updateTodo(
    id: string,
    updatedTodo: Pick<Todo, "title" | "completed">
  ): Todo {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    this.todos[todoIndex] = {
      ...this.todos[todoIndex]!,
      ...updatedTodo,
    };
    return this.todos[todoIndex];
  }
  static deleteTodo(id: string): void {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      this.todos.splice(todoIndex, 1);
    }
  }
}

export const todoRoutes = new Elysia({ prefix: "/todos" })
  .get(
    "/",
    ({ set }) => {
      set.status = 200;
      return {
        success: true,
        message: "Todos fetched",
        data: TodoService.getTodos(),
      };
    },
    {
      response: {
        200: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Array(
            t.Object({
              id: t.String(),
              title: t.String(),
              completed: t.Boolean(),
              createdAt: t.Date(),
            })
          ),
        }),
      },
      tags: ["Todos"],
    }
  )
  .get(
    "/:id",
    ({ set, params }) => {
      const todo = TodoService.getTodoById(params.id);
      if (!todo) {
        set.status = 404;
        return {
          success: false,
          message: "Todo not found",
          data: null,
        };
      }
      set.status = 200;
      return {
        success: true,
        message: "Todo fetched",
        data: todo,
      };
    },
    {
      response: {
        200: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Object({
            id: t.String(),
            title: t.String(),
            completed: t.Boolean(),
            createdAt: t.Date(),
          }),
        }),
        404: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Null(),
        }),
      },
      tags: ["Todos"],
    }
  )
  .post(
    "/",
    ({ set, body }) => {
      const newTodo = TodoService.addTodo({
        id: crypto.randomUUID(),
        title: body.title,
        completed: false,
        createdAt: new Date(),
      });
      set.status = 201;
      return {
        success: true,
        message: "Todo created",
        data: newTodo,
      };
    },
    {
      body: t.Object({ title: t.String() }),
      response: {
        201: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Object({
            id: t.String(),
            title: t.String(),
            completed: t.Boolean(),
            createdAt: t.Date(),
          }),
        }),
      },
      tags: ["Todos"],
    }
  )
  .put(
    "/:id",
    ({ set, params, body }) => {
      const todo = TodoService.getTodoById(params.id);
      if (!todo) {
        set.status = 404;
        return {
          success: false,
          message: "Todo not found",
          data: null,
        };
      }
      const updatedTodo = TodoService.updateTodo(params.id, body);
      set.status = 200;
      return {
        success: true,
        message: "Todo updated",
        data: updatedTodo,
      };
    },
    {
      body: t.Object({ title: t.String(), completed: t.Boolean() }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Object({
            id: t.String(),
            title: t.String(),
            completed: t.Boolean(),
            createdAt: t.Date(),
          }),
        }),
        404: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Null(),
        }),
      },
      tags: ["Todos"],
    }
  )
  .delete(
    "/:id",
    ({ set, params }) => {
      const todo = TodoService.getTodoById(params.id);
      if (!todo) {
        set.status = 404;
        return {
          success: false,
          message: "Todo not found",
          data: null,
        };
      }
      TodoService.deleteTodo(params.id);
      set.status = 200;
      return {
        success: true,
        message: "Todo deleted",
        data: null,
      };
    },
    {
      response: {
        200: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Null(),
        }),
        404: t.Object({
          success: t.Boolean(),
          message: t.String(),
          data: t.Null(),
        }),
      },
      tags: ["Todos"],
    }
  );
