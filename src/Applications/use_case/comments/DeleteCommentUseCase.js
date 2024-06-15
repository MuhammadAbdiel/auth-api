class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseCommentId, useCaseThreadId, useCaseCredential) {
    // verify thread availability
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);

    // verify comment availability
    await this._commentRepository.verifyCommentInThreadAvailability(
      useCaseCommentId,
      useCaseThreadId
    );

    // verify the owner of the comment
    await this._commentRepository.verifyCommentOwner(
      useCaseCommentId,
      useCaseCredential
    );

    // delete comment
    return await this._commentRepository.deleteComment(
      useCaseCommentId,
      useCaseThreadId,
      useCaseCredential
    );
  }
}

module.exports = DeleteCommentUseCase;
