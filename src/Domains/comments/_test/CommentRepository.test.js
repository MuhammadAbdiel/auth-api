const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behaviot", async () => {
    // Arrange
    const commentRepository = new CommentRepository();
    // Action and Assert

    await expect(commentRepository.addComment("", "", "")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentById("")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentByUserId("")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.verifyCommentInThreadAvailability("", "")
    ).rejects.toThrow("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.verifyCommentOwner("", "")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.getCommentByThreadId("")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteComment("", "", "")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
