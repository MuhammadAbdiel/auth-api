class CommentLikeUseCase {
  constructor({
    threadRepository,
    commentRepository,
    commentLikeRepository,
    userRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentInThreadAvailability(
      commentId,
      threadId
    );
    await this._userRepository.verifyUserAvailability(userId);
    const isLike = await this._commentLikeRepository.verifyCommentLike(
      commentId,
      userId
    );

    if (isLike > 0) {
      return await this._commentLikeRepository.deleteCommentLike(
        threadId,
        commentId,
        userId
      );
    }

    return this._commentLikeRepository.addCommentLike(
      threadId,
      commentId,
      userId
    );
  }
}

module.exports = CommentLikeUseCase;
