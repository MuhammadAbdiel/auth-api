const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

class DeleteCommentReplyUseCase {
  constructor({ commentReplyRepository }) {
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(
    useCaseCommentReplyId,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    // verify comment availability
    await this._commentReplyRepository.verifyCommentReplyAvailability(
      useCaseCommentReplyId
    );

    // verify the owner of the comment
    await this._commentReplyRepository.verifyCommentReplyOwner(
      useCaseCommentReplyId,
      useCaseCredential
    );

    // delete comment
    return await this._commentReplyRepository.deleteCommentReply(
      useCaseCommentReplyId,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );
  }
}

module.exports = DeleteCommentReplyUseCase;
