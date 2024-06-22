const CommentLikeUseCase = require("../CommentLikeUseCase");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const CommentLikeRepository = require("../../../../Domains/comment_likes/CommentLikeRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");

describe("CommentLikeUseCase", () => {
  it("should orchestrating the add comment like action correctly", async () => {
    // Arrange
    const useCaseCredential = {
      id: "user-123",
    };

    const useCaseThreadId = {
      id: "thread-123",
    };

    const useCaseCommentId = {
      id: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentRepository.verifyCommentInThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockUserRepository.verifyUserAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentLikeRepository.verifyCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0));
    mockCommentLikeRepository.addCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const addCommentLike = new CommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const isLike = await addCommentLike.execute(
      useCaseThreadId.id,
      useCaseCommentId.id,
      useCaseCredential.id
    );

    // Assert
    expect(isLike).toEqual(1);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCaseThreadId.id
    );
    expect(
      mockCommentRepository.verifyCommentInThreadAvailability
    ).toHaveBeenCalledWith(useCaseCommentId.id, useCaseThreadId.id);
    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith(
      useCaseCredential.id
    );
    expect(mockCommentLikeRepository.verifyCommentLike).toHaveBeenCalledWith(
      useCaseCommentId.id,
      useCaseCredential.id
    );
    expect(mockCommentLikeRepository.addCommentLike).toHaveBeenCalledWith(
      useCaseThreadId.id,
      useCaseCommentId.id,
      useCaseCredential.id
    );
  });

  it("should orchestrating the delete comment like action correctly", async () => {
    // Arrange
    const useCaseCredential = {
      id: "user-123",
    };

    const useCaseThreadId = {
      id: "thread-123",
    };

    const useCaseCommentId = {
      id: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentRepository.verifyCommentInThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockUserRepository.verifyUserAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentLikeRepository.verifyCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentLikeRepository.deleteCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const deleteCommentLike = new CommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const isUnLike = await deleteCommentLike.execute(
      useCaseThreadId.id,
      useCaseCommentId.id,
      useCaseCredential.id
    );

    // Assert
    expect(isUnLike).toEqual(1);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCaseThreadId.id
    );
    expect(
      mockCommentRepository.verifyCommentInThreadAvailability
    ).toHaveBeenCalledWith(useCaseCommentId.id, useCaseThreadId.id);
    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith(
      useCaseCredential.id
    );
    expect(mockCommentLikeRepository.verifyCommentLike).toHaveBeenCalledWith(
      useCaseCommentId.id,
      useCaseCredential.id
    );
    expect(mockCommentLikeRepository.deleteCommentLike).toHaveBeenCalledWith(
      useCaseThreadId.id,
      useCaseCommentId.id,
      useCaseCredential.id
    );
  });
});
