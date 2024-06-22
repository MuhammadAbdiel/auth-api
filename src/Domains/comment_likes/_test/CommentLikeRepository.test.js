const CommentLikeRepository = require("../CommentLikeRepository");

describe("CommentLikeRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action and Assert
    await expect(
      commentLikeRepository.addCommentLike("", "", "")
    ).rejects.toThrow("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      commentLikeRepository.verifyCommentLike("", "")
    ).rejects.toThrow("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      commentLikeRepository.verifyCommentLikeOwner("", "")
    ).rejects.toThrow("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentLikeRepository.getCommentLikeCount("")).rejects.toThrow(
      "COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentLikeRepository.deleteCommentLike("", "", "")
    ).rejects.toThrow("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
