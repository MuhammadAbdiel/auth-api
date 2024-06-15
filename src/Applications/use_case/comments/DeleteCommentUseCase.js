class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository, ownerValidator }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._ownerValidator = ownerValidator;
  }

  async execute(useCaseCommentId, useCaseThreadId, useCaseCredential) {
    // verify thread availability
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);

    // get comment
    const comment = await this._commentRepository.getCommentById(
      useCaseCommentId
    );

    // verify the owner of the comment
    await this._ownerValidator.verifyOwner(
      useCaseCredential,
      comment.user_id,
      "comment"
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
