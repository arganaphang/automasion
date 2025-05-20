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
  ): Todo | undefined {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      this.todos[todoIndex] = {
        ...this.todos[todoIndex]!,
        ...updatedTodo,
      };
    }
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
  .get("/", ({ set }) => {
    set.status = 200;
    return {
      success: true,
      message: "Todos fetched",
      data: TodoService.getTodos(),
    };
  })
  .get("/:id", ({ set, params }) => {
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
  })
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
    { body: t.Object({ title: t.String() }) }
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
    { body: t.Object({ title: t.String(), completed: t.Boolean() }) }
  )
  .delete("/:id", ({ set, params }) => {
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
  });
