const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  /**
   * Testing the comment use case
   * can orchestra step by step
   * for adding the delete comment correctly
   */

  it("should orchestrating the delete comment", async () => {
    // Arrange
    const useCaseCommentId = "comment-212";
    const useCaseThreadId = "thread-212";
    const useCaseCredential = "user-212";

    const commentAvailable = {
      id: useCaseCommentId,
      user_id: useCaseCredential,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed fucntion */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentRepository.verifyCommentInThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(
      useCaseCommentId,
      useCaseThreadId,
      useCaseCredential
    );

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCaseThreadId
    );
    expect(
      mockCommentRepository.verifyCommentInThreadAvailability
    ).toHaveBeenCalledWith(useCaseCommentId, useCaseThreadId);
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      useCaseCommentId,
      useCaseCredential
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCaseCommentId,
      useCaseThreadId,
      useCaseCredential
    );
  });
});
