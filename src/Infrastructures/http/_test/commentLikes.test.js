const pool = require("../../../Infrastructures/database/postgres/pool");
const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
} = require("../../../../tests/ServerInjectionFunctionHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/likes endpoint", () => {
  // Pre-requisite payload
  const commentPayload = {
    content: "This is comment",
  };

  const threadPayload = {
    title: "First Thread",
    body: "This is first thread",
  };

  const userPayload = {
    username: "dicoding",
    password: "secret",
    fullname: "Dicoding Indonesia",
  };

  const loginPayload = {
    username: "dicoding",
    password: "secret",
  };

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should return 401 when request not contain access token", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/thread-123/comments/comment-123/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should return 404 when thread not found", async () => {
      // Arrange
      const server = await createServer(container);

      // Add account
      await injection(server, addUserOption(userPayload));
      // login
      const auth = await injection(server, addAuthOption(loginPayload));
      const authToken = JSON.parse(auth.payload)?.data?.accessToken;

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/thread-123/comments/comment-123/likes`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread not found");
    });

    it("should return 404 when comment not found", async () => {
      // Arrange
      const server = await createServer(container);

      // Add account
      await injection(server, addUserOption(userPayload));
      // login
      const auth = await injection(server, addAuthOption(loginPayload));
      const authToken = JSON.parse(auth.payload)?.data?.accessToken;

      // add thread
      const thread = await injection(
        server,
        addThreadOption(threadPayload, authToken)
      );
      const threadId = JSON.parse(thread.payload)?.data?.addedThread.id;

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/comment-123/likes`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment not found");
    });

    it("should return 200 and return success", async () => {
      // Arrange
      const server = await createServer(container);

      // Add account
      await injection(server, addUserOption(userPayload));
      // login
      const auth = await injection(server, addAuthOption(loginPayload));
      const authToken = JSON.parse(auth.payload)?.data?.accessToken;

      // add thread
      const thread = await injection(
        server,
        addThreadOption(threadPayload, authToken)
      );
      const threadId = JSON.parse(thread.payload)?.data?.addedThread.id;

      // add comment
      const comment = await injection(
        server,
        addCommentOption(commentPayload, authToken, threadId)
      );
      const commentId = JSON.parse(comment.payload)?.data?.addedComment.id;

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
