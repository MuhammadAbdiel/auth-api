const CommentLikeRepositoryPostgres = require("../CommentLikeRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("CommentLikeRepositoryPostgres", () => {
  // Pre-requisite
  const userId = "user-123";
  const threadId = "thread-123";
  const commentId = "comment-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadTableTestHelper.addThread({ id: threadId, user_id: userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      user_id: userId,
      thread_id: threadId,
    });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addCommentLike function", () => {
    it("should persist added comment like", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedCommentLike =
        await commentLikeRepositoryPostgres.addCommentLike(
          threadId,
          commentId,
          userId
        );
      const commentLikes =
        await CommentLikesTableTestHelper.findCommentLikeById("like-123");

      // Assert
      expect(addedCommentLike).toBeTruthy();
      expect(commentLikes).toHaveLength(1);
    });
  });

  describe("deleteCommentLike function", () => {
    it("should delete comment like correctly", async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({
        id: "like-123",
        thread_id: threadId,
        comment_id: commentId,
        user_id: userId,
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const deletedCommentLike =
        await commentLikeRepositoryPostgres.deleteCommentLike(
          threadId,
          commentId,
          userId
        );
      const commentLikes =
        await CommentLikesTableTestHelper.findCommentLikeById("like-123");

      // Assert
      expect(deletedCommentLike).toBeTruthy();
      expect(commentLikes).toHaveLength(0);
    });
  });

  describe("verifyCommentLike function", () => {
    it("should return true if comment like exist", async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({
        id: "like-123",
        thread_id: threadId,
        comment_id: commentId,
        user_id: userId,
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const commentLike = await commentLikeRepositoryPostgres.verifyCommentLike(
        commentId,
        userId
      );

      // Assert
      expect(commentLike).toBeTruthy();
    });

    it("should return false if comment like not exist", async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const commentLike = await commentLikeRepositoryPostgres.verifyCommentLike(
        commentId,
        userId
      );

      // Assert
      expect(commentLike).toBeFalsy();
    });
  });

  describe("getCommentLikeCount function", () => {
    it("should return comment like count correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-321",
        username: "username",
      });
      await CommentLikesTableTestHelper.addCommentLike({
        id: "like-124",
        thread_id: threadId,
        comment_id: commentId,
        user_id: "user-321",
      });
      await CommentLikesTableTestHelper.addCommentLike({
        id: "like-123",
        thread_id: threadId,
        comment_id: commentId,
        user_id: userId,
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const commentLikeCount =
        await commentLikeRepositoryPostgres.getCommentLikeCount(threadId);

      // Assert
      expect(commentLikeCount).toStrictEqual([
        {
          comment_id: commentId,
        },
        {
          comment_id: commentId,
        },
      ]);
      expect(commentLikeCount).toHaveLength(2);
    });
  });
});
