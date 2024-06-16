const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

class DeleteCommentReplyUseCase {
  constructor({ commentReplyRepository, ownerValidator }) {
    this._commentReplyRepository = commentReplyRepository;
    this._ownerValidator = ownerValidator;
  }

  async execute(
    useCaseCommentReplyId,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    // get comment and also verify it
    const commentReply = await this._commentReplyRepository.getCommentReplyById(
      useCaseCommentReplyId
    );
    if (!commentReply) {
      throw new NotFoundError("comment reply not found");
    }

    // verify the owner of the comment
    await this._ownerValidator.verifyOwner(
      useCaseCredential,
      commentReply.user_id,
      "comment reply"
    );
    // delete comment
    return await this._commentReplyRepository.deleteCommentReply(
      commentReply.id,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );
  }
}

module.exports = DeleteCommentReplyUseCase;
