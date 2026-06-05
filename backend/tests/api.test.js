import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import app from "../src/app.js";

const request = supertest(app);

let testToken = "";
let testUserId = 0;

describe("Auth API", () => {
  it("POST /api/auth/register - should register a new user", async () => {
    const res = await request.post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("name", "Test User");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
    expect(res.body.user).not.toHaveProperty("password");

    testToken = res.body.token;
    testUserId = res.body.user.id;
  });

  it("POST /api/auth/register - should reject duplicate email", async () => {
    const res = await request.post("/api/auth/register").send({
      name: "Another User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/auth/register - should validate required fields", async () => {
    const res = await request.post("/api/auth/register").send({
      email: "bad",
      password: "12",
    });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/login - should login with valid credentials", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });

  it("POST /api/auth/login - should reject invalid password", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/auth/login - should reject non-existent email", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
  });
});

describe("JWT Middleware", () => {
  it("GET /api/users/me - should reject without token", async () => {
    const res = await request.get("/api/users/me");
    expect(res.status).toBe(401);
  });

  it("GET /api/users/me - should reject invalid token", async () => {
    const res = await request
      .get("/api/users/me")
      .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(401);
  });

  it("GET /api/users/me - should return user profile with valid token", async () => {
    const res = await request
      .get("/api/users/me")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });
});

describe("Tasks API", () => {
  let testTeamId = 0;
  let testTaskId = 0;

  it("POST /api/teams - should create a team", async () => {
    const res = await request
      .post("/api/teams")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "Test Team", description: "A team for testing" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name", "Test Team");
    testTeamId = res.body.id;
  });

  it("POST /api/tasks - should create a task", async () => {
    const res = await request
      .post("/api/tasks")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        title: "Test Task",
        description: "A task for testing",
        teamId: testTeamId,
        priority: "high",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Task");
    expect(res.body).toHaveProperty("priority", "high");
    expect(res.body).toHaveProperty("status", "todo");
    testTaskId = res.body.id;
  });

  it("PUT /api/tasks/:id - should update task status", async () => {
    const res = await request
      .put(`/api/tasks/${testTaskId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ status: "done" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "done");
  });

  it("GET /api/tasks - should list tasks with pagination", async () => {
    const res = await request
      .get("/api/tasks")
      .set("Authorization", `Bearer ${testToken}`)
      .query({ teamId: testTeamId, page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("tasks");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page", 1);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it("GET /api/tasks/stats - should return task statistics", async () => {
    const res = await request
      .get("/api/tasks/stats")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("done");
    expect(res.body).toHaveProperty("todo");
    expect(res.body).toHaveProperty("inProgress");
  });

  it("DELETE /api/tasks/:id - should delete a task", async () => {
    const res = await request
      .delete(`/api/tasks/${testTaskId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(204);
  });

  it("DELETE /api/teams/:id - should delete a team", async () => {
    const res = await request
      .delete(`/api/teams/${testTeamId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(204);
  });
});
