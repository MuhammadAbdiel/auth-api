const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const CommentRepositoryPostgress = require("../CommentRepositoryPostgres");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  // Pre-requisite
  const userId = "user-123";
  const threadId = "thread-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist added comment", async () => {
      // Arrange
      const newComment = new NewComment({
        content: "This is a comment",
      });

      const fakeIdGenerator = () => "222";
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById(
        "comment-222"
      );

      expect(comment).toHaveLength(1);
      expect(comment).toStrictEqual([
        {
          id: "comment-222",
          content: "This is a comment",
          thread_id: threadId,
          user_id: userId,
          is_delete: false,
          created_at: comment[0].created_at,
        },
      ]);
      expect(comment[0].id).toStrictEqual("comment-222");
      expect(comment[0].content).toStrictEqual("This is a comment");
      expect(comment[0].thread_id).toStrictEqual(threadId);
      expect(comment[0].user_id).toStrictEqual(userId);
      expect(comment[0].is_delete).toBe(false);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      const newComment = new NewComment({
        content: "This is a comment",
      });

      const fakeIdGenerator = () => "222";
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );

      // Assert

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-222",
          content: "This is a comment",
          owner: userId,
        })
      );
    });
  });

  describe("getCommentById", () => {
    it("should return undefined when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        "wrong-comment"
      );

      // Assert
      expect(comment).toBeUndefined();
    });

    it("should return comment correctly", async () => {
      // Arrange
      const commentData = {
        id: "comment-333",
        content: "This is a comment",
        user_id: userId,
        thread_id: threadId,
        created_at: new Date(),
        is_delete: false,
      };
      await CommentsTableTestHelper.addComment(commentData);
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        "comment-333"
      );

      // Assert
      expect(comment).toHaveProperty("id", commentData.id);
      expect(comment).toHaveProperty("content", commentData.content);
      expect(comment).toHaveProperty("user_id", commentData.user_id);
      expect(comment).toHaveProperty("thread_id", commentData.thread_id);
      expect(comment).toHaveProperty("created_at");
      expect(new Date(comment.created_at)).toStrictEqual(
        commentData.created_at
      );
      expect(comment).toHaveProperty("is_delete", commentData.is_delete);
    });
  });

  describe("getCommentByUserId", () => {
    it("should return undefined when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentByUserId(
        "wrong-user-id"
      );

      // Assert
      expect(comments).toBeUndefined();
    });

    it("should return comment correctly", async () => {
      // Arrange
      const commentData = {
        id: "comment-333",
        content: "This is a comment",
        user_id: userId,
        thread_id: threadId,
        created_at: new Date(),
        is_delete: false,
      };
      await CommentsTableTestHelper.addComment(commentData);
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentByUserId(
        userId
      );

      // Assert
      expect(comments.id).toStrictEqual(commentData.id);
      expect(comments.content).toStrictEqual(commentData.content);
      expect(comments.user_id).toStrictEqual(commentData.user_id);
      expect(comments.thread_id).toStrictEqual(commentData.thread_id);
      expect(comments.is_delete).toStrictEqual(commentData.is_delete);
    });
  });

  describe("verifyCommentInThreadAvailability", () => {
    it("should return NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentInThreadAvailability(
          "wrong-comment",
          threadId
        )
      ).rejects.toThrow(NotFoundError);
    });

    it("should not return NotFoundError when comment found", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentInThreadAvailability(
          "comment-333",
          threadId
        )
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyCommentOwner", () => {
    it("should return AuthorizationError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("wrong-comment", userId)
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not return AuthorizationError when comment found", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-333", userId)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("getCommentByThreadId", () => {
    it("should return comments correctly", async () => {
      // Arrange
      const commentsData = [
        {
          id: "comment-333",
          content: "First comment",
          user_id: userId,
          thread_id: threadId,
          created_at: new Date(),
          is_delete: false,
        },
        {
          id: "comment-222",
          content: "Second comment",
          user_id: userId,
          thread_id: threadId,
          created_at: new Date(),
          is_delete: false,
        },
        {
          id: "comment-111",
          content: "Third comment",
          user_id: userId,
          thread_id: threadId,
          created_at: new Date(),
          is_delete: false,
        },
      ];
      await CommentsTableTestHelper.addComment(commentsData[0]);
      await CommentsTableTestHelper.addComment(commentsData[1]);
      await CommentsTableTestHelper.addComment(commentsData[2]);
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      // Assert
      expect(comments).toHaveLength(3);
      comments.forEach((comment, index) => {
        expect(comment.id).toStrictEqual(commentsData[index].id);
        expect(comment.content).toStrictEqual(commentsData[index].content);
        expect(comment.user_id).toStrictEqual(commentsData[index].user_id);
        expect(comment.thread_id).toStrictEqual(commentsData[index].thread_id);
        expect(new Date(comment.created_at)).toStrictEqual(
          commentsData[index].created_at
        );
        expect(comment.is_delete).toStrictEqual(commentsData[index].is_delete);
      });
    });

    it("should return empty array if there is no comment correctly", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      // Assert
      expect(Array.isArray(comments)).toBeTruthy;
      expect(comments).toHaveLength(0);
    });
  });

  describe("deleteComment", () => {
    it("should delete comment correctly and persist comment", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
        is_delete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      await commentRepositoryPostgres.deleteComment(
        "comment-333",
        threadId,
        userId
      );
      const deletedComment = await CommentsTableTestHelper.getCommentById(
        "comment-333"
      );

      // Assert
      expect(deletedComment[0].is_delete).toStrictEqual(true);
    });

    it("should return InvariantError when failed to delete comment", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment(
          "comment-111",
          "thread-121",
          "user-123"
        )
      ).rejects.toThrow(InvariantError);
    });
  });
});
