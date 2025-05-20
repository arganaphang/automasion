import { describe, test, expect } from "bun:test";
import { app } from "./super.test";

describe("Test Health Check", () => {
  test("GET /health", async () => {
    const response = await app.get("/healthz");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "OK",
    });
  });
});
