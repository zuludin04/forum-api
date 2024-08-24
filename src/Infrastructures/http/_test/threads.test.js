const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      const requestPayload = {
        title: "abc",
        body: "description",
      };
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      const requestPayload = { title: "abc" };
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru");
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      const requestPayload = { title: 123456, body: [] };
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena data tidak sesuai"
      );
    });
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
      const requestPayload = { content: "comment" };
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "abc",
        body: "description",
        owner: "user-123",
      });

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      const requestPayload = {};
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat comment baru");
    });

    it("should response 400 when request payload meet data specification", async () => {
      const requestPayload = { content: 123 };
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat comment baru karena data tidak sesuai"
      );
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 404 when comment was not found", async () => {
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "abc",
        body: "description",
        owner: "user-123",
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
        date: Date.now() / 1000,
      });

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-124",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("shuold response 404 when thread was not found", async () => {
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "abc",
        body: "description",
        owner: "user-123",
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-124/comments/comment-123",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 200 when success delete comment", async () => {
      const server = await createServer(container);
      const token = await ServerTestHelper.getAccessToken();
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "abc",
        body: "description",
        owner: "user-123",
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 404 when thread is not found", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-124",
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 200 when success load detail thread", async () => {
      const server = await createServer(container);

      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "abc",
        body: "description",
        owner: "user-123",
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "comment",
        owner: "user-123",
        thread: "thread-123",
        date: Date.now() / 1000,
      });

      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-123",
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
